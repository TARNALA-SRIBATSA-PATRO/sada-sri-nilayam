import { useState } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

const CONTACTS = [
  { name: "Deenabandhu", phone: "9999999999" },
  { name: "Sabita", phone: "9999999999" },
  { name: "Bikrant", phone: "9999999999" },
  { name: "Rakesh", phone: "9999999999" },
  { name: "Bibhu", phone: "9999999999" },
  { name: "Boobly", phone: "9999999999" },
  { name: "Joobly", phone: "9999999999" },
];

interface ContactSectionProps {
  userName?: string;
}

const ContactSection = ({ userName = "" }: ContactSectionProps) => {
  const { ref, visible } = useScrollReveal();
  const [form, setForm] = useState({ name: userName, nickname: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to backend/email
    console.log("Form submitted:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section ref={ref} className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-display text-2xl sm:text-3xl font-semibold text-center mb-12"
          style={{
            color: "hsl(345, 70%, 28%)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Get in Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div
            className="card-ornate p-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <h3 className="text-display text-xl font-semibold mb-6 text-foreground">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-body-serif text-sm text-muted-foreground block mb-1">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg text-body-serif text-foreground transition-all duration-200 outline-none"
                  style={{
                    background: "hsl(40, 33%, 96%)",
                    border: "1px solid hsla(43, 85%, 52%, 0.25)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(43, 85%, 52%)"}
                  onBlur={(e) => e.target.style.borderColor = "hsla(43, 85%, 52%, 0.25)"}
                />
              </div>
              <div>
                <label className="text-body-serif text-sm text-muted-foreground block mb-1">Nickname</label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-body-serif text-foreground transition-all duration-200 outline-none"
                  style={{
                    background: "hsl(40, 33%, 96%)",
                    border: "1px solid hsla(43, 85%, 52%, 0.25)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(43, 85%, 52%)"}
                  onBlur={(e) => e.target.style.borderColor = "hsla(43, 85%, 52%, 0.25)"}
                />
              </div>
              <div>
                <label className="text-body-serif text-sm text-muted-foreground block mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-body-serif text-foreground transition-all duration-200 outline-none resize-none"
                  style={{
                    background: "hsl(40, 33%, 96%)",
                    border: "1px solid hsla(43, 85%, 52%, 0.25)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(43, 85%, 52%)"}
                  onBlur={(e) => e.target.style.borderColor = "hsla(43, 85%, 52%, 0.25)"}
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3 rounded-lg text-body-serif text-lg font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.97] disabled:opacity-70"
                style={{
                  background: submitted
                    ? "hsl(140, 50%, 40%)"
                    : "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
                  color: "hsl(40, 33%, 96%)",
                  boxShadow: "0 4px 16px hsla(345, 70%, 28%, 0.3)",
                }}
              >
                {submitted ? "Message Sent" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Cards */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <h3 className="text-display text-xl font-semibold mb-6 text-foreground">
              Call Us Directly
            </h3>
            <div className="space-y-3">
              {CONTACTS.map((c) => (
                <div key={c.name} className="card-ornate p-4 flex items-center justify-between">
                  <span className="text-body-serif text-lg text-foreground">{c.name}</span>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, hsl(345, 70%, 28%), hsl(345, 75%, 22%))",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(40, 33%, 96%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>
                    <a
                      href={`https://wa.me/91${c.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, hsl(142, 70%, 35%), hsl(142, 70%, 28%))",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="hsl(40, 33%, 96%)">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.386 0-4.597-.813-6.355-2.178l-.447-.36-2.886.968.968-2.886-.36-.447A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
