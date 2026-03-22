import { useState, useRef, useEffect } from "react";

const MusicToggle = () => {
  const [playing, setPlaying] = useState(true); // default unmuted
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Auto-play attempt
    const tryPlay = () => {
      if (startedRef.current || !audioRef.current) return;
      audioRef.current.play().then(() => {
        startedRef.current = true;
      }).catch(() => {
        // Browser blocked autoplay, wait for interaction
      });
    };

    tryPlay();

    // If autoplay was blocked, play on first user interaction
    const handleInteraction = () => {
      tryPlay();
      if (startedRef.current) {
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("scroll", handleInteraction);
      }
    };

    document.addEventListener("click", handleInteraction, { once: false });
    document.addEventListener("touchstart", handleInteraction, { once: false });
    document.addEventListener("scroll", handleInteraction, { once: false, passive: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          clearInterval(fadeOut);
          audio.pause();
          audio.volume = 0.3;
        }
      }, 50);
    } else {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
      startedRef.current = true;
      const audio = audioRef.current;
      const fadeIn = setInterval(() => {
        if (audio.volume < 0.25) {
          audio.volume = Math.min(0.3, audio.volume + 0.05);
        } else {
          clearInterval(fadeIn);
        }
      }, 50);
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--maroon-deep)))",
        boxShadow: "0 4px 20px hsla(345, 70%, 28%, 0.4), inset 0 1px 0 hsla(43, 85%, 52%, 0.2)",
        border: "1px solid hsla(43, 85%, 52%, 0.3)",
      }}
      aria-label={playing ? "Mute music" : "Play music"}
    >
      {playing ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
};

export default MusicToggle;
