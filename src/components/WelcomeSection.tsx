import useScrollReveal from "@/hooks/useScrollReveal";

interface WelcomeSectionProps {
  userName?: string;
  withFamily?: boolean;
  customMessage?: string;
}

const WelcomeSection = ({ userName = "Dear Guest", withFamily = false, customMessage }: WelcomeSectionProps) => {
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 relative overflow-hidden">
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
        <p
          className="text-body-serif text-xl sm:text-2xl md:text-[1.65rem] leading-relaxed text-foreground"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            filter: visible ? "blur(0px)" : "blur(4px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          With hearts filled with joy and gratitude, the{" "}
          <span className="text-display font-semibold" style={{ color: "hsl(345, 70%, 28%)" }}>
            Patro Family
          </span>{" "}
          warmly invites you,{" "}
          <span className="text-script text-3xl sm:text-4xl gold-text">
            {userName}
            {withFamily && (
              <span className="text-script text-2xl sm:text-3xl"> with family</span>
            )}
          </span>
          , to celebrate the beginning of our new journey together.
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
