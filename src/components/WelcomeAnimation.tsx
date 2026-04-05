import { useEffect, useState } from "react";

interface WelcomeAnimationProps {
  onComplete: () => void;
}

const MANDALA_PATHS = [
  "M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50 A 40 40 0 0 1 50 10 Z",
];

const PETALS_CONFIG = [
  { x: 12, y: -5, size: 10, delay: 0.2, dur: 2.8, color: "hsl(350, 70%, 72%)", rot: 25 },
  { x: 28, y: -8, size: 8, delay: 0.5, dur: 2.5, color: "hsl(43, 85%, 60%)", rot: -15 },
  { x: 55, y: -4, size: 12, delay: 0.1, dur: 3.0, color: "hsl(340, 60%, 75%)", rot: 40 },
  { x: 72, y: -6, size: 9, delay: 0.7, dur: 2.6, color: "hsl(30, 90%, 62%)", rot: -30 },
  { x: 88, y: -3, size: 11, delay: 0.3, dur: 2.9, color: "hsl(43, 85%, 55%)", rot: 10 },
  { x: 20, y: -7, size: 7, delay: 0.9, dur: 2.4, color: "hsl(350, 65%, 70%)", rot: -45 },
  { x: 40, y: -5, size: 9, delay: 0.4, dur: 2.7, color: "hsl(15, 80%, 65%)", rot: 55 },
  { x: 65, y: -9, size: 8, delay: 0.6, dur: 2.5, color: "hsl(340, 55%, 72%)", rot: -20 },
  { x: 82, y: -4, size: 10, delay: 0.2, dur: 2.9, color: "hsl(43, 90%, 58%)", rot: 35 },
  { x: 5,  y: -6, size: 7, delay: 0.8, dur: 2.6, color: "hsl(350, 70%, 73%)", rot: -60 },
  { x: 95, y: -5, size: 8, delay: 0.3, dur: 2.8, color: "hsl(30, 85%, 60%)", rot: 18 },
  { x: 48, y: -7, size: 11, delay: 1.0, dur: 2.3, color: "hsl(340, 60%, 74%)", rot: -25 },
];

