import useScrollReveal from "@/hooks/useScrollReveal";

const VENUE = {
  house: "DX-H-33",
  name: "SADA SRI NILAYAM",
  address: "Lane 4A DX-H-33, Gatikrushna Green, Rangabazar, Bhubneswar",
  mapUrl: "https://www.google.com/maps?q=Sada+Sri+Nilayam&t=k&z=17&ie=UTF8&iwloc=&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Sada+Sri+Nilayam&travelmode=driving",
};

const VenueSection = ({ onSaveDate }: { onSaveDate?: () => void }) => {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="pt-2 pb-8 sm:py-14 md:py-24 px-3 sm:px-6 relative"
      style={{
        background: "linear-gradient(180deg, hsl(40, 33%, 96%) 0%, hsl(38, 30%, 92%) 50%, hsl(40, 33%, 96%) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <h2
          className="text-display text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-5 sm:mb-8 md:mb-12"
          style={{
            color: "hsl(345, 70%, 28%)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Venue
        </h2>

        {/* ── MOBILE: single stacked card ─────────────────────────────────── */}
        <div
          className="block md:hidden card-ornate overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          {/* Map strip — fixed height so it never bloats */}
          <div className="relative w-full" style={{ height: 180 }}>
            <iframe
              src={VENUE.mapUrl}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Location"
            />
          </div>

          {/* Divider line with gold shimmer */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, hsl(43,85%,52%), transparent)" }} />

          {/* Address block */}
          <div className="px-4 pt-4 pb-5">
            {/* House info row */}
            <div className="flex items-baseline gap-3 mb-2">
              <div>
                <p className="text-script text-xs text-gold leading-none mb-0.5">House No.</p>
                <p className="text-display text-sm font-semibold text-foreground">{VENUE.house}</p>
              </div>
              <div
                style={{ width: 1, alignSelf: "stretch", background: "hsla(43,85%,52%,0.3)" }}
              />
              <div>
                <p className="text-script text-xs text-gold leading-none mb-0.5">House Name</p>
                <p
                  className="text-display text-sm font-bold"
                  style={{ color: "hsl(345, 70%, 28%)" }}
                >
                  {VENUE.name}
                </p>
              </div>
            </div>

            <div className="section-divider my-3" />

            <p className="text-body-serif text-xs leading-relaxed text-foreground mb-4">
              {VENUE.address}
            </p>

            {/* Buttons row */}
            <div className="flex gap-2">
              <a
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-body-serif text-sm font-medium transition-all duration-300 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
                  color: "hsl(40, 33%, 96%)",
                  boxShadow: "0 4px 14px hsla(345, 70%, 28%, 0.3)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Get Directions
              </a>
              {onSaveDate && (
                <button
                  onClick={onSaveDate}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-body-serif text-sm font-medium border transition-all duration-300 active:scale-[0.97]"
                  style={{
                    borderColor: "hsla(43, 85%, 52%, 0.4)",
                    color: "hsl(345, 70%, 28%)",
                    background: "hsla(43, 85%, 52%, 0.06)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Save the Date
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── DESKTOP: side-by-side ─────────────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-2 gap-10 items-stretch">
          {/* Left: Venue details */}
          <div
            className="card-ornate p-8 lg:p-10"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <p className="text-script text-lg text-gold mb-0.5">House No.</p>
            <p className="text-display text-xl font-semibold text-foreground mb-4">{VENUE.house}</p>

            <p className="text-script text-lg text-gold mb-0.5">House Name</p>
            <h3
              className="text-display text-3xl font-bold mb-6"
              style={{ color: "hsl(345, 70%, 28%)" }}
            >
              {VENUE.name}
            </h3>

            <div className="section-divider mb-6" />

            <p className="text-body-serif text-lg leading-relaxed text-foreground">
              {VENUE.address}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-body-serif text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
                  color: "hsl(40, 33%, 96%)",
                  boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.3)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Get Directions
              </a>
              {onSaveDate && (
                <button
                  onClick={onSaveDate}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-body-serif text-base font-medium border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    borderColor: "hsla(43, 85%, 52%, 0.4)",
                    color: "hsl(345, 70%, 28%)",
                    background: "hsla(43, 85%, 52%, 0.06)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Save the Date
                </button>
              )}
            </div>
          </div>

          {/* Right: Map */}
          <div
            className="card-ornate overflow-hidden flex flex-col"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <div className="relative min-h-[350px] flex-1">
              <iframe
                src={VENUE.mapUrl}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Venue Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
