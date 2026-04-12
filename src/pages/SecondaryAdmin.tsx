import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import {
  getInvitations,
  addInvitation,
  updateInvitation,
  deleteInvitation,
  getAdminById,
  getInviteUrl,
  recordAdminAccess,
  generateShareText,
  shareContent,
  restoreInvitation,
  hardDeleteInvitation,
  type Invitation,
} from "@/lib/invitations";
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

const SecondaryAdmin = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState<{ id: string; name: string } | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [personName, setPersonName] = useState("");
  const [nickname, setNickname] = useState("");
  const [withFamily, setWithFamily] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const [editInv, setEditInv] = useState<Invitation | null>(null);
  const [editForm, setEditForm] = useState({ personName: "", nickname: "", email: "", withFamily: false, customMessage: "" });
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string, hard?: boolean } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "lastOpened" | "byAdmin">("newest");
  const [filterAdmin, setFilterAdmin] = useState("");

  const reload = async () => setInvitations(await getInvitations());

  useEffect(() => {
    if (id) {
      getAdminById(id).then(a => {
        setAdmin(a ? { id: a.id, name: a.name } : { id, name: "Admin" });
      });
      recordAdminAccess(id);
    }
    reload();
  }, [id]);

  const adminNames = useMemo(() => {
    const names = new Set(invitations.map((i) => i.sentBy));
    return Array.from(names).sort();
  }, [invitations]);

  const filteredInvitations = useMemo(() => {
    let list = invitations;
    // Don't filter by admin — show all invitations by default
    // The "By Admin" sort mode + filterAdmin dropdown handles explicit filtering
    list = list.filter((i) => i.isDeleted === showDeleted);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => i.personName.toLowerCase().includes(q) || i.nickname.toLowerCase().includes(q) || i.sentBy.toLowerCase().includes(q));
    }
    if (sortBy === "byAdmin" && filterAdmin) {
      list = list.filter((i) => i.sentBy === filterAdmin);
    }
    if (sortBy === "lastOpened") {
      list.sort((a, b) => {
        if (!a.lastOpenedAt && !b.lastOpenedAt) return 0;
        if (!a.lastOpenedAt) return 1;
        if (!b.lastOpenedAt) return -1;
        return new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime();
      });
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [invitations, searchQuery, sortBy, filterAdmin, showDeleted]);

  const getGreeting = useCallback(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const handleInvite = async () => {
    if (!personName.trim()) return;
    await addInvitation({ personName: personName.trim(), nickname: nickname.trim(), email: "", sentBy: admin?.name || "Admin", withFamily, customMessage: customMessage.trim(), isDeleted: false });
    reload();
    setPersonName(""); setNickname(""); setWithFamily(false); setCustomMessage("");
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const openEdit = (inv: Invitation) => {
    setEditInv(inv);
    setEditForm({ personName: inv.personName, nickname: inv.nickname, email: inv.email, withFamily: inv.withFamily, customMessage: inv.customMessage });
  };

  const saveEdit = async () => {
    if (!editInv) return;
    await updateInvitation(editInv.id, editForm);
    setEditInv(null);
    reload();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.hard) {
      await hardDeleteInvitation(deleteTarget.id);
    } else {
      await deleteInvitation(deleteTarget.id);
    }
    setDeleteTarget(null);
    reload();
  };

  const handleRestore = async (id: string) => {
    await restoreInvitation(id);
    reload();
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <header className="sticky top-0 z-40 px-6 py-4" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", boxShadow: "0 4px 24px hsla(345, 70%, 28%, 0.3)" }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-display text-lg sm:text-xl font-bold" style={{ color: "hsl(var(--gold))" }}>
            {getGreeting()}, {admin?.name || "Admin"}
          </h1>
          <p className="text-body-serif text-sm mt-0.5" style={{ color: "hsla(40, 33%, 96%, 0.7)" }}>SADA SRI NILAYAM — Admin Panel</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Invite Form */}
        <section className="card-ornate p-6 sm:p-8">
          <h2 className="text-display text-lg font-semibold mb-6" style={{ color: "hsl(var(--primary))" }}>Create Invitation</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Person Name</label>
              <input type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="Enter full name" className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Nickname</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Optional nickname" className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary" style={inputStyle} />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setWithFamily(!withFamily)} className="relative w-11 h-6 rounded-full transition-colors duration-300" style={{ background: withFamily ? "hsl(var(--primary))" : "hsl(var(--muted))" }} role="switch" aria-checked={withFamily}>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300" style={{ transform: withFamily ? "translateX(20px)" : "translateX(0)" }} />
            </button>
            <span className="text-body-serif text-sm text-foreground">With Family</span>
          </div>

          <div className="mb-5">
            <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Custom Message (optional)</label>
            <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} placeholder="Add a personal touch..." rows={3} className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none" style={inputStyle} />
          </div>

          <button onClick={handleInvite} disabled={!personName.trim()} className="px-6 py-2.5 rounded-lg text-display font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))", boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.25)" }}>
            Generate Invitation Link
          </button>
        </section>

        {/* Invitations List */}
        <section className="card-ornate p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <h2 className="text-display text-lg sm:text-xl font-semibold" style={{ color: "hsl(var(--primary))", whiteSpace: "nowrap" }}>
              {showDeleted ? "Recently Deleted" : "All Invitations"}
            </h2>
            <span className="text-body-serif text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))" }}>{filteredInvitations.length} shown</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 w-full">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, nickname, or admin..." className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary text-sm" style={inputStyle} />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex gap-2 flex-1 sm:flex-none">
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as "newest" | "lastOpened" | "byAdmin"); setFilterAdmin(""); }} className="w-full sm:w-auto px-3 py-2.5 rounded-lg text-body-serif text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer" style={inputStyle}>
                  <option value="newest">Sort: Newest</option>
                  <option value="lastOpened">Sort: Opened</option>
                  <option value="byAdmin">By Admin</option>
                </select>
                {sortBy === "byAdmin" && (
                  <select value={filterAdmin} onChange={(e) => setFilterAdmin(e.target.value)} className="w-full sm:w-auto px-3 py-2.5 rounded-lg text-body-serif text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer" style={inputStyle}>
                    <option value="">All Admins</option>
                    {adminNames.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                )}
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowDeleted(!showDeleted)}
                  className="px-3 py-2.5 rounded-lg text-xs font-semibold text-display transition-all hover:scale-105"
                  style={{ background: showDeleted ? "hsl(var(--primary))" : "hsla(43, 85%, 52%, 0.1)", color: showDeleted ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))" }}
                >
                  {showDeleted ? "Active" : "Deleted"}
                </button>
                <button
                  onClick={reload}
                  className="p-2.5 rounded-lg transition-all hover:scale-105"
                  style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}
                  title="Refresh List"
                  aria-label="Refresh Data"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredInvitations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body-serif text-muted-foreground">{searchQuery ? "No invitations match your search." : "No invitations created yet."}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvitations.map((inv) => (
                <div key={inv.id} className="rounded-xl p-4 transition-all duration-200 hover:shadow-md" style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-body-serif text-sm font-semibold text-foreground">{inv.personName}</span>
                        {inv.withFamily && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-body-serif" style={{ background: "hsla(43, 85%, 52%, 0.2)", color: "hsl(var(--primary))" }}>with Family</span>
                        )}
                        {inv.nickname && <span className="text-xs text-muted-foreground text-body-serif">({inv.nickname})</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground text-body-serif flex-wrap">
                        <span>Sent by {inv.sentBy}</span>
                        <span>Created {formatDate(inv.createdAt)}</span>
                        <span style={{ color: inv.lastOpenedAt ? "hsl(140, 60%, 35%)" : undefined }}>Opened: {formatDate(inv.lastOpenedAt)}</span>
                        {inv.visitCount > 0 && (
                          <span style={{ color: "hsl(var(--primary))", fontWeight: 600 }}>
                            Visits: {inv.visitCount}
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
                          <button onClick={() => openEdit(inv)} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}>Edit</button>
                          <button onClick={() => setDeleteTarget({ id: inv.id, name: inv.personName })} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}>Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleRestore(inv.id)} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center flex-1 sm:flex-none" style={{ background: "hsl(140, 60%, 35%)", color: "white" }}>Restore</button>
                          <button onClick={() => setDeleteTarget({ id: inv.id, name: inv.personName, hard: true })} className="text-xs px-3 py-2 rounded-lg transition-all hover:scale-105 text-display font-medium text-center w-full sm:w-auto" style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}>Delete Permanently</button>
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
                : <>This will move the invitation for <strong>{deleteTarget?.name}</strong> to the Recently Deleted folder. It will no longer be accessible by the guest.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-body-serif">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} style={{ background: "hsl(0, 70%, 45%)", color: "white" }} className="text-body-serif">Delete</AlertDialogAction>
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
              <button onClick={saveEdit} className="px-4 py-2 rounded-lg text-display font-semibold text-sm transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))", color: "hsl(var(--primary-foreground))" }}>Save Changes</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecondaryAdmin;
