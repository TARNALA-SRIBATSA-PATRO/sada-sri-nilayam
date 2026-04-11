import { useState, useEffect } from "react";

interface CalendarModalProps {
  onClose: () => void;
  guestName?: string;
  adminContacts?: { name: string; phone: string; id?: string }[];
  invitationUrl?: string;
  sentBy?: string;
  withFamily?: boolean;
}

const CalendarModal = ({ onClose, guestName, adminContacts, invitationUrl, sentBy, withFamily }: CalendarModalProps) => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Slide in after a brief stagger so the CSS transition fires smoothly
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 480); // wait for full slide-out
  };

  const calendarUrl = new URL("https://calendar.google.com/calendar/render");

  const defaultBibhu = { name: "Bibhu", phone: "6371210544" };
  const displayedContacts: { name: string; phone: string }[] = [];

  if (sentBy) {
    const sender = adminContacts?.find(
      (a) => a.name.toLowerCase() === sentBy.toLowerCase() || a.id === sentBy
    );
    if (sender) displayedContacts.push({ name: sender.name, phone: sender.phone });
  }

  if (!displayedContacts.some((c) => c.name.toLowerCase() === "bibhu" || c.phone === defaultBibhu.phone)) {
    displayedContacts.push(defaultBibhu);
  }

  const adminPhones = displayedContacts.map((c) => `${c.name}: ${c.phone}`).join("\n");
  const dynamicDetails = `Dear ${guestName || "Guest"}${withFamily ? " & Family" : ""},

You are warmly invited to the housewarming ceremony of SADA SRI NILAYAM by the Patro Family.

Event: Housewarming Ceremony
Location: Sada Sri Nilayam, Lane 4A DX-H-33, Gatikrushna Green, Rangabazar, Bhubneswar

Contact the Hosts:
${adminPhones}

Your digital invitation:
${invitationUrl || "https://sadasrinilayam.com/"}
`;

  calendarUrl.searchParams.set("action", "TEMPLATE");
  calendarUrl.searchParams.set("text", "Housewarming Ceremony - SADA SRI NILAYAM");
  calendarUrl.searchParams.set("dates", "20260420/20260421");
  calendarUrl.searchParams.set("details", dynamicDetails);
  calendarUrl.searchParams.set("location", "SADA SRI NILAYAM");

  // On mobile: slide up from bottom edge, full width strip
  // On desktop: slide in from bottom-right corner, compact card
  const wrapperStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: visible ? "translateY(0)" : "translateY(110%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
      }
    : {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        width: "360px",
        maxWidth: "calc(100vw - 32px)",
        transform: visible ? "translateY(0)" : "translateY(calc(100% + 32px))",
        opacity: visible ? 1 : 0,
        transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
      };

  const cardStyle: React.CSSProperties = isMobile
    ? {
        borderRadius: "20px 20px 0 0",
        padding: "18px 20px 28px",
        boxShadow: "0 -6px 32px hsla(345, 70%, 15%, 0.18), 0 -1px 4px hsla(345, 70%, 15%, 0.08)",
        borderTop: "3px solid hsl(43, 85%, 52%)",
        borderLeft: "none",
      }
    : {
        borderRadius: "14px",
        padding: "20px 22px",
        boxShadow: "0 8px 40px hsla(345, 70%, 15%, 0.22), 0 2px 8px hsla(345, 70%, 15%, 0.12)",
        borderLeft: "3px solid hsl(43, 85%, 52%)",
      };

  return (
    <div style={wrapperStyle}>
      {/* Mobile: pill drag indicator */}
      {isMobile && (
        <div style={{ textAlign: "center", paddingTop: "0px" }}>
          <div style={{
            display: "inline-block",
            width: "40px",
            height: "4px",
            borderRadius: "2px",
            background: "hsla(345, 30%, 70%, 0.4)",
            marginBottom: "4px",
            marginTop: "8px",
          }} />
        </div>
      )}

      <div className="card-ornate" style={cardStyle}>
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: isMobile ? "14px" : "10px",
            right: "14px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "hsl(345, 40%, 50%)",
            fontSize: "20px",
            lineHeight: 1,
            padding: "4px 6px",
            borderRadius: "50%",
          }}
        >
          ×
        </button>

        {/* Calendar icon + heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", paddingRight: "28px" }}>
          <div
            style={{
              width: isMobile ? "42px" : "36px",
              height: isMobile ? "42px" : "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={isMobile ? 20 : 18} height={isMobile ? 20 : 18} viewBox="0 0 24 24" fill="none" stroke="hsl(40, 33%, 96%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-display font-semibold" style={{ fontSize: isMobile ? "16px" : "14px", color: "hsl(345, 70%, 28%)", margin: 0 }}>
              Save the Date!
            </p>
            <p className="text-script" style={{ fontSize: isMobile ? "13px" : "12px", color: "hsl(43, 60%, 45%)", margin: 0 }}>
              20th April 2026
            </p>
          </div>
        </div>

        <p className="text-body-serif" style={{ fontSize: isMobile ? "14px" : "13px", color: "hsl(345, 20%, 40%)", marginBottom: "16px", lineHeight: 1.55 }}>
          Add the housewarming ceremony to your calendar so you don't miss this joyous occasion!
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href={calendarUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="text-body-serif font-medium"
            style={{
              flex: 1,
              textAlign: "center",
              padding: isMobile ? "12px 16px" : "9px 12px",
              borderRadius: "10px",
              fontSize: isMobile ? "15px" : "13px",
              background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
              color: "hsl(40, 33%, 96%)",
              boxShadow: "0 4px 12px hsla(345, 70%, 28%, 0.28)",
              textDecoration: "none",
              transition: "transform 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Add to Calendar
          </a>
          <button
            onClick={handleClose}
            className="text-body-serif"
            style={{
              padding: isMobile ? "12px 16px" : "9px 12px",
              borderRadius: "10px",
              fontSize: isMobile ? "15px" : "13px",
              border: "1px solid hsla(43, 85%, 52%, 0.35)",
              background: "transparent",
              color: "hsl(345, 50%, 40%)",
              cursor: "pointer",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsla(43, 85%, 52%, 0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
