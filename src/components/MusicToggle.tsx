import { useState, useRef, useEffect } from "react";

const MUSIC_SRC = "/ekadantaya-vakratundaya-flute-version-credit-rahul-crishnan-youtube-channel.mp3";
const TARGET_VOLUME = 0.35;
const FADE_MS = 2000; // 2 s fade-in

const MusicToggle = () => {
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(true);

  useEffect(() => { playingRef.current = playing; }, [playing]);

  /** Ramp volume 0 → TARGET_VOLUME over FADE_MS */
  const fadeIn = (audio: HTMLAudioElement) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.volume = 0;
    const steps = 50;
    const stepTime = FADE_MS / steps;
    const volStep = TARGET_VOLUME / steps;
    let i = 0;
    fadeIntervalRef.current = setInterval(() => {
      i++;
      audio.volume = Math.min(TARGET_VOLUME, i * volStep);
      if (i >= steps) {
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
      }
    }, stepTime);
  };

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0;
    // ── KEY TRICK: muted autoplay is ALWAYS allowed by browsers ──────────
    // We start playing silently right away, then unmute + fade-in after
    // the welcome animation finishes. Zero jerk, zero blocked-play error.
    audio.muted = true;
    audioRef.current = audio;

    // Begin buffering / silent playback immediately
    audio.play().catch(() => {
      // Totally blocked (very rare) — fall through to interaction listener
    });

    // ── Event: welcome animation done → unmute + fade in ─────────────────
    const handleWelcomeComplete = () => {
      if (!playingRef.current) return;   // user muted before animation ended
      audio.muted = false;
      fadeIn(audio);
    };
    window.addEventListener("welcome:complete", handleWelcomeComplete);

    // ── Fallback: if play() above was blocked, first gesture rescues it ───
    const handleInteraction = () => {
      if (audio.paused) {
        audio.play().then(() => {
          if (!audio.muted) return;      // welcome:complete already fired
          // Still in animation — will unmute via welcome:complete
        }).catch(() => {});
      }
      document.removeEventListener("click",      handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
    document.addEventListener("click",      handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });

    // ── PhotoGallery video sync ───────────────────────────────────────────
    const handleMusicPause = () => {
      if (fadeIntervalRef.current) { clearInterval(fadeIntervalRef.current); fadeIntervalRef.current = null; }
      audio.pause();
    };
    const handleMusicResume = () => {
      if (!playingRef.current) return;
      audio.play().catch(() => {});
      if (!audio.muted && audio.volume < TARGET_VOLUME) fadeIn(audio);
    };
    window.addEventListener("music:pause",  handleMusicPause);
    window.addEventListener("music:resume", handleMusicResume);

    return () => {
      window.removeEventListener("welcome:complete", handleWelcomeComplete);
      window.removeEventListener("music:pause",  handleMusicPause);
      window.removeEventListener("music:resume", handleMusicResume);
      document.removeEventListener("click",      handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
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
      if (fadeIntervalRef.current) { clearInterval(fadeIntervalRef.current); fadeIntervalRef.current = null; }
      audio.pause();
    } else {
      audio.muted = false;
      audio.play().catch(() => {});
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
