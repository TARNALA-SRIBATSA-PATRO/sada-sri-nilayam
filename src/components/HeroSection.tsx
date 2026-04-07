import { useState, useCallback, useEffect } from "react";
import ganeshaImg from "@/assets/ganesha.png";
import WelcomeAnimation from "./WelcomeAnimation";
import FlowerPetals from "./FlowerPetals";

const HeroSection = () => {
  const [animDone, setAnimDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleAnimComplete = useCallback(() => {
    setAnimDone(true);
    // Signal other components (MusicToggle) that the welcome screen is gone
    window.dispatchEvent(new CustomEvent("welcome:complete"));
  }, []);

  // Force scroll to top on mount/refresh and disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll during welcome animation to prevent scrolling behind overlay
  useEffect(() => {
    if (!animDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [animDone]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {!animDone && <WelcomeAnimation onComplete={handleAnimComplete} />}

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(40, 40%, 94%) 0%, hsl(40, 33%, 96%) 50%, hsl(38, 30%, 90%) 100%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-conic-gradient(hsl(var(--primary)) 0% 25%, transparent 0% 50%)`,
          backgroundSize: "20px 20px",
        }}
      />

      <FlowerPetals active={animDone && !scrolled} />

      {/* Main content — staggered entrance after welcome animation */}
      <div
        className="relative z-20 flex flex-col items-center px-4"
        style={{
          opacity: animDone ? 1 : 0,
          transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Ganesha image with glowing halo */}
        <div className="relative">
          <div
            className="absolute inset-0 -m-8 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(43, 85%, 52%, 0.25) 0%, transparent 70%)",
              animation: animDone ? "glow-pulse 3s ease-in-out infinite" : "none",
            }}
          />
          <img
            src={ganeshaImg}
            alt="Lord Ganesha"
            className="w-60 h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain relative z-10"
            style={{
              filter: "drop-shadow(0 0 30px hsla(43, 85%, 52%, 0.35))",
              opacity: animDone ? 1 : 0,
              transform: animDone ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
              transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          />
        </div>

        {/* Sanskrit blessing */}
        <p
          className="text-script text-gold mt-3 text-xl sm:text-2xl md:text-3xl"
          style={{
            opacity: animDone ? 1 : 0,
            transform: animDone ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
            textShadow: "0 0 15px hsla(43, 85%, 52%, 0.4)",
          }}
        >
          Shree Ganeshaya Namaha
        </p>

        {/* Main title */}
        <h1
          className="text-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 tracking-wide text-center text-primary"
          style={{
            opacity: animDone ? 1 : 0,
            transform: animDone ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            lineHeight: 1.1,
            textShadow: "0 2px 20px hsla(345, 70%, 28%, 0.2)",
          }}
        >
          SADA SRI NILAYAM
        </h1>

        {/* Gold divider */}
        <div
          className="section-divider mt-4"
          style={{
            opacity: animDone ? 1 : 0,
            transform: animDone ? "scaleX(1)" : "scaleX(0)",
            transition: "opacity 0.7s ease-out 0.7s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        />

        {/* Subtitle */}
        <p
          className="text-body-serif text-base sm:text-lg md:text-xl mt-4 text-muted-foreground"
          style={{
            opacity: animDone ? 1 : 0,
            transform: animDone ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.8s ease-out 0.85s, transform 0.8s ease-out 0.85s",
            letterSpacing: "0.04em",
          }}
        >
          Housewarming Ceremony
        </p>
      </div>



      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes float-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
