import { useState } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";
import type { AdminUser } from "@/lib/invitations";

interface ContactSectionProps {
  userName?: string;
  adminContacts?: AdminUser[];
  invitationUrl?: string;
  sentBy?: string;
}

// ─── Main Section ──────────────────────────────────────────────────────────────
const ContactSection = ({
  userName = "",
  adminContacts = [],
  sentBy = "",
}: ContactSectionProps) => {
  const { ref, visible } = useScrollReveal();

  const defaultBibhu = { name: "Bibhu", phone: "6371210544" };

  // All admins with a phone number
  const adminsWithPhone = adminContacts.filter((a) => a.phone);

  const baseContacts =
    adminsWithPhone.length > 0
      ? adminsWithPhone.map((a) => ({ name: a.name, phone: a.phone! }))
      : [defaultBibhu];

  // Pin sender to the top
  const senderName = sentBy?.trim().toLowerCase();
  const displayedContacts = senderName
    ? [
        ...baseContacts.filter((c) => c.name.trim().toLowerCase() === senderName),
        ...baseContacts.filter((c) => c.name.trim().toLowerCase() !== senderName),
      ]
    : baseContacts;

  return (
    <section
      ref={ref}
      className="py-10 md:py-16 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Background — matches site ivory */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(40,33%,96%) 0%, hsl(38,30%,93%) 50%, hsl(40,33%,96%) 100%)",
        }}
      />

      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, hsla(43,85%,52%,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top ornamental rule */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.1s",
        }}
      >
        <div
          className="h-px w-20 sm:w-40"
          style={{
            background: "linear-gradient(90deg, transparent, hsla(43,85%,52%,0.55))",
          }}
        />
        <span style={{ color: "hsla(43,85%,52%,0.7)", fontSize: 10 }}>✦</span>
        <div
          className="h-px w-20 sm:w-40"
          style={{
            background: "linear-gradient(90deg, hsla(43,85%,52%,0.55), transparent)",
          }}
        />
      </div>

      <div className="max-w-lg mx-auto relative">
        {/* ── Section Header ── */}
        <div
          className="text-center mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Decorative script line above */}
          <p
            className="text-script mb-1"
            style={{
              color: "hsl(43,75%,50%)",
              fontSize: "0.9rem",
              letterSpacing: "0.04em",
            }}
          >
            We'd love to hear from you
          </p>

          <h2
            className="text-display font-semibold"
            style={{
              color: "hsl(345,70%,28%)",
              fontSize: "clamp(1.3rem, 5vw, 1.9rem)",
              lineHeight: 1.15,
              textShadow: "0 2px 14px hsla(345,70%,28%,0.12)",
            }}
          >
            Reach Out to Us
          </h2>

          {/* Gold divider */}
          <div className="section-divider mt-2" />

          {/* Decorative dots */}
          <div className="flex justify-center items-center gap-2 mt-2">
            <span style={{ color: "hsla(43,85%,52%,0.45)", fontSize: 7 }}>◆</span>
            <span style={{ color: "hsla(43,85%,52%,0.7)", fontSize: 9 }}>◆</span>
            <span style={{ color: "hsla(43,85%,52%,0.45)", fontSize: 7 }}>◆</span>
          </div>
        </div>

        {/* ── Contact Cards ── */}
        {displayedContacts.length > 0 && (
          <div className="space-y-2">
            {displayedContacts.map((c, idx) => (
              <ContactCard
                key={c.phone}
                contact={c}
                delayMs={idx * 90}
                visible={visible}
              />
            ))}
          </div>
        )}

        {/* Bottom ornament */}
        <div
          className="flex justify-center items-center gap-3 mt-6"
          style={{
            opacity: visible ? 0.5 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(90deg, transparent, hsl(43,85%,52%))" }}
          />
          <span style={{ color: "hsl(43,85%,52%)", fontSize: 12 }}>✦</span>
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(90deg, hsl(43,85%,52%), transparent)" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes contact-ripple {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes card-in {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

// ─── ContactCard ───────────────────────────────────────────────────────────────
function ContactCard({
  contact,
  delayMs,
  visible,
}: {
  contact: { name: string; phone: string };
  delayMs: number;
  visible: boolean;
}) {
  const [callRipple, setCallRipple] = useState(false);

  const fireRipple = () => {
    setCallRipple(true);
    setTimeout(() => setCallRipple(false), 700);
  };

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delayMs + 200}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delayMs + 200}ms`,
      }}
    >
      <div
        className="relative rounded-xl overflow-hidden flex items-center justify-between gap-3 px-4 py-3"
        style={{
          background: "linear-gradient(135deg, hsla(40,33%,98%,0.95), hsla(40,30%,94%,0.98))",
          border: "1px solid hsla(43,85%,52%,0.25)",
          boxShadow: "0 4px 20px hsla(345,70%,28%,0.06), 0 1px 3px hsla(345,70%,28%,0.04), inset 0 1px 0 hsla(43,85%,52%,0.12)",
        }}
      >
        {/* Gold left accent bar */}
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{
            background: "linear-gradient(180deg, hsla(43,85%,52%,0.5), transparent)",
          }}
        />

        {/* Name + role */}
        <div className="flex items-center gap-3 min-w-0 pl-2">
          {/* Avatar initial */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, hsla(345,70%,28%,0.12), hsla(345,70%,28%,0.06))",
            }}
          >
            <span
              className="text-display font-semibold"
              style={{
                color: "hsl(345,70%,28%)",
                fontSize: "0.85rem",
                lineHeight: 1,
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <p
              className="text-display font-semibold truncate"
              style={{
                color: "hsl(345,70%,28%)",
                fontSize: "clamp(0.9rem, 3.8vw, 1rem)",
                lineHeight: 1.2,
              }}
            >
              {contact.name}
            </p>

          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 flex-shrink-0">
          {/* Call */}
          <a
            href={`tel:${contact.phone}`}
            onClick={fireRipple}
            aria-label={`Call ${contact.name}`}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(345,70%,28%), hsl(345,76%,20%))",
              boxShadow: "0 4px 14px hsla(345,70%,28%,0.35)",
            }}
          >
            {callRipple && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "hsla(345,70%,55%,0.5)",
                  animation: "contact-ripple 0.65s ease-out forwards",
                }}
              />
            )}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="hsl(40,33%,96%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/91${contact.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${contact.name}`}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
            style={{
              background: "linear-gradient(135deg, hsl(142,62%,36%), hsl(142,65%,26%))",
              boxShadow: "0 4px 14px hsla(142,62%,36%,0.35)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(40,33%,96%)">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.386 0-4.597-.813-6.355-2.178l-.447-.36-2.886.968.968-2.886-.36-.447A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;
