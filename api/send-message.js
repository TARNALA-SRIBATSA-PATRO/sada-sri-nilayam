// Vercel serverless function: POST /api/send-message
// Sends a guest's message to the inviting admin's email via Resend.
// CC: tsribatsapatro@gmail.com (master) unless admin IS that address.

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MASTER_EMAIL   = "tsribatsapatro@gmail.com";
const FROM_ADDRESS   = "Sada Sri Nilayam <noreply@sadasrinilayam.com>";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  if (!RESEND_API_KEY) {
    console.warn("[send-message] RESEND_API_KEY not set — email skipped");
    // In production this should fail loudly; in dev the vite proxy handles it.
    return res.status(500).json({ error: "Email service not configured. Please contact the administrator." });
  }

  try {
    const { guestName, nickname, message, adminEmail, adminName, invitationUrl } = req.body;

    if (!message?.trim())    return res.status(400).json({ error: "Message is required." });
    if (!adminEmail?.trim()) return res.status(400).json({ error: "Admin email is required." });

    const displayName  = nickname ? `${guestName} (${nickname})` : guestName || "A Guest";
    const safeMessage  = String(message).trim()
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const sentAt       = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

    const ccList = adminEmail.toLowerCase().trim() !== MASTER_EMAIL.toLowerCase()
      ? [MASTER_EMAIL]
      : [];

    // ── Rich HTML email ────────────────────────────────────────────────────────
    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message from ${displayName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #f0ebe0; color: #2a1018; }
    .wrap  { max-width: 580px; margin: 32px auto; border-radius: 18px; overflow: hidden;
             box-shadow: 0 8px 40px rgba(122,21,40,0.16); }
    /* Header */
    .hdr   { background: linear-gradient(135deg, #7a1528 0%, #4d0d18 100%); padding: 36px 36px 28px; text-align: center; }
    .hdr-ornament { color: rgba(212,168,67,0.6); font-size: 13px; letter-spacing: 8px; margin-bottom: 10px; }
    .hdr h1 { color: #d4a843; font-size: 24px; font-weight: 600; letter-spacing: 3px; margin-bottom: 4px; }
    .hdr p  { color: rgba(245,240,230,0.65); font-size: 13px; letter-spacing: 1px; }
    /* Gold rule */
    .gold-rule { height: 2px; background: linear-gradient(90deg, transparent, #d4a843, transparent); margin: 0; }
    /* Body */
    .body  { background: #fff9f0; padding: 32px 36px 28px; }
    .tag   { display: inline-block; background: rgba(122,21,40,0.08); color: #7a1528;
             font-size: 10px; padding: 4px 12px; border-radius: 20px; letter-spacing: 1.5px;
             text-transform: uppercase; font-family: Arial, sans-serif; margin-bottom: 18px; }
    .intro { font-size: 15px; color: #3a1022; line-height: 1.6; margin-bottom: 18px; }
    .intro strong { color: #7a1528; }
    /* Message box */
    .msg-box {
      background: #fdf7ee;
      border-left: 3px solid #d4a843;
      border-radius: 0 10px 10px 0;
      padding: 18px 22px;
      font-size: 15px;
      line-height: 1.8;
      color: #2a1018;
      white-space: pre-wrap;
      word-break: break-word;
      font-style: italic;
    }
    /* Meta */
    .divider { border: none; border-top: 1px solid rgba(122,21,40,0.1); margin: 24px 0; }
    .meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; font-family: Arial, sans-serif; font-size: 12px; color: #888; }
    .meta-label { color: #7a1528; font-weight: 600; white-space: nowrap; }
    .meta-val a  { color: #7a1528; text-decoration: none; }
    /* Footer */
    .ftr  { background: #7a1528; padding: 20px 36px; text-align: center; }
    .ftr p { color: rgba(245,240,230,0.55); font-family: Arial, sans-serif; font-size: 11px; line-height: 1.7; }
    /* Corner ornaments */
    .hdr-bottom { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; }
    .hdr-bottom span { color: rgba(212,168,67,0.5); font-size: 10px; letter-spacing: 4px; }
    .hdr-line  { flex: 1; max-width: 80px; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,168,67,0.4)); }
    .hdr-line.r { background: linear-gradient(90deg, rgba(212,168,67,0.4), transparent); }
  </style>
</head>
<body>
  <div class="wrap">
    <!-- Header -->
    <div class="hdr">
      <div class="hdr-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
      <h1>SADA SRI NILAYAM</h1>
      <p>Housewarming Ceremony &nbsp;·&nbsp; 20 April 2026</p>
      <div class="hdr-bottom">
        <div class="hdr-line"></div>
        <span>❖</span>
        <div class="hdr-line r"></div>
      </div>
    </div>

    <div class="gold-rule"></div>

    <!-- Body -->
    <div class="body">
      <div class="tag">New Message from Guest</div>
      <p class="intro">
        You have a new message from your invited guest
        <strong>&nbsp;${displayName}&nbsp;</strong>:
      </p>
      <div class="msg-box">${safeMessage}</div>

      <hr class="divider" />

      <div class="meta-grid">
        <span class="meta-label">To</span>
        <span class="meta-val">${adminName || adminEmail}</span>
        ${invitationUrl ? `<span class="meta-label">Invitation</span><span class="meta-val"><a href="${invitationUrl}">${invitationUrl}</a></span>` : ""}
        <span class="meta-label">Sent at</span>
        <span class="meta-val">${sentAt} IST</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="ftr">
      <p>
        This message was sent via the<br />
        <strong style="color:rgba(212,168,67,0.8)">SADA SRI NILAYAM</strong>
        digital invitation portal.<br />
        Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`;

    const plainText = [
      `Message from ${displayName}`,
      "",
      message.trim(),
      "",
      "---",
      `To: ${adminName || adminEmail}`,
      invitationUrl ? `Invitation: ${invitationUrl}` : "",
      `Sent at: ${sentAt} IST`,
    ].filter((l) => l !== null).join("\n");

    const emailPayload = {
      from: FROM_ADDRESS,
      to:   [adminEmail.trim()],
      ...(ccList.length > 0 && { cc: ccList }),
      subject: `💌 Message from your guest ${displayName} — Sada Sri Nilayam`,
      html:    htmlBody,
      text:    plainText,
    };

    const resendRes = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.json().catch(() => ({}));
      console.error("[send-message] Resend error:", errBody);
      return res.status(500).json({ error: errBody.message || "Email sending failed." });
    }

    const data = await resendRes.json();
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("[send-message] Unexpected error:", err);
    return res.status(500).json({ error: err.message || "Internal server error." });
  }
}
