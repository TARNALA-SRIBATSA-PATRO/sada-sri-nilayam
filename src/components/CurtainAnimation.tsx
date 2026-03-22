import { useState, useEffect, useCallback } from "react";

interface CurtainAnimationProps {
  onComplete: () => void;
}

const CurtainAnimation = ({ onComplete }: CurtainAnimationProps) => {
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "done">("closed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 600);
    const t2 = setTimeout(() => setPhase("open"), 2800);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === "done") return null;

  const leftStyle: React.CSSProperties = {
    transform: phase === "closed" ? "translateX(0)" :
               phase === "opening" ? "translateX(-92%)" : "translateX(-92%)",
    transition: phase === "opening"
      ? "transform 2.2s cubic-bezier(0.25, 0.1, 0.25, 1)"
      : "transform 0.8s ease-out",
    opacity: phase === "open" ? 0 : 1,
    transitionProperty: phase === "open" ? "transform, opacity" : "transform",
    transitionDuration: phase === "open" ? "0.8s" : undefined,
  };

  const rightStyle: React.CSSProperties = {
    transform: phase === "closed" ? "translateX(0)" :
               phase === "opening" ? "translateX(92%)" : "translateX(92%)",
    transition: phase === "opening"
      ? "transform 2.2s cubic-bezier(0.25, 0.1, 0.25, 1)"
      : "transform 0.8s ease-out",
    opacity: phase === "open" ? 0 : 1,
    transitionProperty: phase === "open" ? "transform, opacity" : "transform",
    transitionDuration: phase === "open" ? "0.8s" : undefined,
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top bar (pelmet) */}
      <div
        className="fixed top-0 left-0 right-0 h-6 z-[101]"
        style={{
          background: "linear-gradient(180deg, hsl(43, 85%, 42%), hsl(43, 80%, 35%))",
          boxShadow: "0 4px 20px hsla(0,0%,0%,0.4)",
          opacity: phase === "open" ? 0 : 1,
          transition: "opacity 0.8s ease-out",
        }}
      />

      {/* Left curtain */}
      <div className="curtain-left" style={leftStyle}>
        <div className="curtain-fabric">
          {/* Gold trim */}
          <div
            className="absolute top-0 right-0 w-4 h-full"
            style={{
              background: "linear-gradient(180deg, hsl(43,85%,52%), hsl(43,70%,40%), hsl(43,85%,52%))",
              opacity: 0.6,
            }}
          />
          {/* Fold shadows */}
          {[20, 40, 60, 80].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 h-full"
              style={{
                left: `${pct}%`,
                width: "2px",
                background: `linear-gradient(180deg, transparent, hsla(0,0%,0%,0.15), transparent)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right curtain */}
      <div className="curtain-right" style={rightStyle}>
        <div className="curtain-fabric">
          <div
            className="absolute top-0 left-0 w-4 h-full"
            style={{
              background: "linear-gradient(180deg, hsl(43,85%,52%), hsl(43,70%,40%), hsl(43,85%,52%))",
              opacity: 0.6,
            }}
          />
          {[20, 40, 60, 80].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 h-full"
              style={{
                left: `${pct}%`,
                width: "2px",
                background: `linear-gradient(180deg, transparent, hsla(0,0%,0%,0.15), transparent)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurtainAnimation;
