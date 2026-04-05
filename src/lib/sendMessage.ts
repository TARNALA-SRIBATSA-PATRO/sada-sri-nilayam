// Frontend helper: sends the guest message to the API endpoint

const MASTER_EMAIL = "tsribatsapatro@gmail.com";

export interface SendMessagePayload {
  guestName: string;
  nickname?: string;
  message: string;
  adminEmail: string;
  adminName?: string;
  invitationUrl?: string;
}

export type SendMessageResult =
  | { success: true }
  | { success: false; error: string };

export async function sendGuestMessage(payload: SendMessagePayload): Promise<SendMessageResult> {
  if (!payload.message.trim()) return { success: false, error: "Message cannot be empty." };
  if (!payload.adminEmail.trim()) return { success: false, error: "No admin email configured for this invitation." };

  try {
    const res = await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || `Server error (${res.status})` };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { success: false, error: msg };
  }
}

export { MASTER_EMAIL };
