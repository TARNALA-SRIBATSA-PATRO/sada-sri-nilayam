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
  "hsl(43, 85%, 52%)",    // gold marigold
  "hsl(30, 90%, 55%)",    // orange marigold
  "hsl(15, 85%, 55%)",    // deep orange
  "hsl(340, 60%, 70%)",   // pink rose
  "hsl(350, 70%, 65%)",   // rose
  "hsl(45, 90%, 60%)",    // yellow
];

const FlowerPetals = ({ active }: { active: boolean }) => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [opacity, setOpacity] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setOpacity(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setOpacity(1);
    const createPetal = (): Petal => ({
      id: Math.random(),
      x: Math.random() * 100,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      swayAmount: 20 + Math.random() * 40,
    });

    const initial = Array.from({ length: 15 }, createPetal);
    setPetals(initial);

    intervalRef.current = setInterval(() => {
      setPetals((prev) => {
        const filtered = prev.length > 30 ? prev.slice(-25) : prev;
        return [...filtered, createPetal()];
      });
    }, 500);

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
          className="petal"
          style={{
            left: `${petal.x}%`,
            top: "-5%",
            width: petal.size,
            height: petal.size * 0.7,
            borderRadius: "50% 0 50% 0",
            backgroundColor: petal.color,
            opacity: 0.8,
            animation: `petal-fall ${petal.duration}s ease-in ${petal.delay}s forwards`,
            transform: `rotate(${petal.rotation}deg)`,
            boxShadow: `inset 1px 1px 2px hsla(0,0%,100%,0.3)`,
          }}
        />
      ))}
    </div>
  );
};

export default FlowerPetals;
