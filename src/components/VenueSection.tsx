import useScrollReveal from "@/hooks/useScrollReveal";

const VENUE = {
  house: "H-33",
  name: "SADA SRI NILAYAM",
  address: "Gatikrushna Greens, Rangabazar, Alarpur, Bhubaneswar, Khorda, PIN 752100",
  mapUrl: "https://www.google.com/maps?q=Sada+Sri+Nilayam&t=k&z=17&ie=UTF8&iwloc=&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Sada+Sri+Nilayam&travelmode=driving",
};

const VenueSection = ({ onSaveDate }: { onSaveDate?: () => void }) => {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-10 sm:py-16 md:py-28 px-3 sm:px-6 relative"
      style={{
        background: "linear-gradient(180deg, hsl(40, 33%, 96%) 0%, hsl(38, 30%, 92%) 50%, hsl(40, 33%, 96%) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-display text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8 md:mb-12"
          style={{
            color: "hsl(345, 70%, 28%)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Venue
        </h2>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-10 items-stretch">
          {/* Left: Venue details */}
          <div
            className="card-ornate p-4 sm:p-6 md:p-8 lg:p-10"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <p className="text-script text-sm sm:text-base md:text-lg text-gold mb-0.5 sm:mb-1">House No.</p>
            <p className="text-display text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">{VENUE.house}</p>

            <p className="text-script text-sm sm:text-base md:text-lg text-gold mb-0.5 sm:mb-1">House Name</p>
            <h3
              className="text-display text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6"
              style={{ color: "hsl(345, 70%, 28%)" }}
            >
              {VENUE.name}
            </h3>

            <div className="section-divider mb-4 sm:mb-6" />

            <p className="text-body-serif text-sm sm:text-base md:text-lg leading-relaxed text-foreground">
              {VENUE.address}
            </p>

            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-5 sm:mt-8">
              <a
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-body-serif text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
                  color: "hsl(40, 33%, 96%)",
                  boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Get Directions
              </a>
              {onSaveDate && (
                <button
                  onClick={onSaveDate}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-body-serif text-sm sm:text-base font-medium border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    borderColor: "hsla(43, 85%, 52%, 0.4)",
                    color: "hsl(345, 70%, 28%)",
                    background: "hsla(43, 85%, 52%, 0.06)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
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
            {/* Compact map on mobile, taller on desktop */}
            <div className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[350px] flex-1">
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
