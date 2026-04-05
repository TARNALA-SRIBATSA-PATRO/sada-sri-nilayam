import { useState, useEffect, useCallback, useRef } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";
import { getGalleryItems, getVideoEmbedUrl, type GalleryItem } from "@/lib/gallery";

const AUTO_SLIDE_MS = 4500; // ms between image slides

const PhotoGallery = () => {
  const { ref, visible } = useScrollReveal();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    getGalleryItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const currentItem = items[current] ?? null;
  const isCurrentVideo = currentItem?.type === "video";

  // When current slide changes, pause/resume music and manage auto-timer
  useEffect(() => {
    if (isCurrentVideo) {
      window.dispatchEvent(new Event("music:pause"));
      setVideoPlaying(true);
    } else {
      window.dispatchEvent(new Event("music:resume"));
      setVideoPlaying(false);
    }
  }, [current, isCurrentVideo]);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(items.length, 1));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
  }, [items.length]);

  // Auto-advance timer — paused when a video is active
  useEffect(() => {
    if (items.length <= 1 || isCurrentVideo) return;
    autoTimerRef.current = setTimeout(goNext, AUTO_SLIDE_MS);
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, [current, items.length, isCurrentVideo, goNext]);

  // When a direct <video> ends → advance
  const handleVideoEnd = useCallback(() => {
    window.dispatchEvent(new Event("music:resume"));
    setVideoPlaying(false);
    goNext();
  }, [goNext]);

  // YouTube / iframe: we cannot detect onEnded directly
  // So we poll: if iframe is a YouTube embed, set a fallback timer
  // (YouTube autoplay will pause at end; we advance after a 30s max safety)
  useEffect(() => {
    if (!isCurrentVideo) return;
    const fallback = setTimeout(() => goNext(), 30000); // max 30s fallback
    return () => clearTimeout(fallback);
  }, [current, isCurrentVideo, goNext]);

  if (!loading && items.length === 0) return null;

  return (
    <section ref={ref} className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading — only visible when there are items */}
        {!loading && items.length > 0 && (
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
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "hsl(345, 70%, 28%)", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
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
              if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
              setTouchStart(null);
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              {items.map((item, i) => {
                const isActive = i === current;
                const videoInfo = item.type === "video" ? getVideoEmbedUrl(item.url) : null;

                return (
                  <div
                    key={item.id}
                    className="absolute inset-0 w-full h-full transition-all duration-700"
                    style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 }}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.caption || "Gallery image"}
                        className="w-full h-full object-cover transition-transform duration-700"
                        style={{ transform: isActive ? "scale(1)" : "scale(1.05)" }}
                      />
                    ) : videoInfo?.kind === "direct" ? (
                      <video
                        ref={isActive ? videoRef : undefined}
                        src={item.url}
                        className="w-full h-full object-cover"
                        autoPlay={isActive}
                        muted={false}
                        playsInline
                        onEnded={handleVideoEnd}
                      />
                    ) : videoInfo?.kind === "youtube" ? (
                      <iframe
                        ref={isActive ? iframeRef : undefined}
                        src={isActive ? videoInfo.embedUrl : "about:blank"}
                        className="w-full h-full"
                        style={{ border: "none" }}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        title={item.caption || "Video"}
                      />
                    ) : (
                      // Fallback: show URL as broken state
                      <div className="w-full h-full flex items-center justify-center text-white text-sm opacity-50">
                        Unsupported video URL
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Gradient vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 60px hsla(345, 70%, 28%, 0.15)", zIndex: 2 }}
              />

              {/* Video playing indicator */}
              {videoPlaying && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "hsla(345, 70%, 10%, 0.75)",
                    color: "hsl(43, 85%, 52%)",
                    backdropFilter: "blur(4px)",
                    zIndex: 3,
                  }}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  Video
                </div>
              )}

              {/* Caption */}
              {currentItem?.caption && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm text-body-serif"
                  style={{
                    background: "linear-gradient(transparent, hsla(345, 70%, 10%, 0.65))",
                    color: "hsl(40, 33%, 96%)",
                    zIndex: 3,
                  }}
                >
                  {currentItem.caption}
                </div>
              )}
            </div>

            {/* Nav arrows — visible on hover */}
            {items.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                  style={{ background: "hsla(40, 33%, 96%, 0.9)", boxShadow: "0 2px 10px hsla(0,0%,0%,0.2)", zIndex: 4 }}
                  aria-label="Previous"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(345, 70%, 28%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                  style={{ background: "hsla(40, 33%, 96%, 0.9)", boxShadow: "0 2px 10px hsla(0,0%,0%,0.2)", zIndex: 4 }}
                  aria-label="Next"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(345, 70%, 28%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 4 }}>
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrent(i)}
                      className="transition-all duration-300 active:scale-90"
                      style={{
                        width: i === current ? "20px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        background: i === current
                          ? "hsl(43, 85%, 52%)"
                          : item.type === "video"
                          ? "hsla(43, 85%, 52%, 0.5)"
                          : "hsla(40, 33%, 96%, 0.6)",
                        transition: "width 0.3s, background 0.3s",
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;
