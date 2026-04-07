import { useState, useEffect } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";
import type { AdminUser } from "@/lib/invitations";

interface ContactSectionProps {
  userName?: string;
  adminContacts?: AdminUser[];
  sentBy?: string;
  invitationUrl?: string;
}


// ─── Main Section ──────────────────────────────────────────────────────────────
const ContactSection = ({
  userName = "",
  adminContacts = [],
  sentBy,
}: ContactSectionProps) => {
  const { ref, visible } = useScrollReveal();

  const defaultBibhu = { name: "Bibhu", phone: "6371210544" };
  const displayedContacts: { name: string; phone: string }[] = [];

  const senderAdmin = sentBy
    ? adminContacts.find(
        (a) =>
          a.name.toLowerCase() === sentBy.toLowerCase() || a.id === sentBy
      )
    : null;

  if (senderAdmin?.phone) {
    displayedContacts.push({ name: senderAdmin.name, phone: senderAdmin.phone });
  }
  if (
    !displayedContacts.some(
      (c) =>
        c.name.toLowerCase() === "bibhu" || c.phone === defaultBibhu.phone
    )
  ) {
    displayedContacts.push(defaultBibhu);
  }

  return (
    <section
      ref={ref}
      className="py-16 md:py-28 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Warm gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(40,33%,96%) 0%, hsl(345,18%,93%) 50%, hsl(40,33%,96%) 100%)",
        }}
      />

      {/* Top decorative gold rule */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.1s",
        }}
      >
        <div
          className="h-px w-24 sm:w-44"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsla(43,85%,52%,0.55))",
          }}
        />
        <span style={{ color: "hsla(43,85%,52%,0.65)", fontSize: 10 }}>✦</span>
        <div
          className="h-px w-24 sm:w-44"
          style={{
            background:
              "linear-gradient(90deg, hsla(43,85%,52%,0.55), transparent)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Section header */}
        <div
          className="text-center mb-10 md:mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p
            className="text-script text-lg sm:text-xl mb-1"
            style={{ color: "hsl(43,75%,48%)" }}
          >
            we'd love to hear from you
          </p>
          <h2
            className="text-display text-2xl sm:text-3xl md:text-4xl font-semibold"
            style={{ color: "hsl(345,70%,28%)" }}
          >
            Reach Out to Us
          </h2>
          <div className="section-divider mt-4" />
        </div>

        {/* Contact Cards — centered, full width */}
        {displayedContacts.length > 0 && (
          <div
            className="max-w-sm mx-auto space-y-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
          >
            {displayedContacts.map((c, idx) => (
              <ContactCard key={c.phone} contact={c} delayMs={idx * 80} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes contact-btn-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes contact-success-pop {
          0%   { transform: scale(0.4); opacity: 0; }
          65%  { transform: scale(1.14); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes contact-confetti {
          0%   { transform: rotate(var(--r)) translateY(0); opacity: 1; }
          100% { transform: rotate(var(--r)) translateY(56px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

// ─── ContactCard ───────────────────────────────────────────────────────────────
function ContactCard({
  contact,
  delayMs,
}: {
  contact: { name: string; phone: string };
  delayMs: number;
}) {
  const [ripple, setRipple] = useState(false);
  const fire = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 650);
  };

  return (
    <div
      className="card-ornate p-4 flex items-center justify-between gap-3"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Live status ping */}
        <span className="relative flex-shrink-0 w-2.5 h-2.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55"
            style={{ background: "hsl(140,55%,45%)" }}
          />
          <span
            className="relative inline-flex rounded-full w-2.5 h-2.5"
            style={{ background: "hsl(140,55%,42%)" }}
          />
        </span>
        <span className="text-body-serif text-base sm:text-lg text-foreground truncate">
          {contact.name}
        </span>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {/* Call button */}
        <a
          href={`tel:${contact.phone}`}
          onClick={fire}
          aria-label={`Call ${contact.name}`}
          className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, hsl(345,70%,28%), hsl(345,76%,20%))",
          }}
        >
          {ripple && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "hsla(345,70%,55%,0.45)" }}
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

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/91${contact.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${contact.name}`}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, hsl(142,70%,36%), hsl(142,72%,27%))",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(40,33%,96%)">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.386 0-4.597-.813-6.355-2.178l-.447-.36-2.886.968.968-2.886-.36-.447A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ─── FloatingInput ─────────────────────────────────────────────────────────────
function FloatingInput({
  label,
  hint,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        className="absolute left-4 text-body-serif transition-all duration-200 pointer-events-none select-none"
        style={{
          top: active ? "6px" : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? "10px" : "15px",
          letterSpacing: active ? "0.06em" : "0",
          color: focused ? "hsl(43,75%,44%)" : "hsl(345,18%,50%)",
        }}
      >
        {label}{" "}
        {hint && <span style={{ opacity: 0.5 }}>({hint})</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={active ? placeholder : ""}
        className="w-full px-4 pb-2.5 rounded-lg text-body-serif text-base text-foreground transition-all duration-200 outline-none disabled:opacity-55"
        style={{
          paddingTop: active ? "20px" : "11px",
          background: "hsl(40,33%,96%)",
          border: `1px solid ${focused ? "hsl(43,85%,52%)" : "hsla(43,85%,52%,0.28)"}`,
          boxShadow: focused ? "0 0 0 3px hsla(43,85%,52%,0.14)" : "none",
        }}
      />
    </div>
  );
}

// ─── FloatingTextarea ──────────────────────────────────────────────────────────
function FloatingTextarea({
  label,
  required,
  value,
  onChange,
  disabled,
  placeholder,
  maxChars,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder: string;
  maxChars: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const pct = value.length / maxChars;
  const counterColor =
    pct > 0.9
      ? "hsl(0,65%,44%)"
      : pct > 0.75
      ? "hsl(38,88%,44%)"
      : "hsl(345,18%,54%)";
  const circumference = 2 * Math.PI * 10;

  return (
    <div className="relative">
      <label
        className="absolute left-4 text-body-serif transition-all duration-200 pointer-events-none select-none"
        style={{
          top: active ? "8px" : "14px",
          fontSize: active ? "10px" : "15px",
          letterSpacing: active ? "0.06em" : "0",
          color: focused ? "hsl(43,75%,44%)" : "hsl(345,18%,50%)",
        }}
      >
        {label}{" "}
        {required && <span style={{ color: "hsl(0,65%,52%)" }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        rows={5}
        placeholder={active ? placeholder : ""}
        className="w-full px-4 pb-8 rounded-lg text-body-serif text-base text-foreground transition-all duration-200 outline-none resize-none disabled:opacity-55"
        style={{
          paddingTop: active ? "24px" : "14px",
          background: "hsl(40,33%,96%)",
          border: `1px solid ${focused ? "hsl(43,85%,52%)" : "hsla(43,85%,52%,0.28)"}`,
          boxShadow: focused ? "0 0 0 3px hsla(43,85%,52%,0.14)" : "none",
        }}
      />
      {/* Circular character counter */}
      <div className="absolute bottom-2.5 right-3.5 flex items-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={counterColor}
            strokeWidth="3"
            strokeOpacity="0.28"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={counterColor}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
            transform="rotate(-90 12 12)"
          />
        </svg>
        <span
          className="text-body-serif"
          style={{ fontSize: 11, color: counterColor }}
        >
          {maxChars - value.length}
        </span>
      </div>
    </div>
  );
}

// ─── SuccessState ──────────────────────────────────────────────────────────────
function SuccessState() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(t);
  }, []);

  const sparks = [
    { ch: "✦", color: "hsl(43,85%,52%)", deg: 0 },
    { ch: "✿", color: "hsl(345,60%,52%)", deg: 45 },
    { ch: "❖", color: "hsl(43,85%,52%)", deg: 90 },
    { ch: "✦", color: "hsl(345,60%,52%)", deg: 135 },
    { ch: "✿", color: "hsl(43,85%,52%)", deg: 180 },
    { ch: "❖", color: "hsl(345,60%,52%)", deg: 225 },
    { ch: "✦", color: "hsl(43,85%,52%)", deg: 270 },
    { ch: "✿", color: "hsl(345,60%,52%)", deg: 315 },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-10 text-center"
      style={{ opacity: show ? 1 : 0, transition: "opacity 0.35s ease" }}
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute text-xs pointer-events-none"
            style={{
              color: s.color,
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
              transform: `rotate(${s.deg}deg) translateY(-34px) translateX(-50%)`,
              animation: show
                ? `contact-confetti 0.75s ease-out ${i * 55}ms forwards`
                : "none",
              ["--r" as string]: `${s.deg}deg`,
            }}
          >
            {s.ch}
          </span>
        ))}

        {/* Checkmark circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(140,54%,38%), hsl(140,60%,27%))",
            boxShadow: "0 8px 28px hsla(140,54%,38%,0.4)",
            animation: show
              ? "contact-success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
              : "none",
            opacity: 0,
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <div>
        <p
          className="text-display font-semibold text-xl"
          style={{ color: "hsl(140,50%,31%)" }}
        >
          Message Sent! 🎉
        </p>
        <p
          className="text-body-serif text-sm mt-1.5 leading-relaxed"
          style={{ color: "hsl(345,20%,44%)" }}
        >
          Your message has been delivered to the host.
          <br />
          They'll get back to you soon.
        </p>
      </div>
    </div>
  );
}

export default ContactSection;
