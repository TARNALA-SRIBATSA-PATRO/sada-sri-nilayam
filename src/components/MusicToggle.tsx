import { useState, useRef, useEffect } from "react";

const MUSIC_SRC = "/ekadantaya-vakratundaya-flute-version-credit-rahul-crishnan-youtube-channel.mp3";
const TARGET_VOLUME = 0.35;
const FADE_DURATION_MS = 1800; // smooth fade-in duration

const MusicToggle = () => {
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Mirror of `playing` state readable inside any closure without stale capture
  const playingRef = useRef(true);

  // Keep playingRef in sync whenever state changes
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  /** Gradually ramp volume from 0 → TARGET_VOLUME over FADE_DURATION_MS */
  const fadeIn = (audio: HTMLAudioElement) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.volume = 0;
    const steps = 40;
    const stepTime = FADE_DURATION_MS / steps;
    const volumeStep = TARGET_VOLUME / steps;
    let current = 0;
    fadeIntervalRef.current = setInterval(() => {
      current += 1;
      audio.volume = Math.min(TARGET_VOLUME, current * volumeStep);
      if (current >= steps) {
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
      }
    }, stepTime);
  };

  /** Start playback + fade in. Safe to call multiple times (guarded by startedRef). */
  const startWithFade = () => {
    const audio = audioRef.current;
    if (startedRef.current || !audio) return;
    audio.play().then(() => {
      startedRef.current = true;
      fadeIn(audio);
    }).catch(() => {
      // Autoplay still blocked — interaction listener below will retry
    });
  };

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0; // start silent; fade-in will raise it
    audioRef.current = audio;

    // ── Trigger: welcome animation complete ───────────────────────────────
    // This fires at ~4800ms into page load after the welcome screen fades away.
    const handleWelcomeComplete = () => {
      if (playingRef.current) startWithFade();
    };
    window.addEventListener("welcome:complete", handleWelcomeComplete);

    // ── Fallback: first user gesture (scroll / tap / click) ───────────────
    // Handles browsers that block even deferred autoplay.
    const handleInteraction = () => {
      if (!startedRef.current && playingRef.current) startWithFade();
      if (startedRef.current) {
        document.removeEventListener("click",      handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("scroll",     handleInteraction);
      }
    };

    document.addEventListener("click",      handleInteraction, { once: false });
    document.addEventListener("touchstart", handleInteraction, { once: false });
    document.addEventListener("scroll",     handleInteraction, { once: false, passive: true });

    // ── Cross-component pause / resume (e.g. PhotoGallery video) ─────────
    const handleMusicPause = () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      audioRef.current?.pause();
    };
    const handleMusicResume = () => {
      if (playingRef.current && startedRef.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
        // Restore volume gently if it was faded out previously
        if (audioRef.current.volume < TARGET_VOLUME) fadeIn(audioRef.current);
      }
    };

    window.addEventListener("music:pause",  handleMusicPause);
    window.addEventListener("music:resume", handleMusicResume);

    return () => {
      document.removeEventListener("click",      handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll",     handleInteraction);
      window.removeEventListener("welcome:complete", handleWelcomeComplete);
      window.removeEventListener("music:pause",  handleMusicPause);
      window.removeEventListener("music:resume", handleMusicResume);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audioRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      audio.pause();
    } else {
      audio.play().catch(() => {});
      startedRef.current = true;
      // Fade in if volume was at zero
      if (audio.volume < TARGET_VOLUME) fadeIn(audio);
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
