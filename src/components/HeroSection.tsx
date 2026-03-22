import { useState, useCallback, useEffect } from "react";
import ganeshaImg from "@/assets/ganesha.png";
import CurtainAnimation from "./CurtainAnimation";
import FlowerPetals from "./FlowerPetals";

const HeroSection = () => {
  const [curtainDone, setCurtainDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleCurtainComplete = useCallback(() => {
    setCurtainDone(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {!curtainDone && <CurtainAnimation onComplete={handleCurtainComplete} />}

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(40, 40%, 94%) 0%, hsl(40, 33%, 96%) 50%, hsl(38, 30%, 90%) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-conic-gradient(hsl(var(--primary)) 0% 25%, transparent 0% 50%)`,
          backgroundSize: "20px 20px",
        }}
      />

      <FlowerPetals active={curtainDone && !scrolled} />

      <div
        className="relative z-20 flex flex-col items-center"
        style={{
          opacity: curtainDone ? 1 : 0,
          transform: curtainDone ? "scale(1)" : "scale(0.85)",
          transition: "opacity 1s ease-out 0.3s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        <div
          className="absolute inset-0 -m-12 rounded-full animate-glow-pulse"
          style={{
            background: "radial-gradient(circle, hsla(43, 85%, 52%, 0.2) 0%, transparent 70%)",
          }}
        />

        <img
          src={ganeshaImg}
          alt="Lord Ganesha"
          className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain relative z-10"
          style={{
            filter: "drop-shadow(0 0 30px hsla(43, 85%, 52%, 0.35))",
          }}
        />

        <p
          className="text-script text-gold mt-4 text-2xl sm:text-3xl"
          style={{
            opacity: curtainDone ? 1 : 0,
            transition: "opacity 1s ease-out 1s",
          }}
        >
          Shree Ganeshaya Namaha
        </p>

        <h1
          className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 tracking-wide text-center text-primary"
          style={{
            opacity: curtainDone ? 1 : 0,
            transform: curtainDone ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease-out 1.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.3s",
            lineHeight: 1.1,
          }}
        >
          SADA SRI NILAYAM
        </h1>

        <div
          className="section-divider mt-4"
          style={{
            opacity: curtainDone ? 1 : 0,
            transition: "opacity 1s ease-out 1.6s",
          }}
        />

        <p
          className="text-body-serif text-lg sm:text-xl mt-4 text-muted-foreground"
          style={{
            opacity: curtainDone ? 1 : 0,
            transition: "opacity 1s ease-out 1.8s",
          }}
        >
          Housewarming Ceremony
        </p>
      </div>

      <div
        className="absolute bottom-8 z-20 animate-float"
        style={{
          opacity: curtainDone ? 0.6 : 0,
          transition: "opacity 1s ease-out 2.5s",
        }}
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5">
          <rect x="1" y="1" width="22" height="34" rx="11" />
          <circle cx="12" cy="10" r="2" fill="hsl(var(--primary))">
            <animate attributeName="cy" values="10;22;10" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
