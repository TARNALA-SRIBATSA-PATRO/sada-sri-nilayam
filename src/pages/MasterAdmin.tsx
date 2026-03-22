import { useState, useEffect } from "react";
import {
  getInvitations,
  addInvitation,
  addAdmin,
  getInviteUrl,
  getSecondaryAdminUrl,
  type Invitation,
} from "@/lib/invitations";

const MasterAdmin = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<{
    invite: string;
    admin: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setInvitations(getInvitations());
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    const admin = addAdmin(name.trim());
    const inv = addInvitation({
      personName: name.trim(),
      nickname: "",
      email: email.trim(),
      sentBy: "Master Admin",
      withFamily: false,
      customMessage: "",
    });
    setInvitations(getInvitations());
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

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-6 py-4"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
          boxShadow: "0 4px 24px hsla(345, 70%, 28%, 0.3)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-display text-xl sm:text-2xl font-bold"
              style={{ color: "hsl(var(--gold))" }}
            >
              Master Admin Panel
            </h1>
            <p
              className="text-body-serif text-sm mt-0.5"
              style={{ color: "hsla(40, 33%, 96%, 0.7)" }}
            >
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
        {/* Create Invitation */}
        <section className="card-ornate p-6 sm:p-8">
          <h2
            className="text-display text-lg sm:text-xl font-semibold mb-6"
            style={{ color: "hsl(var(--primary))" }}
          >
            Create Invitation
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">
                Person Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                style={{
                  background: "hsl(var(--ivory-warm))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
            </div>
            <div>
              <label className="text-body-serif text-sm text-muted-foreground block mb-1.5">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2.5 rounded-lg text-body-serif text-foreground transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  background: "hsl(var(--ivory-warm))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-6 py-2.5 rounded-lg text-display font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.25)",
            }}
          >
            Generate Invitation
          </button>

          {/* Generated Links */}
          {generatedLinks && (
            <div
              className="mt-6 p-5 rounded-lg space-y-4"
              style={{
                background: "hsla(43, 85%, 52%, 0.06)",
                border: "1px solid hsla(43, 85%, 52%, 0.2)",
                animation: "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div>
                <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Invitation Link
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-sm px-3 py-2 rounded overflow-x-auto"
                    style={{
                      background: "hsl(var(--ivory-warm))",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {generatedLinks.invite}
                  </code>
                  <button
                    onClick={() =>
                      copyLink(generatedLinks.invite, "invite")
                    }
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-display transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
                    style={{
                      background: "hsl(var(--gold))",
                      color: "hsl(var(--maroon-deep))",
                    }}
                  >
                    {copied === "invite" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-body-serif text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Secondary Admin Access
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-sm px-3 py-2 rounded overflow-x-auto"
                    style={{
                      background: "hsl(var(--ivory-warm))",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {generatedLinks.admin}
                  </code>
                  <button
                    onClick={() =>
                      copyLink(generatedLinks.admin, "admin")
                    }
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-display transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
                    style={{
                      background: "hsl(var(--gold))",
                      color: "hsl(var(--maroon-deep))",
                    }}
                  >
                    {copied === "admin" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* All Invitations */}
        <section className="card-ornate p-6 sm:p-8">
          <h2
            className="text-display text-lg sm:text-xl font-semibold mb-6"
            style={{ color: "hsl(var(--primary))" }}
          >
            All Invitations
          </h2>

          {invitations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body-serif text-muted-foreground">
                No invitations created yet. Create your first one above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid hsla(43, 85%, 52%, 0.3)",
                    }}
                  >
                    <th className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">
                      Person Name
                    </th>
                    <th className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">
                      Nickname
                    </th>
                    <th className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">
                      Sent By
                    </th>
                    <th className="text-body-serif text-xs uppercase tracking-wider text-muted-foreground pb-3 px-2">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv, i) => (
                    <tr
                      key={inv.id}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid hsl(var(--border))",
                        background:
                          i % 2 === 0
                            ? "transparent"
                            : "hsla(40, 33%, 96%, 0.5)",
                      }}
                    >
                      <td className="text-body-serif text-sm py-3 px-2 font-medium text-foreground">
                        {inv.personName}
                      </td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">
                        {inv.nickname || "—"}
                      </td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground">
                        {inv.sentBy}
                      </td>
                      <td className="text-body-serif text-sm py-3 px-2 text-muted-foreground tabular-nums">
                        {formatDate(inv.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MasterAdmin;
