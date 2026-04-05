import { useState, useEffect } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { getEventDate } from "@/lib/invitations";

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
  const [eventDate, setEventDateState] = useState<Date | null>(null);

  useEffect(() => {
    getEventDate().then(setEventDateState);
  }, []);

  useEffect(() => {
    const calc = () => {
      if (!eventDate) return;
      const now = new Date().getTime();
      const diff = eventDate.getTime() - now;
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
  }, [eventDate]);

  const formatEventDate = () => {
    if (!eventDate) return "";
    return eventDate.toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " at " + eventDate.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (expired) return null;

  return (
    <section ref={ref} className="py-16 md:py-28 px-4 sm:px-6 min-h-[250px] flex items-center justify-center">
      {eventDate && timeLeft && (() => {
        const units = [
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ];
        
        return (
          <div className="max-w-3xl mx-auto text-center w-full">
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
          {formatEventDate()}
        </p>

        <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className="card-ornate px-3 py-4 sm:px-6 sm:py-6 min-w-[62px] sm:min-w-[90px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`,
              }}
            >
              <span
                className="text-display text-2xl sm:text-4xl font-bold block tabular-nums"
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
        );
      })()}
    </section>
  );
};

export default CountdownTimer;
