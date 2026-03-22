import { useEffect, useState, useRef } from "react";

interface Petal {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  swayAmount: number;
}

const PETAL_COLORS = [
  "hsl(43, 85%, 52%)",
  "hsl(30, 90%, 55%)",
  "hsl(15, 85%, 55%)",
  "hsl(340, 60%, 70%)",
  "hsl(350, 70%, 65%)",
  "hsl(45, 90%, 60%)",
];

const FlowerPetals = ({ active }: { active: boolean }) => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [opacity, setOpacity] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setOpacity(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setOpacity(1);
    const createPetal = (): Petal => ({
      id: counterRef.current++,
      x: Math.random() * 100,
      size: 8 + Math.random() * 14,
      delay: 0,
      duration: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      swayAmount: 20 + Math.random() * 40,
    });

    const initial = Array.from({ length: 20 }, () => {
      const p = createPetal();
      p.delay = Math.random() * 3;
      return p;
    });
    setPetals(initial);

    intervalRef.current = setInterval(() => {
      setPetals((prev) => {
        const filtered = prev.length > 35 ? prev.slice(-28) : prev;
        return [...filtered, createPetal(), createPetal()];
      });
    }, 600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      style={{
        opacity,
        transition: "opacity 1.5s ease-out",
      }}
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: "-20px",
            width: petal.size,
            height: petal.size * 0.7,
            borderRadius: "50% 0 50% 0",
            backgroundColor: petal.color,
            opacity: 0.85,
            animation: `petal-fall ${petal.duration}s ease-in ${petal.delay}s forwards, petal-sway ${petal.duration * 0.6}s ease-in-out ${petal.delay}s infinite`,
            transform: `rotate(${petal.rotation}deg)`,
            boxShadow: "inset 1px 1px 2px hsla(0,0%,100%,0.3)",
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

export default FlowerPetals;
