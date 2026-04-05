import useScrollReveal from "@/hooks/useScrollReveal";

interface WelcomeSectionProps {
  userName?: string;
  withFamily?: boolean;
  customMessage?: string;
}

const WelcomeSection = ({ userName = "Dear Guest", withFamily = false, customMessage }: WelcomeSectionProps) => {
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, hsl(43, 85%, 52%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div
          className="section-divider mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        />
        {/* Poetic Opening line */}
        <p
          className="text-script text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 gold-text font-medium"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.95)",
            transition: "opacity 1s ease-out 0.1s, transform 1s ease-out 0.1s",
          }}
        >
          "A house is made of walls and beams, <br className="hidden sm:block"/> a home is built with love and dreams."
        </p>

        <p
          className="text-body-serif text-base sm:text-lg md:text-xl leading-relaxed text-foreground"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            filter: visible ? "blur(0px)" : "blur(4px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          With immense joy and the abundant grace of the Almighty, we, the{" "}
          <span className="text-display font-semibold" style={{ color: "hsl(345, 70%, 28%)" }}>
            Patro Family
          </span>
          <br className="hidden sm:block" />
          <span className="mt-5 block">
            cordially invite and request the honor of your presence and blessings,
          </span>
        </p>

        {/* Guest Name Highlight Box */}
        <div 
          className="my-10 py-6 px-4 rounded-xl relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.98)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            background: "linear-gradient(90deg, transparent, hsla(43, 85%, 52%, 0.08), transparent)",
            borderTop: "1px solid hsla(43, 85%, 52%, 0.35)",
            borderBottom: "1px solid hsla(43, 85%, 52%, 0.35)",
          }}
        >
          <span
            className="block text-script text-3xl sm:text-5xl lg:text-6xl drop-shadow-sm leading-tight px-2"
            style={{ color: "hsl(345, 72%, 26%)" }}
          >
            {userName}
            {withFamily && (
              <span> & Family</span>
            )}
          </span>
        </div>

        <p
          className="text-body-serif text-base sm:text-lg md:text-xl leading-relaxed text-foreground"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          on the auspicious occasion of our <br className="hidden sm:block" />
          <span className="font-semibold text-primary block mt-1 mb-1 text-lg sm:text-xl md:text-2xl">Housewarming Ceremony (Gruhapravesham)</span>
          as we step into our new home.
          <span className="block mt-8 text-muted-foreground italic text-lg opacity-85">
            Your love, presence, and good wishes will make this milestone truly special for us.
          </span>
        </p>

        {customMessage && (
          <div
            className="mt-8 mx-auto max-w-xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            }}
          >
            <div
              className="card-ornate p-6 text-center"
              style={{
                background: "hsla(43, 85%, 52%, 0.05)",
                borderColor: "hsla(43, 85%, 52%, 0.25)",
              }}
            >
              <p
                className="text-display text-sm font-semibold uppercase tracking-wider mb-2"
                style={{ color: "hsl(345, 70%, 28%)" }}
              >
                A Special Word for You
              </p>
              <p className="text-body-serif text-base sm:text-lg leading-relaxed text-foreground italic">
                "{customMessage}"
              </p>
            </div>
          </div>
        )}

        <div
          className="section-divider mt-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.6s",
          }}
        />
      </div>
    </section>
  );
};

export default WelcomeSection;
