"use client";

type Song = {
  id: string | number;
  title: string;
  artist?: string;
  url: string;
  cover?: string;
};

type MiniPlayerProps = {
  song: Song;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
};

export default function MiniPlayer({
  song,
  isPlaying,
  onPlay,
  onPause,
  onNext,
}: MiniPlayerProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-3xl -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#0b0b0f]/90 p-3 shadow-2xl backdrop-blur-2xl sm:gap-4 sm:p-4">

        {/* COVER */}

        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] sm:h-14 sm:w-14">

          {song.cover ? (
            <img
              src={song.cover}
              alt={song.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-white/25">
              ♫
            </div>
          )}

        </div>

        {/* SONG INFO */}

        <div className="min-w-0 flex-1">

          <p className="truncate text-sm font-medium text-white">
            {song.title}
          </p>

          <p className="mt-1 truncate text-[10px] text-white/35">
            {song.artist || "Unknown Artist"}
          </p>

        </div>

        {/* PLAY / PAUSE */}

        <button
          type="button"
          onClick={handlePlayPause}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95 sm:h-11 sm:w-11"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>

        {/* NEXT */}

        <button
          type="button"
          onClick={onNext}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.09] hover:text-white sm:flex"
          aria-label="Next song"
        >
          ⏭
        </button>

        {/* LIVE */}

        <div className="hidden items-center gap-2 border-l border-white/10 pl-4 sm:flex">

          <span className="relative flex h-2 w-2">

            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />

          </span>

          <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
            Live
          </span>

        </div>

      </div>
    </div>
  );
}