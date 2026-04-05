// Gallery items: images (URL) and video links managed by Master Admin

async function query(sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
  const res = await fetch("/api/sql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql, params }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.rows as Record<string, unknown>[];
}

export type MediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  type: MediaType;
  url: string;
  caption: string;
  displayOrder: number;
  createdAt: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Ensure table exists (idempotent)
export async function ensureGalleryTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'image',
      url TEXT NOT NULL,
      caption TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const rows = await query("SELECT * FROM gallery_items ORDER BY display_order ASC, created_at ASC");
    return rows.map((r) => ({
      id: r.id as string,
      type: (r.type as MediaType) || "image",
      url: r.url as string,
      caption: (r.caption as string) || "",
      displayOrder: (r.display_order as number) ?? 0,
      createdAt: r.created_at ? new Date(r.created_at as string).toISOString() : new Date().toISOString(),
    }));
  } catch (e) {
    console.error("getGalleryItems error:", e);
    return [];
  }
}

export async function addGalleryItem(item: Pick<GalleryItem, "type" | "url" | "caption">): Promise<GalleryItem> {
  const id = generateId();
  const now = new Date().toISOString();
  // Put new item at the end
  const existing = await getGalleryItems();
  const maxOrder = existing.length > 0 ? Math.max(...existing.map((e) => e.displayOrder)) : -1;
  const order = maxOrder + 1;
  await query(
    "INSERT INTO gallery_items (id, type, url, caption, display_order, created_at) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, item.type, item.url, item.caption, order, now]
  );
  return { id, type: item.type, url: item.url, caption: item.caption, displayOrder: order, createdAt: now };
}

export async function updateGalleryItem(id: string, updates: Partial<Pick<GalleryItem, "url" | "caption" | "displayOrder">>): Promise<void> {
  if (updates.url !== undefined) await query("UPDATE gallery_items SET url=$1 WHERE id=$2", [updates.url, id]);
  if (updates.caption !== undefined) await query("UPDATE gallery_items SET caption=$1 WHERE id=$2", [updates.caption, id]);
  if (updates.displayOrder !== undefined) await query("UPDATE gallery_items SET display_order=$1 WHERE id=$2", [updates.displayOrder, id]);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await query("DELETE FROM gallery_items WHERE id=$1", [id]);
}

export async function reorderGalleryItems(orderedIds: string[]): Promise<void> {
  await Promise.all(orderedIds.map((id, idx) => query("UPDATE gallery_items SET display_order=$1 WHERE id=$2", [idx, id])));
}

// ---------- Video URL helpers ----------

export function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  return null;
}

export function getVideoEmbedUrl(url: string): { embedUrl: string; kind: "youtube" | "direct" } | null {
  const ytUrl = getYouTubeEmbedUrl(url);
  if (ytUrl) return { embedUrl: ytUrl, kind: "youtube" };
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return { embedUrl: url, kind: "direct" };
  return null;
}

export function isVideoUrl(url: string): boolean {
  return getVideoEmbedUrl(url) !== null;
}
