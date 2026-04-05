// All DB calls go through /api/sql proxy (Vercel serverless fn / Vite dev middleware).
// This avoids browser DNS issues with direct Neon endpoints.

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

export interface Invitation {
  id: string;
  personName: string;
  nickname: string;
  email: string;
  sentBy: string;
  withFamily: boolean;
  customMessage: string;
  createdAt: string;
  lastOpenedAt: string | null;
  visitCount: number;
  isDeleted: boolean;
  deletedBy: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  lastAccessedAt: string | null;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export async function getInvitations(): Promise<Invitation[]> {
  try {
    const rows = await query("SELECT * FROM invitations ORDER BY created_at DESC");
    return rows.map(r => ({
      id: r.id as string,
      personName: r.person_name as string,
      nickname: r.nickname as string,
      email: r.email as string,
      sentBy: r.sent_by as string,
      withFamily: r.with_family as boolean,
      customMessage: r.custom_message as string,
      createdAt: r.created_at ? new Date(r.created_at as string).toISOString() : new Date().toISOString(),
      lastOpenedAt: r.last_opened_at ? new Date(r.last_opened_at as string).toISOString() : null,
      visitCount: (r.visit_count as number) ?? 0,
      isDeleted: r.is_deleted === true,
      deletedBy: (r.deleted_by as string) ?? "",
    }));
  } catch (e) {
    console.error("getInvitations error:", e);
    return [];
  }
}

export async function getInvitationById(id: string): Promise<Invitation | undefined> {
  const invitations = await getInvitations();
  return invitations.find(inv => inv.id === id);
}

export async function addInvitation(inv: Omit<Invitation, "id" | "createdAt" | "lastOpenedAt" | "visitCount">): Promise<Invitation> {
  const id = generateId();
  const now = new Date().toISOString();
  await query(
    "INSERT INTO invitations (id, person_name, nickname, email, sent_by, with_family, custom_message, created_at, visit_count, is_deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,FALSE)",
    [id, inv.personName, inv.nickname, inv.email, inv.sentBy, inv.withFamily, inv.customMessage, now]
  );
  return { ...inv, id, createdAt: now, lastOpenedAt: null, visitCount: 0, isDeleted: false, deletedBy: "" };
}

export async function updateInvitation(id: string, updates: Partial<Omit<Invitation, "id" | "createdAt">>): Promise<Invitation | null> {
  if (updates.personName !== undefined) await query("UPDATE invitations SET person_name=$1 WHERE id=$2", [updates.personName, id]);
  if (updates.nickname !== undefined) await query("UPDATE invitations SET nickname=$1 WHERE id=$2", [updates.nickname, id]);
  if (updates.email !== undefined) await query("UPDATE invitations SET email=$1 WHERE id=$2", [updates.email, id]);
  if (updates.sentBy !== undefined) await query("UPDATE invitations SET sent_by=$1 WHERE id=$2", [updates.sentBy, id]);
  if (updates.withFamily !== undefined) await query("UPDATE invitations SET with_family=$1 WHERE id=$2", [updates.withFamily, id]);
  if (updates.customMessage !== undefined) await query("UPDATE invitations SET custom_message=$1 WHERE id=$2", [updates.customMessage, id]);
  if (updates.lastOpenedAt !== undefined) await query("UPDATE invitations SET last_opened_at=$1 WHERE id=$2", [updates.lastOpenedAt, id]);
  if (updates.visitCount !== undefined) await query("UPDATE invitations SET visit_count=$1 WHERE id=$2", [updates.visitCount, id]);
  return getInvitations().then(arr => arr.find(a => a.id === id) || null);
}

export async function deleteInvitation(id: string, deletedBy: string = ""): Promise<boolean> {
  await query("UPDATE invitations SET is_deleted=TRUE, deleted_by=$2 WHERE id=$1", [id, deletedBy]);
  return true;
}

export async function hardDeleteInvitation(id: string): Promise<boolean> {
  await query("DELETE FROM invitations WHERE id=$1", [id]);
  return true;
}

export async function restoreInvitation(id: string): Promise<boolean> {
  await query("UPDATE invitations SET is_deleted=FALSE, deleted_by='' WHERE id=$1", [id]);
  return true;
}

export async function recordInvitationOpenById(id: string): Promise<void> {
  const now = new Date().toISOString();
  await query("UPDATE invitations SET last_opened_at=$1, visit_count=visit_count+1 WHERE id=$2", [now, id]);
}

export async function getAdmins(): Promise<AdminUser[]> {
  try {
    const rows = await query("SELECT * FROM admins ORDER BY created_at DESC");
    return rows.map(r => ({
      id: r.id as string,
      name: r.name as string,
      email: r.email as string,
      phone: (r.phone as string) ?? "",
      createdAt: r.created_at ? new Date(r.created_at as string).toISOString() : new Date().toISOString(),
      lastAccessedAt: r.last_accessed_at ? new Date(r.last_accessed_at as string).toISOString() : null,
    }));
  } catch (e) {
    console.error("getAdmins error:", e);
    return [];
  }
}

export async function addAdmin(name: string, email: string = "", phone: string = ""): Promise<AdminUser> {
  const id = generateId();
  const now = new Date().toISOString();
  await query(
    "INSERT INTO admins (id, name, email, phone, created_at) VALUES ($1,$2,$3,$4,$5)",
    [id, name, email, phone, now]
  );
  return { id, name, email, phone, createdAt: now, lastAccessedAt: null };
}

export async function updateAdmin(id: string, updates: Partial<Omit<AdminUser, "id" | "createdAt">>): Promise<AdminUser | null> {
  if (updates.name !== undefined) await query("UPDATE admins SET name=$1 WHERE id=$2", [updates.name, id]);
  if (updates.email !== undefined) await query("UPDATE admins SET email=$1 WHERE id=$2", [updates.email, id]);
  if (updates.phone !== undefined) await query("UPDATE admins SET phone=$1 WHERE id=$2", [updates.phone, id]);
  if (updates.lastAccessedAt !== undefined) await query("UPDATE admins SET last_accessed_at=$1 WHERE id=$2", [updates.lastAccessedAt, id]);
  return getAdmins().then(arr => arr.find(a => a.id === id) || null);
}

export async function deleteAdmin(id: string): Promise<boolean> {
  await query("DELETE FROM admins WHERE id=$1", [id]);
  return true;
}

export async function recordAdminAccess(id: string): Promise<void> {
  const now = new Date().toISOString();
  await query("UPDATE admins SET last_accessed_at=$1 WHERE id=$2", [now, id]);
}

export async function getAdminById(id: string): Promise<AdminUser | undefined> {
  return getAdmins().then(arr => arr.find(a => a.id === id));
}

export function getInviteUrl(id: string): string {
  return `${window.location.origin}/invite/${encodeURIComponent(id)}`;
}

export function getSecondaryAdminUrl(adminId: string): string {
  return `${window.location.origin}/admin/user/${adminId}`;
}

export function generateShareText(inv: Invitation, eventDate?: Date): string {
  const familyText = inv.withFamily ? " & Family" : "";
  const name = inv.personName;

  let formattedDate = "20th April 2026, 08:30 AM onwards";
  if (eventDate) {
    formattedDate =
      eventDate.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }) +
      " at " +
      eventDate.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  let text = `You are warmly invited!\n\n`;
  text += `Dear ${name}${familyText},\n\n`;
  text += `We cordially invite you to the joyous occasion of our Housewarming Ceremony at our new home, Sada Sri Nilayam.\n\n`;

