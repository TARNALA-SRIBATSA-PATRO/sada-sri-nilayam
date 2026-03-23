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
}

const STORAGE_KEY = "sada_sri_invitations";
const ADMINS_KEY = "sada_sri_admins";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastAccessedAt: string | null;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function getInvitations(): Invitation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const invitations = data ? JSON.parse(data) : [];
    // Migrate old invitations without lastOpenedAt
    return invitations.map((inv: Invitation) => ({
      ...inv,
      lastOpenedAt: inv.lastOpenedAt ?? null,
    }));
  } catch {
    return [];
  }
}

export function addInvitation(inv: Omit<Invitation, "id" | "createdAt" | "lastOpenedAt">): Invitation {
  const invitations = getInvitations();
  const newInv: Invitation = {
    ...inv,
    id: generateId(),
    createdAt: new Date().toISOString(),
    lastOpenedAt: null,
  };
  invitations.push(newInv);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
  return newInv;
}

export function updateInvitation(id: string, updates: Partial<Omit<Invitation, "id" | "createdAt">>): Invitation | null {
  const invitations = getInvitations();
  const index = invitations.findIndex((inv) => inv.id === id);
  if (index === -1) return null;
  invitations[index] = { ...invitations[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
  return invitations[index];
}

export function deleteInvitation(id: string): boolean {
  const invitations = getInvitations();
  const filtered = invitations.filter((inv) => inv.id !== id);
  if (filtered.length === invitations.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function recordInvitationOpen(personSlug: string): void {
  const invitations = getInvitations();
  const slug = personSlug.toLowerCase().replace(/\s+/g, "-");
  const updated = invitations.map((inv) => {
    const invSlug = inv.personName.toLowerCase().replace(/\s+/g, "-");
    if (invSlug === slug) {
      return { ...inv, lastOpenedAt: new Date().toISOString() };
    }
    return inv;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getAdmins(): AdminUser[] {
  try {
    const data = localStorage.getItem(ADMINS_KEY);
    const admins = data ? JSON.parse(data) : [];
    return admins.map((a: AdminUser) => ({
      ...a,
      email: a.email ?? "",
      lastAccessedAt: a.lastAccessedAt ?? null,
    }));
  } catch {
    return [];
  }
}

export function addAdmin(name: string, email: string = ""): AdminUser {
  const admins = getAdmins();
  const newAdmin: AdminUser = {
    id: generateId(),
    name,
    email,
    createdAt: new Date().toISOString(),
    lastAccessedAt: null,
  };
  admins.push(newAdmin);
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  return newAdmin;
}

export function updateAdmin(id: string, updates: Partial<Omit<AdminUser, "id" | "createdAt">>): AdminUser | null {
  const admins = getAdmins();
  const index = admins.findIndex((a) => a.id === id);
  if (index === -1) return null;
  admins[index] = { ...admins[index], ...updates };
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  return admins[index];
}

export function deleteAdmin(id: string): boolean {
  const admins = getAdmins();
  const filtered = admins.filter((a) => a.id !== id);
  if (filtered.length === admins.length) return false;
  localStorage.setItem(ADMINS_KEY, JSON.stringify(filtered));
  return true;
}

export function recordAdminAccess(id: string): void {
  const admins = getAdmins();
  const updated = admins.map((a) =>
    a.id === id ? { ...a, lastAccessedAt: new Date().toISOString() } : a
  );
  localStorage.setItem(ADMINS_KEY, JSON.stringify(updated));
}

export function getAdminById(id: string): AdminUser | undefined {
  return getAdmins().find((a) => a.id === id);
}

export function getInviteUrl(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `${window.location.origin}/invite/${encodeURIComponent(slug)}`;
}

export function getSecondaryAdminUrl(adminId: string): string {
  return `${window.location.origin}/admin/user/${adminId}`;
}
