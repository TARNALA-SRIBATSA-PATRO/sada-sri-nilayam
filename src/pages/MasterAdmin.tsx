import { useState, useEffect, useMemo } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import {
  getInvitations,
  addInvitation,
  updateInvitation,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAdmins,
  getInviteUrl,
  getSecondaryAdminUrl,
  getEventDate,
  setEventDate,
  generateShareText,
  shareContent,
  deleteInvitation,
  restoreInvitation,
  hardDeleteInvitation,
  type Invitation,
  type AdminUser,
} from "@/lib/invitations";
import {
  getGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  ensureGalleryTable,
  isVideoUrl,
  type GalleryItem,
} from "@/lib/gallery";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const inputStyle = {
  background: "hsl(var(--ivory-warm))",
  border: "1px solid hsl(var(--border))",
};

const MasterAdmin = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<{ invite: string; admin: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [showDeletedInvitations, setShowDeletedInvitations] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDate, setLoadingDate] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "invitation" | "admin" | "gallery";
    id: string;
    name: string;
    hard?: boolean;
  } | null>(null);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaCaption, setNewMediaCaption] = useState("");
  const [addingMedia, setAddingMedia] = useState(false);
  const [editGalleryItem, setEditGalleryItem] = useState<GalleryItem | null>(null);
  const [editGalleryCaption, setEditGalleryCaption] = useState("");

  const [editInv, setEditInv] = useState<Invitation | null>(null);
  const [editForm, setEditForm] = useState({ personName: "", nickname: "", email: "", withFamily: false, customMessage: "" });

  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
  const [editAdminForm, setEditAdminForm] = useState({ name: "", email: "", phone: "" });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "lastOpened" | "byAdmin">("newest");
  const [filterAdmin, setFilterAdmin] = useState("");

  // Event date config
  const [eventDateStr, setEventDateStr] = useState("");
  const [eventTimeStr, setEventTimeStr] = useState("");
  const [dateSaved, setDateSaved] = useState(false);

  const PASSCODE = "sada2024master";

  const reload = async () => {
    try {
      const [invs, adms] = await Promise.all([getInvitations(), getAdmins()]);
      setInvitations(invs);
      setAdmins(adms);
    } catch (e) {
      setError("Failed to load data. Check your connection.");
    }
  };

  const reloadGallery = async () => {
    setGalleryLoading(true);
    try {
      const items = await getGalleryItems();
      setGalleryItems(items);
    } catch (e) {
      setError("Failed to load gallery.");
    } finally {
      setGalleryLoading(false);
    }
  };

  const reloadWithLoading = async () => {
    setLoadingData(true);
    await reload();
    setLoadingData(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    reloadWithLoading();
    reloadGallery();
    ensureGalleryTable().catch(() => {});
    getEventDate().then(d => {
      const pad = (n: number) => String(n).padStart(2, "0");
      setEventDateStr(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
      setEventTimeStr(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
    }).catch(() => {
      setEventDateStr("2026-04-20");
      setEventTimeStr("08:30");
    });
  }, [isAuthenticated]);

  const handlePasscode = () => {
    if (passcode.trim().toLowerCase() === PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setPasscode("");
    }
  };

  const adminNames = useMemo(() => {
    const names = new Set(invitations.map((i) => i.sentBy));
    return Array.from(names).sort();
  }, [invitations]);

  const filteredInvitations = useMemo(() => {
    let list = invitations;
    list = list.filter((i) => i.isDeleted === showDeletedInvitations);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.personName.toLowerCase().includes(q) ||
          i.nickname.toLowerCase().includes(q) ||
          i.sentBy.toLowerCase().includes(q)
      );
    }
    if (sortBy === "byAdmin" && filterAdmin) {
      list = list.filter((i) => i.sentBy === filterAdmin);
    }
    if (sortBy === "lastOpened") {
      list = [...list].sort((a, b) => {
        if (!a.lastOpenedAt && !b.lastOpenedAt) return 0;
        if (!a.lastOpenedAt) return 1;
        if (!b.lastOpenedAt) return -1;
        return new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime();
      });
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [invitations, searchQuery, sortBy, filterAdmin, showDeletedInvitations]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoadingCreate(true);
    setError(null);
    try {
      const admin = await addAdmin(name.trim(), email.trim(), phone.trim());
      const newInv = await addInvitation({
        personName: name.trim(),
        nickname: "",
        email: email.trim(),
        sentBy: "Master Admin",
        withFamily: false,
        customMessage: "",
        isDeleted: false,
        deletedBy: "",
      });
      await reload();
      setGeneratedLinks({ invite: getInviteUrl(newInv.id), admin: getSecondaryAdminUrl(admin.id) });
      setName(""); setEmail(""); setPhone("");
    } catch (e) {
      setError("Failed to create admin & invitation. Please try again.");
      console.error(e);
    } finally {
      setLoadingCreate(false);
    }
  };

  const copyLink = (link: string, label: string) => {
    navigator.clipboard.writeText(link);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoadingDelete(true);
    try {
      if (deleteTarget.type === "invitation") {
        if (deleteTarget.hard) await hardDeleteInvitation(deleteTarget.id);
        else await deleteInvitation(deleteTarget.id, "Master Admin");
        await reload();
      } else if (deleteTarget.type === "gallery") {
        await deleteGalleryItem(deleteTarget.id);
        await reloadGallery();
      } else {
        await deleteAdmin(deleteTarget.id);
        await reload();
      }
      setDeleteTarget(null);
    } catch (e) {
      setError("Delete failed. Please try again.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleRestoreInv = async (id: string) => {
    try {
      await restoreInvitation(id);
      await reload();
    } catch (e) {
      setError("Restore failed. Please try again.");
    }
  };

  const openEditInv = (inv: Invitation) => {
    setEditInv(inv);
    setEditForm({ personName: inv.personName, nickname: inv.nickname, email: inv.email, withFamily: inv.withFamily, customMessage: inv.customMessage });
  };

  const saveEditInv = async () => {
    if (!editInv) return;
    setLoadingSave(true);
    try {
      await updateInvitation(editInv.id, editForm);
      setEditInv(null);
      await reload();
    } catch (e) {
      setError("Failed to save changes.");
    } finally {
      setLoadingSave(false);
    }
  };

  const openEditAdmin = (admin: AdminUser) => {
    setEditAdmin(admin);
    setEditAdminForm({ name: admin.name, email: admin.email, phone: admin.phone });
  };

  const saveEditAdmin = async () => {
    if (!editAdmin) return;
    setLoadingSave(true);
    try {
      await updateAdmin(editAdmin.id, editAdminForm);
      setEditAdmin(null);
      await reload();
    } catch (e) {
      setError("Failed to save admin changes.");
    } finally {
      setLoadingSave(false);
    }
  };

  // Gallery handlers
  const handleAddMedia = async () => {
    if (!newMediaUrl.trim()) return;
    setAddingMedia(true);
    try {
      const type = isVideoUrl(newMediaUrl.trim()) ? "video" : "image";
      await addGalleryItem({ type, url: newMediaUrl.trim(), caption: newMediaCaption.trim() });
      setNewMediaUrl("");
      setNewMediaCaption("");
      await reloadGallery();
    } catch (e) {
      setError("Failed to add media item.");
    } finally {
      setAddingMedia(false);
    }
  };

  const handleSaveGalleryCaption = async () => {
    if (!editGalleryItem) return;
    try {
      await updateGalleryItem(editGalleryItem.id, { caption: editGalleryCaption });
      setEditGalleryItem(null);
      await reloadGallery();
    } catch (e) {
      setError("Failed to update caption.");
    }
  };

  const saveEventDate = async () => {
    if (!eventDateStr || !eventTimeStr) return;
    setLoadingDate(true);
    setError(null);
    try {
      const d = new Date(`${eventDateStr}T${eventTimeStr}:00`);
      await setEventDate(d);
      setDateSaved(true);
      setTimeout(() => setDateSaved(false), 3000);
    } catch (e) {
      setError("Failed to update event date. Please try again.");
      console.error(e);
    } finally {
      setLoadingDate(false);
    }
  };

  // ── Passcode Gate ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "hsl(var(--background))" }}>
        <div className="card-ornate p-8 w-full max-w-sm text-center space-y-6">
          <div>
            <h1 className="text-display text-2xl font-bold mb-1" style={{ color: "hsl(var(--primary))" }}>Master Admin</h1>
            <p className="text-body-serif text-sm text-muted-foreground">SADA SRI NILAYAM</p>
          </div>
          <div>
            <label className="text-body-serif text-sm text-muted-foreground block mb-2 text-left">Enter Passcode</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setPasscodeError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handlePasscode()}
              placeholder="Enter master passcode"
              className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              style={inputStyle}
              autoFocus
            />
            {passcodeError && (
              <p className="text-body-serif text-xs mt-2 text-left" style={{ color: "hsl(0, 70%, 45%)" }}>
                Incorrect passcode. Please try again.
              </p>
            )}
          </div>
          <button
            onClick={handlePasscode}
            className="w-full px-6 py-2.5 rounded-lg text-display font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))", boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.25)" }}
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <header className="sticky top-0 z-40 px-6 py-4" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", boxShadow: "0 4px 24px hsla(345, 70%, 28%, 0.3)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-display text-xl sm:text-2xl font-bold" style={{ color: "hsl(var(--gold))" }}>Master Admin Panel</h1>
            <p className="text-body-serif text-sm mt-0.5" style={{ color: "hsla(40, 33%, 96%, 0.7)" }}>SADA SRI NILAYAM</p>
          </div>
          <a href="/" className="text-body-serif text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.03]" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--gold))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>
            View Invitation
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm text-body-serif" style={{ background: "hsla(0, 70%, 50%, 0.1)", border: "1px solid hsla(0, 70%, 50%, 0.3)", color: "hsl(0, 70%, 40%)" }}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="text-xs font-semibold hover:opacity-70 shrink-0">Dismiss</button>
          </div>
        )}

        {/* Dashboard Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { value: invitations.filter(i => !i.isDeleted).length, label: "Active Invitations" },
            { value: admins.length, label: "Total Admins" },
            { value: invitations.filter((i) => i.lastOpenedAt && !i.isDeleted).length, label: "Opened" },
          ].map(({ value, label }) => (
            <div key={label} className={`card-ornate p-5 text-center ${label === "Opened" ? "col-span-2 sm:col-span-1" : ""}`}>
              {loadingData ? (
                <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>
              ) : (
                <p className="text-display text-2xl sm:text-3xl font-bold" style={{ color: "hsl(var(--primary))" }}>{value}</p>
              )}
              <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Event Date Config */}
        <section className="card-ornate p-6 sm:p-8">
          <h2 className="text-display text-lg sm:text-xl font-semibold mb-4" style={{ color: "hsl(var(--primary))" }}>Event Date & Time</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Date</label>
              <input type="date" value={eventDateStr} onChange={(e) => setEventDateStr(e.target.value)} className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div className="flex-1">
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Time</label>
              <input type="time" value={eventTimeStr} onChange={(e) => setEventTimeStr(e.target.value)} className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <button
              onClick={saveEventDate}
              disabled={loadingDate || !eventDateStr || !eventTimeStr}
              className="px-6 py-2.5 rounded-lg text-display font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shrink-0 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              style={{ background: dateSaved ? "hsl(140, 50%, 40%)" : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))", boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.25)" }}
            >
              {loadingDate && <Loader2 className="h-4 w-4 animate-spin" />}
              {dateSaved ? "✓ Saved!" : "Update Date"}
            </button>
          </div>
        </section>

        {/* ── Gallery Manager ───────────────────────────────────────────────── */}
        <section className="card-ornate p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-display text-lg sm:text-xl font-semibold" style={{ color: "hsl(var(--primary))" }}>Gallery Manager</h2>
              <p className="text-body-serif text-xs text-muted-foreground mt-0.5">Add images (URL) or video links (YouTube / MP4). They display in the slideshow on the invitation page.</p>
            </div>
            <button
              onClick={reloadGallery}
              disabled={galleryLoading}
              className="p-2.5 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}
              aria-label="Refresh gallery"
            >
              <RefreshCw className={`h-4 w-4 ${galleryLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Add new media */}
          <div className="p-4 rounded-xl mb-6 space-y-3" style={{ background: "hsla(43, 85%, 52%, 0.06)", border: "1px solid hsla(43, 85%, 52%, 0.2)" }}>
            <p className="text-body-serif text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>Add New Media</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-body-serif text-xs text-muted-foreground block mb-1">Image URL or Video Link</label>
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://... (image URL or YouTube/MP4 link)"
                  className="w-full px-3 py-2 rounded-lg text-body-serif text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-body-serif text-xs text-muted-foreground block mb-1">Caption (optional)</label>
                <input
                  type="text"
                  value={newMediaCaption}
                  onChange={(e) => setNewMediaCaption(e.target.value)}
                  placeholder="e.g. Living room, Front view..."
                  className="w-full px-3 py-2 rounded-lg text-body-serif text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  style={inputStyle}
                />
              </div>
            </div>
            {newMediaUrl && (
              <p className="text-xs text-body-serif" style={{ color: isVideoUrl(newMediaUrl) ? "hsl(43, 85%, 42%)" : "hsl(140, 55%, 38%)" }}>
                {isVideoUrl(newMediaUrl) ? "🎬 Detected as Video" : "🖼️ Detected as Image"}
              </p>
            )}
            <button
              onClick={handleAddMedia}
              disabled={!newMediaUrl.trim() || addingMedia}
              className="px-5 py-2 rounded-lg text-display font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.97] flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))", boxShadow: "0 4px 12px hsla(345, 70%, 28%, 0.25)" }}
            >
              {addingMedia && <Loader2 className="h-4 w-4 animate-spin" />}
              {addingMedia ? "Adding..." : "Add to Gallery"}
            </button>
          </div>

          {/* Gallery items list */}
          {galleryLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>
          ) : galleryItems.length === 0 ? (
            <p className="text-body-serif text-muted-foreground text-center py-8 text-sm">No media added yet. Add image URLs or video links above.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item, idx) => (
                <div key={item.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--ivory-warm))" }}>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {item.type === "image" ? (
                      <img src={item.url} alt={item.caption || "Gallery"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect fill='%23ccc' width='100' height='60'/%3E%3Ctext fill='%23999' font-size='10' x='50' y='35' text-anchor='middle'%3EImage Error%3C/text%3E%3C/svg%3E"; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ background: "hsl(345, 70%, 15%)" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="hsl(43,85%,52%)" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                        <span className="text-xs text-body-serif" style={{ color: "hsl(43,70%,70%)" }}>Video</span>
                      </div>
                    )}
                    <span
                      className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full text-body-serif font-medium"
                      style={{ background: item.type === "video" ? "hsla(345, 70%, 20%, 0.85)" : "hsla(43, 85%, 52%, 0.85)", color: item.type === "video" ? "hsl(43,85%,62%)" : "hsl(345,70%,18%)" }}
                    >
                      {item.type === "video" ? "🎬 Video" : "🖼️ Image"}
                    </span>
                    <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "hsla(0,0%,0%,0.5)", color: "white" }}>
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Caption + actions */}
                  <div className="p-3">
                    {editGalleryItem?.id === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editGalleryCaption}
                          onChange={(e) => setEditGalleryCaption(e.target.value)}
                          className="w-full px-2 py-1.5 rounded text-body-serif text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                          style={inputStyle}
                          autoFocus
                        />
                        <div className="flex gap-1.5">
                          <button onClick={handleSaveGalleryCaption} className="flex-1 py-1 rounded text-xs font-semibold text-display" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>Save</button>
                          <button onClick={() => setEditGalleryItem(null)} className="flex-1 py-1 rounded text-xs text-body-serif" style={{ border: "1px solid hsl(var(--border))" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-body-serif text-xs text-muted-foreground truncate mb-2">{item.caption || <span className="italic opacity-50">No caption</span>}</p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { setEditGalleryItem(item); setEditGalleryCaption(item.caption); }}
                            className="flex-1 py-1.5 rounded text-xs font-semibold text-display transition-all hover:scale-105"
                            style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}
                          >
                            Edit Caption
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "gallery", id: item.id, name: item.caption || item.url.slice(0, 30) })}
                            className="py-1.5 px-2.5 rounded text-xs transition-all hover:scale-105"
                            style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}
                            aria-label="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Create Admin & Invitation */}

        <section className="card-ornate p-6 sm:p-8">
          <h2 className="text-display text-lg sm:text-xl font-semibold mb-6" style={{ color: "hsl(var(--primary))" }}>Create Admin & Invitation</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Email (optional)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loadingCreate}
            className="px-6 py-2.5 rounded-lg text-display font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))", boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.25)" }}
          >
            {loadingCreate && <Loader2 className="h-4 w-4 animate-spin" />}
            {loadingCreate ? "Generating..." : "Generate Invitation"}
          </button>

          {generatedLinks && (
            <div className="mt-6 p-5 rounded-lg space-y-4" style={{ background: "hsla(43, 85%, 52%, 0.06)", border: "1px solid hsla(43, 85%, 52%, 0.2)", animation: "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
              {[
                { label: "Invitation Link", link: generatedLinks.invite, key: "invite" },
                { label: "Secondary Admin Access", link: generatedLinks.admin, key: "admin" },
              ].map(({ label, link, key }) => (
                <div key={key}>
                  <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="flex-1 text-sm px-3 py-2 rounded overflow-x-auto min-w-0" style={{ background: "hsl(var(--ivory-warm))", color: "hsl(var(--primary))" }}>{link}</code>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => copyLink(link, key)} className="px-3 py-2 rounded-lg text-xs font-semibold text-display transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: "hsl(var(--gold))", color: "hsl(var(--maroon-deep))" }}>
                        {copied === key ? "Copied" : "Copy"}
                      </button>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-xs font-semibold text-display transition-all duration-200 hover:scale-105 active:scale-95 no-underline" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                        Preview
                      </a>
                      <button onClick={async () => {
                        if (key === "invite") {
                          const invMock = { personName: name, nickname: "", email: "", sentBy: "", withFamily: false, customMessage: "", id: "", createdAt: "", lastOpenedAt: null, visitCount: 0, isDeleted: false, deletedBy: "" };
                          const text = generateShareText(invMock);
                          const res = await shareContent("SADA SRI NILAYAM Invitation", text);
                          if (res === "copied") { setCopied(key); setTimeout(() => setCopied(null), 2000); }
                        } else {
                          const res = await shareContent("SADA SRI NILAYAM Admin Link", "Admin Access Link:\n" + link);
                          if (res === "copied") { setCopied(key); setTimeout(() => setCopied(null), 2000); }
                        }
                      }} className="px-3 py-2 rounded-lg text-xs font-semibold text-display transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Admin List */}
        <section className="card-ornate p-6 sm:p-8">
          <h2 className="text-display text-lg sm:text-xl font-semibold mb-6" style={{ color: "hsl(var(--primary))" }}>All Admins</h2>
          {loadingData ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>
          ) : admins.length === 0 ? (
            <p className="text-body-serif text-muted-foreground text-center py-8">No admins created yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left min-w-[650px]">
                <thead>
                  <tr style={{ borderBottom: "2px solid hsla(43, 85%, 52%, 0.3)" }}>
                    {["Name", "Phone", "Email", "Admin URL", "Last Accessed", "Actions"].map((h) => (
                      <th key={h} className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, i) => (
                    <tr key={admin.id} className="transition-colors duration-150" style={{ borderBottom: "1px solid hsl(var(--border))", background: i % 2 === 0 ? "transparent" : "hsla(40, 33%, 96%, 0.5)" }}>
                      <td className="text-body-serif text-sm py-3 px-2 font-medium text-foreground">{admin.name}</td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">{admin.phone || "—"}</td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">{admin.email || "—"}</td>
                      <td className="text-body-serif text-sm py-3 px-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => copyLink(getSecondaryAdminUrl(admin.id), `admin-${admin.id}`)} className="text-xs px-2 py-1 rounded transition-all hover:scale-105" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>
                            {copied === `admin-${admin.id}` ? "Copied" : "Copy URL"}
                          </button>
                          <a href={`/admin/user/${admin.id}`} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded transition-all hover:scale-105" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>Open</a>
                        </div>
                      </td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground tabular-nums">{formatDate(admin.lastAccessedAt)}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEditAdmin(admin)} className="text-xs px-2 py-1 rounded transition-all hover:scale-105" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>Edit</button>
                          <button onClick={() => setDeleteTarget({ type: "admin", id: admin.id, name: admin.name })} className="text-xs px-2 py-1 rounded transition-all hover:scale-105" style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* All Invitations */}
        <section className="card-ornate p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <h2 className="text-display text-lg sm:text-xl font-semibold" style={{ color: "hsl(var(--primary))", whiteSpace: "nowrap" }}>
              {showDeletedInvitations ? "Recently Deleted" : "All Invitations"}
            </h2>
            <span className="text-body-serif text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))" }}>{filteredInvitations.length} shown</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, nickname, or admin..."
                className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                style={inputStyle}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex gap-2 flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as "newest" | "lastOpened" | "byAdmin");
                    setFilterAdmin("");
                  }}
                  className="w-full sm:w-auto px-3 py-2.5 rounded-lg text-body-serif text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                  style={inputStyle}
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="lastOpened">Sort: Opened</option>
                  <option value="byAdmin">By Admin</option>
                </select>
                {sortBy === "byAdmin" && (
                  <select
                    value={filterAdmin}
                    onChange={(e) => setFilterAdmin(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2.5 rounded-lg text-body-serif text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                    style={inputStyle}
                  >
                    <option value="">All Admins</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.name}>{admin.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowDeletedInvitations(!showDeletedInvitations)}
                  className="px-3 py-2.5 rounded-lg text-xs font-semibold text-display transition-all hover:scale-105"
                  style={{ background: showDeletedInvitations ? "hsl(var(--primary))" : "hsla(43, 85%, 52%, 0.1)", color: showDeletedInvitations ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))" }}
                >
                  {showDeletedInvitations ? "Active" : "Deleted"}
                </button>
                <button
                  onClick={reloadWithLoading}
                  disabled={loadingData}
                  className="p-2.5 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}
                  title="Refresh List"
                  aria-label="Refresh Data"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>
          ) : filteredInvitations.length === 0 ? (
            <p className="text-body-serif text-muted-foreground text-center py-12">
              {searchQuery ? "No invitations match your search." : "No invitations created yet."}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                  style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-body-serif text-sm font-semibold text-foreground">{inv.personName}</span>
                        {inv.withFamily && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-body-serif" style={{ background: "hsla(43, 85%, 52%, 0.2)", color: "hsl(var(--primary))" }}>
                            with Family
                          </span>
                        )}
                        {inv.nickname && (
                          <span className="text-xs text-muted-foreground text-body-serif">({inv.nickname})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground text-body-serif flex-wrap">
                        <span>Sent by {inv.sentBy}</span>
                        <span>Created {formatDate(inv.createdAt)}</span>
                        <span style={{ color: inv.lastOpenedAt ? "hsl(140, 60%, 35%)" : undefined }}>
                          Opened: {formatDate(inv.lastOpenedAt)}
                        </span>
                        {inv.visitCount > 0 && (
                          <span style={{ color: "hsl(var(--primary))", fontWeight: 600 }}>
                            Visits: {inv.visitCount}
                          </span>
                        )}
                        {inv.isDeleted && inv.deletedBy && (
                          <span style={{ color: "hsl(0, 70%, 45%)", fontWeight: 600 }}>
                            Deleted by {inv.deletedBy}
                          </span>
                        )}
                      </div>
                      {inv.customMessage && (
                        <div className="mt-2 px-3 py-2 rounded-lg text-xs text-body-serif" style={{ background: "hsla(345, 40%, 40%, 0.05)", border: "1px solid hsla(345, 40%, 40%, 0.1)", color: "hsl(var(--foreground))" }}>
                          <span className="font-semibold text-display" style={{ color: "hsl(var(--primary))" }}>Note: </span>
                          {inv.customMessage}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end sm:justify-end mt-4 sm:mt-0 w-full sm:w-auto">
                      <a href={`${getInviteUrl(inv.id)}${inv.isDeleted ? '?preview=true' : ''}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium no-underline text-center flex-1 sm:flex-none" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                        {inv.isDeleted ? "Preview Deleted" : "View"}
                      </a>

                      {!inv.isDeleted ? (
                        <>
                          <button onClick={async () => {
                            const text = generateShareText(inv);
                            const res = await shareContent("SADA SRI NILAYAM Invitation", text);
                            if (res === "copied") { setCopied(`share-${inv.id}`); setTimeout(() => setCopied(null), 2000); }
                          }} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>{copied === `share-${inv.id}` ? "Copied" : "Share"}</button>
                          <button onClick={() => openEditInv(inv)} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>Edit</button>
                          <button onClick={() => setDeleteTarget({ type: "invitation", id: inv.id, name: inv.personName })} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}>Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleRestoreInv(inv.id)} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsl(140, 60%, 35%)", color: "white" }}>Restore</button>
                          <button onClick={() => setDeleteTarget({ type: "invitation", id: inv.id, name: inv.personName, hard: true })} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center w-full sm:w-auto" style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}>Delete Permanently</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-display" style={{ color: "hsl(var(--primary))" }}>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-body-serif">
              {deleteTarget?.hard
                ? <>This will permanently delete the invitation for <strong>{deleteTarget?.name}</strong>. This action cannot be undone.</>
                : deleteTarget?.type === "invitation"
                  ? <>This will move the invitation for <strong>{deleteTarget?.name}</strong> to the Recently Deleted folder.</>
                  : <>This will permanently delete the admin user <strong>{deleteTarget?.name}</strong>. This action cannot be undone.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-body-serif">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loadingDelete}
              style={{ background: "hsl(0, 70%, 45%)", color: "white" }}
              className="text-body-serif flex items-center gap-2"
            >
              {loadingDelete && <Loader2 className="h-4 w-4 animate-spin" />}
              {loadingDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Invitation Dialog */}
      <Dialog open={!!editInv} onOpenChange={(open) => !open && setEditInv(null)}>
        <DialogContent style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-display" style={{ color: "hsl(var(--primary))" }}>Edit Invitation</DialogTitle>
            <DialogDescription className="text-body-serif">Update invitation details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {[
              { label: "Person Name", key: "personName" as const, type: "text" },
              { label: "Nickname", key: "nickname" as const, type: "text" },
              { label: "Email", key: "email" as const, type: "email" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="text-body-serif text-sm text-muted-foreground block mb-1">{label}</label>
                <input type={type} value={editForm[key]} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <button onClick={() => setEditForm({ ...editForm, withFamily: !editForm.withFamily })} className="relative w-11 h-6 rounded-full transition-colors duration-300" style={{ background: editForm.withFamily ? "hsl(var(--primary))" : "hsl(var(--muted))" }} role="switch" aria-checked={editForm.withFamily}>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300" style={{ transform: editForm.withFamily ? "translateX(20px)" : "translateX(0)" }} />
              </button>
              <span className="text-body-serif text-sm text-foreground">With Family</span>
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Custom Message</label>
              <textarea value={editForm.customMessage} onChange={(e) => setEditForm({ ...editForm, customMessage: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none" style={inputStyle} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditInv(null)} className="px-4 py-2 rounded-lg text-body-serif text-sm transition-all hover:scale-105" style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}>Cancel</button>
              <button onClick={saveEditInv} disabled={loadingSave} className="px-4 py-2 rounded-lg text-display font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-60" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))" }}>
                {loadingSave && <Loader2 className="h-4 w-4 animate-spin" />}
                {loadingSave ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={!!editAdmin} onOpenChange={(open) => !open && setEditAdmin(null)}>
        <DialogContent style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-display" style={{ color: "hsl(var(--primary))" }}>Edit Admin</DialogTitle>
            <DialogDescription className="text-body-serif">Update admin details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Name</label>
              <input type="text" value={editAdminForm.name} onChange={(e) => setEditAdminForm({ ...editAdminForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Phone Number</label>
              <input type="tel" value={editAdminForm.phone} onChange={(e) => setEditAdminForm({ ...editAdminForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Email</label>
              <input type="email" value={editAdminForm.email} onChange={(e) => setEditAdminForm({ ...editAdminForm, email: e.target.value })} className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditAdmin(null)} className="px-4 py-2 rounded-lg text-body-serif text-sm transition-all hover:scale-105" style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}>Cancel</button>
              <button onClick={saveEditAdmin} disabled={loadingSave} className="px-4 py-2 rounded-lg text-display font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-60" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))" }}>
                {loadingSave && <Loader2 className="h-4 w-4 animate-spin" />}
                {loadingSave ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterAdmin;
