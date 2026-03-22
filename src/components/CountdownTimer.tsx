import { useState, useEffect } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

const EVENT_DATE = new Date("2026-04-20T08:30:00+05:30");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const { ref, visible } = useScrollReveal();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const diff = EVENT_DATE.getTime() - now;
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);

  if (expired) return null;
  if (!timeLeft) {
    return (
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display text-2xl sm:text-3xl font-semibold mb-2 text-primary">
            The Auspicious Day Awaits
          </h2>
        </div>
      </section>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-display text-2xl sm:text-3xl font-semibold mb-2"
          style={{
            color: "hsl(345, 70%, 28%)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          The Auspicious Day Awaits
        </h2>
        <p
          className="text-script text-xl text-gold mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease-out 0.2s",
          }}
        >
          April 20, 2026 at 8:30 AM
        </p>

        <div className="flex justify-center gap-4 sm:gap-6">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className="card-ornate px-4 py-5 sm:px-6 sm:py-6 min-w-[70px] sm:min-w-[90px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`,
              }}
            >
              <span
                className="text-display text-3xl sm:text-4xl font-bold block tabular-nums"
                style={{ color: "hsl(345, 70%, 28%)" }}
              >
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-body-serif text-xs sm:text-sm text-muted-foreground mt-1 block uppercase tracking-wider">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
