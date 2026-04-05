import { useState, useRef, useEffect } from "react";

const MUSIC_SRC = "/ekadantaya-vakratundaya-flute-version-credit-rahul-crishnan-youtube-channel.mp3";

const MusicToggle = () => {
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  // Mirror of `playing` state readable inside any closure without stale capture
  const playingRef = useRef(true);

  // Keep playingRef in sync whenever state changes
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const tryPlay = () => {
      if (startedRef.current || !audioRef.current) return;
      audioRef.current.play().then(() => {
        startedRef.current = true;
      }).catch(() => {
        // Autoplay blocked — will start on first user gesture
      });
    };

    tryPlay();

    // Start on first interaction only if the user hasn't manually muted
    const handleInteraction = () => {
      if (!startedRef.current && playingRef.current) tryPlay();
      if (startedRef.current) {
        document.removeEventListener("click",      handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("scroll",     handleInteraction);
      }
    };

    document.addEventListener("click",      handleInteraction, { once: false });
    document.addEventListener("touchstart", handleInteraction, { once: false });
    document.addEventListener("scroll",     handleInteraction, { once: false, passive: true });

    // Allow other components (e.g. PhotoGallery during video) to pause/resume music
    const handleMusicPause = () => {
      audioRef.current?.pause();
    };
    const handleMusicResume = () => {
      // Only resume if the user hasn't manually muted (playingRef reflects current state)
      if (playingRef.current && startedRef.current) {
        audioRef.current?.play().catch(() => {});
      }
    };

    window.addEventListener("music:pause",  handleMusicPause);
    window.addEventListener("music:resume", handleMusicResume);

    return () => {
      document.removeEventListener("click",      handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll",     handleInteraction);
      window.removeEventListener("music:pause",  handleMusicPause);
      window.removeEventListener("music:resume", handleMusicResume);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
      startedRef.current = true;
    }
    setPlaying((p) => !p);
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
        /* Speaker with sound waves */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        /* Speaker muted (X) */
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
