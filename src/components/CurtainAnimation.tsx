import { useState, useEffect } from "react";

interface CurtainAnimationProps {
  onComplete: () => void;
}

const CurtainAnimation = ({ onComplete }: CurtainAnimationProps) => {
  const [phase, setPhase] = useState<"closed" | "peek" | "pause" | "opening" | "open" | "done">("closed");

  useEffect(() => {
    // Fast initial peek → friction pause → slow smooth open → fade out
    const t1 = setTimeout(() => setPhase("peek"), 400);
    const t2 = setTimeout(() => setPhase("pause"), 1000);
    const t3 = setTimeout(() => setPhase("opening"), 1400);
    const t4 = setTimeout(() => setPhase("open"), 4200);
    const t5 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  const getTransform = (side: "left" | "right") => {
    const dir = side === "left" ? -1 : 1;
    switch (phase) {
      case "closed": return "translateX(0)";
      case "peek": return `translateX(${dir * 15}%)`;
      case "pause": return `translateX(${dir * 15}%)`;
      case "opening":
      case "open": return `translateX(${dir * 105}%)`;
      default: return "translateX(0)";
    }
  };

  const getTransition = () => {
    switch (phase) {
      case "peek": return "transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
      case "pause": return "transform 0.1s ease";
      case "opening": return "transform 2.8s cubic-bezier(0.16, 0.9, 0.4, 1)";
      case "open": return "transform 0.8s ease-out, opacity 0.8s ease-out";
      default: return "none";
    }
  };

  const curtainOpacity = phase === "open" ? 0 : 1;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top bar (pelmet) */}
      <div
        className="fixed top-0 left-0 right-0 h-8 z-[101]"
        style={{
          background: "linear-gradient(180deg, hsl(43, 85%, 42%), hsl(43, 80%, 35%))",
          boxShadow: "0 4px 20px hsla(0,0%,0%,0.4)",
          opacity: curtainOpacity,
          transition: "opacity 0.8s ease-out",
        }}
      >
        {/* Decorative trim */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2"
          style={{
            background: "repeating-linear-gradient(90deg, hsl(43, 85%, 52%) 0px, hsl(43, 70%, 40%) 8px, hsl(43, 85%, 52%) 16px)",
          }}
        />
      </div>

      {/* Left curtain */}
      <div
        className="curtain-left"
        style={{
          transform: getTransform("left"),
          transition: getTransition(),
          opacity: curtainOpacity,
        }}
      >
        <div className="curtain-fabric">
          {/* Gold trim on inner edge */}
          <div
            className="absolute top-0 right-0 w-5 h-full"
            style={{
              background: "linear-gradient(180deg, hsl(43,85%,52%), hsl(43,70%,40%), hsl(43,85%,52%))",
              opacity: 0.5,
            }}
          />
          {/* Fabric folds - vertical shadow lines */}
          {[15, 30, 45, 60, 75, 88].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 h-full"
              style={{
                left: `${pct}%`,
                width: pct % 30 === 0 ? "3px" : "2px",
                background: `linear-gradient(180deg, transparent 5%, hsla(0,0%,0%,${pct % 30 === 0 ? 0.18 : 0.1}) 30%, hsla(0,0%,0%,${pct % 30 === 0 ? 0.22 : 0.12}) 70%, transparent 95%)`,
              }}
            />
          ))}
          {/* Fabric highlight folds */}
          {[22, 52, 70].map((pct) => (
            <div
              key={`h-${pct}`}
              className="absolute top-0 h-full"
              style={{
                left: `${pct}%`,
                width: "1px",
                background: `linear-gradient(180deg, transparent 10%, hsla(345,60%,40%,0.3) 40%, hsla(345,60%,40%,0.2) 60%, transparent 90%)`,
              }}
            />
          ))}
          {/* Bottom drape effect */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{
              background: "linear-gradient(180deg, transparent, hsla(0,0%,0%,0.15))",
            }}
          />
        </div>
      </div>

      {/* Right curtain */}
      <div
        className="curtain-right"
        style={{
          transform: getTransform("right"),
          transition: getTransition(),
          opacity: curtainOpacity,
        }}
      >
        <div className="curtain-fabric">
          <div
            className="absolute top-0 left-0 w-5 h-full"
            style={{
              background: "linear-gradient(180deg, hsl(43,85%,52%), hsl(43,70%,40%), hsl(43,85%,52%))",
              opacity: 0.5,
            }}
          />
          {[12, 25, 40, 55, 70, 85].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 h-full"
              style={{
                left: `${pct}%`,
                width: pct % 25 === 0 ? "3px" : "2px",
                background: `linear-gradient(180deg, transparent 5%, hsla(0,0%,0%,${pct % 25 === 0 ? 0.18 : 0.1}) 30%, hsla(0,0%,0%,${pct % 25 === 0 ? 0.22 : 0.12}) 70%, transparent 95%)`,
              }}
            />
          ))}
          {[18, 48, 65].map((pct) => (
            <div
              key={`h-${pct}`}
              className="absolute top-0 h-full"
              style={{
                left: `${pct}%`,
                width: "1px",
                background: `linear-gradient(180deg, transparent 10%, hsla(345,60%,40%,0.3) 40%, hsla(345,60%,40%,0.2) 60%, transparent 90%)`,
              }}
            />
          ))}
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{
              background: "linear-gradient(180deg, transparent, hsla(0,0%,0%,0.15))",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurtainAnimation;
