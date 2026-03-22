import useScrollReveal from "@/hooks/useScrollReveal";

const VENUE = {
  house: "H-33",
  name: "SADA SRI NILAYAM",
  address: "Gatikrushna Greens, Rangabazar, Alarpur, Bhubaneswar, Khorda, PIN 752100",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.0!2d85.82!3d20.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBhubaneswar!5e0!3m2!1sen!2sin!4v1",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=20.25,85.82&travelmode=driving",
};

const VenueSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 px-6 relative"
      style={{
        background: "linear-gradient(180deg, hsl(40, 33%, 96%) 0%, hsl(38, 30%, 92%) 50%, hsl(40, 33%, 96%) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-display text-2xl sm:text-3xl font-semibold text-center mb-12"
          style={{
            color: "hsl(345, 70%, 28%)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Venue
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Venue details */}
          <div
            className="card-ornate p-8 sm:p-10"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <p className="text-script text-lg text-gold mb-1">House No.</p>
            <p className="text-display text-xl font-semibold text-foreground mb-4">{VENUE.house}</p>

            <p className="text-script text-lg text-gold mb-1">House Name</p>
            <h3
              className="text-display text-2xl sm:text-3xl font-bold mb-6"
              style={{ color: "hsl(345, 70%, 28%)" }}
            >
              {VENUE.name}
            </h3>

            <div className="section-divider mb-6" />

            <p className="text-body-serif text-lg leading-relaxed text-foreground">
              {VENUE.address}
            </p>

            <a
              href={VENUE.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg text-body-serif text-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
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
          </div>

          {/* Right: Map */}
          <div
            className="card-ornate overflow-hidden"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <iframe
              src={VENUE.mapUrl}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Location"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
