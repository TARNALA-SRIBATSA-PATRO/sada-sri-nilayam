import { useState } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

const EVENT_DATE = new Date("2026-04-20T08:30:00+05:30");

const CalendarModal = ({ onClose }: { onClose: () => void }) => {
  const calendarUrl = new URL("https://calendar.google.com/calendar/render");
  calendarUrl.searchParams.set("action", "TEMPLATE");
  calendarUrl.searchParams.set("text", "Housewarming Ceremony - SADA SRI NILAYAM");
  calendarUrl.searchParams.set("dates", "20260420T030000Z/20260420T080000Z");
  calendarUrl.searchParams.set("details", "You are warmly invited to the housewarming ceremony of SADA SRI NILAYAM by the Patro Family.");
  calendarUrl.searchParams.set("location", "H-33, Gatikrushna Greens, Rangabazar, Alarpur, Bhubaneswar, Khorda, PIN 752100");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "hsla(345, 70%, 10%, 0.5)", backdropFilter: "blur(4px)" }} />
      <div
        className="card-ornate p-8 max-w-md w-full relative z-10 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <h3 className="text-display text-xl font-semibold mb-2 text-foreground">
          Save the Date
        </h3>
        <p className="text-body-serif text-muted-foreground mb-6">
          Would you like to add this event to your calendar?
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href={calendarUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg text-body-serif font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
              color: "hsl(40, 33%, 96%)",
              boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.3)",
            }}
          >
            Add to Calendar
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg text-body-serif font-medium border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              borderColor: "hsla(43, 85%, 52%, 0.3)",
              color: "hsl(345, 70%, 28%)",
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
