import { useState } from "react";

interface SecurityDetailsProps {
  guestName: string;
}

const SecurityDetails = ({ guestName }: SecurityDetailsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger section */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-body-serif text-base sm:text-lg text-muted-foreground mb-4"
            style={{ lineHeight: 1.7 }}
          >
            At the time of entry, if the security guard asks for details, please cooperate with them and share the below information.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-display font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 4px 20px hsla(345, 70%, 28%, 0.3), inset 0 1px 0 hsla(43, 85%, 52%, 0.2)",
              border: "1px solid hsla(43, 85%, 52%, 0.25)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            View Entry Details
          </button>
        </div>
      </section>

      {/* Fullscreen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{
            background: "hsla(345, 30%, 15%, 0.92)",
            backdropFilter: "blur(8px)",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <div
            className="w-full max-w-md card-ornate p-8 sm:p-10 text-center relative"
            style={{
              animation: "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: "hsla(345, 70%, 28%, 0.1)",
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Shield icon */}
            <div
              className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsla(43, 85%, 52%, 0.15), hsla(345, 70%, 28%, 0.1))",
                border: "1px solid hsla(43, 85%, 52%, 0.3)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>

            <h2
              className="text-display text-xl sm:text-2xl font-bold mb-2"
              style={{ color: "hsl(var(--primary))" }}
            >
              Entry Details
            </h2>

            <div className="section-divider my-5" />

            {/* Details */}
            <div className="space-y-5 text-left">
              <div className="flex items-start gap-3">
                <span className="text-body-serif text-sm text-muted-foreground uppercase tracking-wider min-w-[90px] pt-0.5">House</span>
                <span className="text-display text-lg font-semibold" style={{ color: "hsl(var(--primary))" }}>
                  H-33
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-body-serif text-sm text-muted-foreground uppercase tracking-wider min-w-[90px] pt-0.5">House Name</span>
                <span className="text-display text-lg font-semibold" style={{ color: "hsl(var(--primary))" }}>
                  SADA SRI NILAYAM
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-body-serif text-sm text-muted-foreground uppercase tracking-wider min-w-[90px] pt-0.5">Guest Name</span>
                <span className="text-script text-xl gold-text">
                  {guestName}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-body-serif text-sm text-muted-foreground uppercase tracking-wider min-w-[90px] pt-0.5">Event</span>
                <span className="text-body-serif text-base text-foreground">
                  Housewarming Ceremony
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-body-serif text-sm text-muted-foreground uppercase tracking-wider min-w-[90px] pt-0.5">Date</span>
                <span className="text-body-serif text-base text-foreground">
                  April 20, 2026 - 8:30 AM
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-body-serif text-sm text-muted-foreground uppercase tracking-wider min-w-[90px] pt-0.5">Location</span>
                <span className="text-body-serif text-sm text-foreground leading-relaxed">
                  Gatikrushna Greens, Rangabazar, Alarpur, Bhubaneswar, Khorda, PIN 752100
                </span>
              </div>
            </div>

            <div className="section-divider my-5" />

            <p className="text-body-serif text-xs text-muted-foreground">
              Please show this to the security guard at the gate
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SecurityDetails;
