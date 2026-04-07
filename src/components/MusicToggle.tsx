import { useState, useRef, useEffect } from "react";

const MUSIC_SRC = "/ekadantaya-vakratundaya-flute-version-credit-rahul-crishnan-youtube-channel.mp3";
const TARGET_VOLUME = 0.35;

const MusicToggle = () => {
  // Default: muted (not playing)
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = TARGET_VOLUME;
    audioRef.current = audio;

    // ── PhotoGallery video sync ───────────────────────────────────────────
    const handleMusicPause  = () => { audio.pause(); };
    const handleMusicResume = () => {
      if (!playing) return;
      audio.volume = TARGET_VOLUME;
      audio.play().catch(() => {});
    };
    window.addEventListener("music:pause",  handleMusicPause);
    window.addEventListener("music:resume", handleMusicResume);

    return () => {
      window.removeEventListener("music:pause",  handleMusicPause);
      window.removeEventListener("music:resume", handleMusicResume);
      audio.pause();
      audioRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = TARGET_VOLUME;
      audio.play().catch(() => {});
      setPlaying(true);
    }
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
        /* Speaker ON icon */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--gold))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        /* Speaker MUTED icon (default) */
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
