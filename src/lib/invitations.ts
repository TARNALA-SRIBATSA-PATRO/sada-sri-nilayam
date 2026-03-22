export interface Invitation {
  id: string;
  personName: string;
  nickname: string;
  email: string;
  sentBy: string;
  withFamily: boolean;
  customMessage: string;
  createdAt: string;
}

const STORAGE_KEY = "sada_sri_invitations";
const ADMINS_KEY = "sada_sri_admins";

export interface AdminUser {
  id: string;
  name: string;
  createdAt: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function getInvitations(): Invitation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addInvitation(inv: Omit<Invitation, "id" | "createdAt">): Invitation {
  const invitations = getInvitations();
  const newInv: Invitation = {
    ...inv,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  invitations.push(newInv);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
  return newInv;
}

export function getAdmins(): AdminUser[] {
  try {
    const data = localStorage.getItem(ADMINS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addAdmin(name: string): AdminUser {
  const admins = getAdmins();
  const newAdmin: AdminUser = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
  };
  admins.push(newAdmin);
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  return newAdmin;
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