const WelcomeAnimation = ({ onComplete }: WelcomeAnimationProps) => {
  const [phase, setPhase] = useState<"enter" | "show" | "exit" | "done">("enter");

  useEffect(() => {
    // Phase timeline:
    // 0ms   → "enter": background fades in + mandala spins in
    // 800ms → "show": family name, diya flames, petals reveal
    // 4200ms→ "exit": overlay begins fading out (1.6s fade)
    // 4800ms→ onComplete fires DURING the fade → hero starts cross-fading in
    // 5800ms→ overlay fully invisible → WelcomeAnimation unmounts
    const t1 = setTimeout(() => setPhase("show"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 4200);
    // Fire onComplete midway through exit fade so hero and overlay cross-fade
    const t3 = setTimeout(() => { onComplete(); }, 4800);
    const t4 = setTimeout(() => { setPhase("done"); }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  if (phase === "done") return null;

  const isEnter = phase === "enter";
  const isShow = phase === "show" || phase === "exit";
  const isExit = phase === "exit";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, hsl(345, 65%, 14%) 0%, hsl(345, 80%, 8%) 60%, hsl(20, 60%, 5%) 100%)",
        opacity: isExit ? 0 : 1,
        transition: isExit ? "opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)" : "opacity 0.6s ease-out",
        pointerEvents: isExit ? "none" : "all",
      }}
    >
      {/* Radial glow behind content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, hsla(43, 85%, 40%, 0.18) 0%, transparent 65%)",
          opacity: isShow ? 1 : 0,
          transition: "opacity 1.2s ease-out",
        }}
      />

      {/* Falling petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PETALS_CONFIG.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: "-5%",
              width: p.size,
              height: p.size * 0.65,
              borderRadius: "50% 0 50% 0",
              backgroundColor: p.color,
              transform: `rotate(${p.rot}deg)`,
              opacity: isShow ? 0.85 : 0,
              animation: isShow ? `petal-fall ${p.dur}s ease-in ${p.delay}s forwards` : "none",
              boxShadow: `inset 1px 1px 3px hsla(0,0%,100%,0.25), 0 0 6px ${p.color}`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Spinning mandala ring */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: "1px solid hsla(43, 85%, 52%, 0.3)",
          transform: isEnter ? "scale(0.4) rotate(-90deg)" : "scale(1) rotate(0deg)",
          opacity: isEnter ? 0 : isExit ? 0 : 0.6,
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          animation: isShow ? "spin-slow 20s linear infinite" : "none",
        }}
      >
        {/* Dots around the ring */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * 360;
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 48 * Math.cos(rad);
          const cy = 50 + 48 * Math.sin(rad);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: i % 4 === 0 ? 6 : 3,
                height: i % 4 === 0 ? 6 : 3,
                borderRadius: "50%",
                backgroundColor: i % 4 === 0 ? "hsl(43, 85%, 52%)" : "hsla(43, 85%, 52%, 0.5)",
                left: `calc(${cx}% - ${i % 4 === 0 ? 3 : 1.5}px)`,
                top: `calc(${cy}% - ${i % 4 === 0 ? 3 : 1.5}px)`,
                boxShadow: i % 4 === 0 ? "0 0 6px hsl(43,85%,52%)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Second, counter-rotating ring */}
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          border: "1px solid hsla(340, 60%, 60%, 0.2)",
          transform: isEnter ? "scale(0.2) rotate(90deg)" : "scale(1) rotate(0deg)",
          opacity: isEnter ? 0 : isExit ? 0 : 0.4,
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          animation: isShow ? "spin-slow-reverse 15s linear infinite" : "none",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 360;
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 48 * Math.cos(rad);
          const cy = 50 + 48 * Math.sin(rad);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "0",
                transform: "rotate(45deg)",
                backgroundColor: "hsl(340, 60%, 75%)",
                left: `calc(${cx}% - 2px)`,
                top: `calc(${cy}% - 2px)`,
                opacity: 0.7,
              }}
            />
          );
        })}
      </div>

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Diya (oil lamp) SVG */}
        <div
          style={{
            opacity: isShow ? 1 : 0,
            transform: isShow ? "scale(1) translateY(0)" : "scale(0.6) translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            marginBottom: 4,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
            {/* Flame glow */}
            <ellipse cx="40" cy="22" rx="8" ry="14" fill="hsla(43,100%,65%,0.2)" />
            {/* Flame */}
            <path d="M40 8 C36 14 32 20 35 26 C37 30 43 30 45 26 C48 20 44 14 40 8Z" fill="url(#flameGrad)" />
            <path d="M40 15 C38 18 37 22 39 25 C40 27 41 25 41 22 C41 19 40 16 40 15Z" fill="hsla(43,100%,95%,0.8)" />
            {/* Wick */}
            <line x1="40" y1="30" x2="40" y2="36" stroke="hsl(30, 50%, 30%)" strokeWidth="2" strokeLinecap="round" />
            {/* Oil bowl */}
            <path d="M24 38 Q40 44 56 38 L58 46 Q40 54 22 46 Z" fill="url(#clayGrad)" />
            {/* Bowl highlight */}
            <ellipse cx="40" cy="38" rx="16" ry="3" fill="hsla(43,75%,65%,0.3)" />
            {/* Base */}
            <ellipse cx="40" cy="46" rx="14" ry="4" fill="hsl(25, 55%, 35%)" />
            <defs>
              <linearGradient id="flameGrad" x1="40" y1="8" x2="40" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="hsl(55,100%,80%)" />
                <stop offset="50%" stopColor="hsl(43,100%,60%)" />
                <stop offset="100%" stopColor="hsl(20,90%,50%)" />
              </linearGradient>
              <linearGradient id="clayGrad" x1="24" y1="38" x2="56" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="hsl(25, 65%, 50%)" />
                <stop offset="50%" stopColor="hsl(30, 70%, 55%)" />
                <stop offset="100%" stopColor="hsl(20, 60%, 42%)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Sanskrit / auspicious text */}
        <p
          className="text-script"
          style={{
            color: "hsl(43, 85%, 65%)",
            fontSize: "clamp(14px, 4vw, 20px)",
            opacity: isShow ? 1 : 0,
            transform: isShow ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.7s ease-out 0.35s",
            letterSpacing: "0.08em",
            marginBottom: 10,
            textShadow: "0 0 20px hsla(43,85%,52%,0.5)",
          }}
        >
          ॥ शुभागमनम् ॥
        </p>

        {/* Family name */}
        <h1
          className="text-display font-bold"
          style={{
            color: "hsl(40, 33%, 95%)",
            fontSize: "clamp(28px, 8vw, 56px)",
            lineHeight: 1.05,
            opacity: isShow ? 1 : 0,
            transform: isShow ? "scale(1) translateY(0)" : "scale(0.85) translateY(18px)",
            transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.45s",
            letterSpacing: "0.06em",
            textShadow: "0 0 40px hsla(43, 85%, 52%, 0.4), 0 2px 8px hsla(0,0%,0%,0.5)",
          }}
        >
          SADA SRI NILAYAM
        </h1>

        {/* Subtitle line */}
        <div
          style={{
            marginTop: 10,
            width: isShow ? 200 : 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, hsl(43,85%,52%), transparent)",
            transition: "width 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        />
        <p
          className="text-body-serif"
          style={{
            color: "hsla(40, 33%, 85%, 0.75)",
            fontSize: "clamp(12px, 3.5vw, 16px)",
            marginTop: 10,
            opacity: isShow ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.9s",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Housewarming Ceremony
        </p>

      </div>

      {/* CSS animations injected as a style tag */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeAnimation;
