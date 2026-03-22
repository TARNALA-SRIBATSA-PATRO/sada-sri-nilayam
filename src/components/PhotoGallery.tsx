import { useState, useEffect, useCallback } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

// Placeholder gallery images - replace with actual house photos
const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", alt: "Beautiful new home exterior" },
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", alt: "Elegant living room" },
  { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop", alt: "Modern interior design" },
  { src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop", alt: "Home garden view" },
  { src: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop", alt: "Cozy dining area" },
];

const PhotoGallery = () => {
  const { ref, visible } = useScrollReveal();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % GALLERY_IMAGES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

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
          Our New Home
        </h2>

        <div
          className="relative card-ornate overflow-hidden group"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.95)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart === null) return;
            const diff = touchStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
            setTouchStart(null);
          }}
        >
          {/* Images */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {GALLERY_IMAGES.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                style={{
                  opacity: i === current ? 1 : 0,
                  transform: i === current ? "scale(1)" : "scale(1.05)",
                }}
              />
            ))}

            {/* Gradient overlay for framing */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 60px hsla(345, 70%, 28%, 0.15)",
              }}
            />
          </div>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
            style={{
              background: "hsla(40, 33%, 96%, 0.9)",
              boxShadow: "0 2px 10px hsla(0,0%,0%,0.2)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(345, 70%, 28%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
            style={{
              background: "hsla(40, 33%, 96%, 0.9)",
              boxShadow: "0 2px 10px hsla(0,0%,0%,0.2)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(345, 70%, 28%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all duration-300 active:scale-90"
                style={{
                  background: i === current ? "hsl(43, 85%, 52%)" : "hsla(40, 33%, 96%, 0.6)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
