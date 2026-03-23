import { useState, useEffect } from "react";
import {
  getInvitations,
  addInvitation,
  updateInvitation,
  deleteInvitation,
  addAdmin,
  deleteAdmin,
  getAdmins,
  getInviteUrl,
  getSecondaryAdminUrl,
  type Invitation,
  type AdminUser,
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

const MasterAdmin = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<{
    invite: string;
    admin: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ type: "invitation" | "admin"; id: string; name: string } | null>(null);

  // Edit state
  const [editInv, setEditInv] = useState<Invitation | null>(null);
  const [editForm, setEditForm] = useState({ personName: "", nickname: "", email: "", withFamily: false, customMessage: "" });

  const reload = () => {
    setInvitations(getInvitations());
    setAdmins(getAdmins());
  };

  useEffect(() => { reload(); }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    const admin = addAdmin(name.trim(), email.trim());
    addInvitation({
      personName: name.trim(),
      nickname: "",
      email: email.trim(),
      sentBy: "Master Admin",
      withFamily: false,
      customMessage: "",
    });
    reload();
    setGeneratedLinks({
      invite: getInviteUrl(name.trim()),
      admin: getSecondaryAdminUrl(admin.id),
    });
    setName("");
    setEmail("");
  };

  const copyLink = (link: string, label: string) => {
    navigator.clipboard.writeText(link);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "invitation") {
      deleteInvitation(deleteTarget.id);
    } else {
      deleteAdmin(deleteTarget.id);
    }
    setDeleteTarget(null);
    reload();
  };

  const openEdit = (inv: Invitation) => {
    setEditInv(inv);
    setEditForm({
      personName: inv.personName,
      nickname: inv.nickname,
      email: inv.email,
      withFamily: inv.withFamily,
      customMessage: inv.customMessage,
    });
  };

  const saveEdit = () => {
    if (!editInv) return;
    updateInvitation(editInv.id, editForm);
    setEditInv(null);
    reload();
  };

  const totalInvitations = invitations.length;

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-6 py-4"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
          boxShadow: "0 4px 24px hsla(345, 70%, 28%, 0.3)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-display text-xl sm:text-2xl font-bold" style={{ color: "hsl(var(--gold))" }}>
              Master Admin Panel
            </h1>
            <p className="text-body-serif text-sm mt-0.5" style={{ color: "hsla(40, 33%, 96%, 0.7)" }}>
              SADA SRI NILAYAM
            </p>
          </div>
          <a
            href="/"
            className="text-body-serif text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "hsla(43, 85%, 52%, 0.15)",
              color: "hsl(var(--gold))",
              border: "1px solid hsla(43, 85%, 52%, 0.3)",
            }}
          >
            View Invitation
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Dashboard Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="card-ornate p-5 text-center">
            <p className="text-display text-2xl sm:text-3xl font-bold" style={{ color: "hsl(var(--primary))" }}>
              {totalInvitations}
            </p>
            <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Total Invitations
            </p>
          </div>
          <div className="card-ornate p-5 text-center">
            <p className="text-display text-2xl sm:text-3xl font-bold" style={{ color: "hsl(var(--primary))" }}>
              {admins.length}
            </p>
            <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Total Admins
            </p>
          </div>
          <div className="card-ornate p-5 text-center col-span-2 sm:col-span-1">
            <p className="text-display text-2xl sm:text-3xl font-bold" style={{ color: "hsl(var(--primary))" }}>
              {invitations.filter((i) => i.lastOpenedAt).length}
            </p>
            <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Opened
            </p>
          </div>
        </section>

        {/* Create Invitation */}
        <section className="card-ornate p-6 sm:p-8">
          <h2 className="text-display text-lg sm:text-xl font-semibold mb-6" style={{ color: "hsl(var(--primary))" }}>
            Create Invitation
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Person Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
              />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">Email (optional)</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground transition-all duration-200 focus:outline-none focus:ring-2"
                style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
              />
            </div>
          </div>
          <button
            onClick={handleCreate} disabled={!name.trim()}
            className="px-6 py-2.5 rounded-lg text-display font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.25)",
            }}
          >
            Generate Invitation
          </button>

          {generatedLinks && (
            <div
              className="mt-6 p-5 rounded-lg space-y-4"
              style={{
                background: "hsla(43, 85%, 52%, 0.06)",
                border: "1px solid hsla(43, 85%, 52%, 0.2)",
                animation: "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              {[
                { label: "Invitation Link", link: generatedLinks.invite, key: "invite" },
                { label: "Secondary Admin Access", link: generatedLinks.admin, key: "admin" },
              ].map(({ label, link, key }) => (
                <div key={key}>
                  <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm px-3 py-2 rounded overflow-x-auto" style={{ background: "hsl(var(--ivory-warm))", color: "hsl(var(--primary))" }}>
                      {link}
                    </code>
                    <button
                      onClick={() => copyLink(link, key)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-display transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
                      style={{ background: "hsl(var(--gold))", color: "hsl(var(--maroon-deep))" }}
                    >
                      {copied === key ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Admin List */}
        <section className="card-ornate p-6 sm:p-8">
          <h2 className="text-display text-lg sm:text-xl font-semibold mb-6" style={{ color: "hsl(var(--primary))" }}>
            All Admins
          </h2>
          {admins.length === 0 ? (
            <p className="text-body-serif text-muted-foreground text-center py-8">No admins created yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr style={{ borderBottom: "2px solid hsla(43, 85%, 52%, 0.3)" }}>
                    {["Name", "Email", "Admin URL", "Last Accessed", "Actions"].map((h) => (
                      <th key={h} className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, i) => (
                    <tr
                      key={admin.id}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid hsl(var(--border))",
                        background: i % 2 === 0 ? "transparent" : "hsla(40, 33%, 96%, 0.5)",
                      }}
                    >
                      <td className="text-body-serif text-sm py-3 px-2 font-medium text-foreground">{admin.name}</td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">{admin.email || "—"}</td>
                      <td className="text-body-serif text-sm py-3 px-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyLink(getSecondaryAdminUrl(admin.id), `admin-${admin.id}`)}
                            className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                            style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}
                          >
                            {copied === `admin-${admin.id}` ? "Copied" : "Copy URL"}
                          </button>
                          <a
                            href={`/admin/user/${admin.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                            style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                          >
                            Open
                          </a>
                        </div>
                      </td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground tabular-nums">
                        {formatDate(admin.lastAccessedAt)}
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => setDeleteTarget({ type: "admin", id: admin.id, name: admin.name })}
                          className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                          style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}
                        >
                          Delete
                        </button>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-display text-lg sm:text-xl font-semibold" style={{ color: "hsl(var(--primary))" }}>
              All Invitations
            </h2>
            <span className="text-body-serif text-sm px-3 py-1 rounded-full" style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))" }}>
              {totalInvitations} sent
            </span>
          </div>

          {invitations.length === 0 ? (
            <p className="text-body-serif text-muted-foreground text-center py-12">No invitations created yet. Create your first one above.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr style={{ borderBottom: "2px solid hsla(43, 85%, 52%, 0.3)" }}>
                    {["Person Name", "Nickname", "Sent By", "Created", "Last Opened", "Actions"].map((h) => (
                      <th key={h} className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv, i) => (
                    <tr
                      key={inv.id}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid hsl(var(--border))",
                        background: i % 2 === 0 ? "transparent" : "hsla(40, 33%, 96%, 0.5)",
                      }}
                    >
                      <td className="text-body-serif text-sm py-3 px-2 font-medium text-foreground">{inv.personName}</td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">{inv.nickname || "—"}</td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">{inv.sentBy}</td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground tabular-nums">{formatDate(inv.createdAt)}</td>
                      <td className="text-body-serif text-sm py-3 px-2 tabular-nums" style={{ color: inv.lastOpenedAt ? "hsl(140, 60%, 35%)" : "hsl(var(--muted-foreground))" }}>
                        {formatDate(inv.lastOpenedAt)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(inv)}
                            className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                            style={{ background: "hsla(43, 85%, 52%, 0.15)", color: "hsl(var(--primary))", border: "1px solid hsla(43, 85%, 52%, 0.3)" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "invitation", id: inv.id, name: inv.personName })}
                            className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                            style={{ background: "hsla(0, 70%, 50%, 0.1)", color: "hsl(0, 70%, 45%)", border: "1px solid hsla(0, 70%, 50%, 0.2)" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-display" style={{ color: "hsl(var(--primary))" }}>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-body-serif">
              This will permanently delete the {deleteTarget?.type} for <strong>{deleteTarget?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-body-serif">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              style={{ background: "hsl(0, 70%, 45%)", color: "white" }}
              className="text-body-serif"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editInv} onOpenChange={(open) => !open && setEditInv(null)}>
        <DialogContent style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-display" style={{ color: "hsl(var(--primary))" }}>Edit Invitation</DialogTitle>
            <DialogDescription className="text-body-serif">Update invitation details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Person Name</label>
              <input
                type="text" value={editForm.personName} onChange={(e) => setEditForm({ ...editForm, personName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
              />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Nickname</label>
              <input
                type="text" value={editForm.nickname} onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
              />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Email</label>
              <input
                type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditForm({ ...editForm, withFamily: !editForm.withFamily })}
                className="relative w-11 h-6 rounded-full transition-colors duration-300"
                style={{ background: editForm.withFamily ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
                role="switch" aria-checked={editForm.withFamily}
              >
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
                  style={{ transform: editForm.withFamily ? "translateX(20px)" : "translateX(0)" }} />
              </button>
              <span className="text-body-serif text-sm text-foreground">With Family</span>
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1">Custom Message</label>
              <textarea
                value={editForm.customMessage} onChange={(e) => setEditForm({ ...editForm, customMessage: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-body-serif text-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                style={{ background: "hsl(var(--ivory-warm))", border: "1px solid hsl(var(--border))" }}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setEditInv(null)}
                className="px-4 py-2 rounded-lg text-body-serif text-sm transition-all hover:scale-105"
                style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-lg text-display font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterAdmin;