  if (inv.customMessage) {
    text += `A Special Note For You:\n${inv.customMessage}\n\n`;
  }

  text += `Venue:\nSada Sri Nilayam, Lane 4A DX-H-33,\nGatikrushna Green, Rangabazar, Bhubneswar\n\n`;
  text += `Date & Time:\n${formattedDate}\n\n`;
  text += `Please find your detailed invitation card and location map at the link below:\n`;
  text += getInviteUrl(inv.id);

  return text;
}

export async function shareContent(title: string, text: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return "shared";
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
    throw new Error("No sharing or clipboard API");
  } catch (err: any) {
    if (err.name === "AbortError") return "failed";
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
  }
}

export async function getEventDate(): Promise<Date> {
  try {
    const rows = await query("SELECT value FROM config WHERE key_name='event_date'");
    if (rows.length > 0) return new Date(rows[0].value as string);
  } catch (e) {
    console.error("getEventDate error:", e);
  }
  return new Date("2026-04-20T08:30:00+05:30");
}

export async function setEventDate(date: Date): Promise<void> {
  const ds = date.toISOString();
  await query(
    "INSERT INTO config (key_name, value) VALUES ('event_date',$1) ON CONFLICT (key_name) DO UPDATE SET value=$1",
    [ds]
  );
}
