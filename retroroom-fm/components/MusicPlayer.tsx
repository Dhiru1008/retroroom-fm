"use client";

type Song = {
  id: string | number;
  title: string;
  artist?: string;
  url: string;
  cover?: string;
  language?: string;
};

type MusicPlayerProps = {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;

  onPlay: () => void;
  onPause: () => void;
  onToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;

  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function MusicPlayer({
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlay,
  onPause,
  onToggle,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}: MusicPlayerProps) {
  const progress =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.035] shadow-2xl backdrop-blur-2xl">

      {/* GLOW */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

      {/* PLAYER */}

      <div className="relative grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-8 lg:p-10">

        {/* ARTWORK */}

        <div className="relative aspect-square overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.04] shadow-2xl">

          {song.cover ? (
            <img
              src={song.cover}
              alt={song.title}
              className={`h-full w-full object-cover transition-transform duration-700 ${
                isPlaying ? "scale-105" : "scale-100"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-black">

              <div className="text-center">

                <div className="text-7xl text-white/20">
                  ♫
                </div>

                <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-white/20">
                  RetroRoom FM
                </p>

              </div>

            </div>
          )}

          {/* ARTWORK OVERLAY */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5" />

          {isPlaying && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl">

              <span className="flex items-end gap-[2px]">

                <span className="h-2 w-[2px] animate-pulse rounded-full bg-white" />
                <span className="h-4 w-[2px] animate-pulse rounded-full bg-white [animation-delay:150ms]" />
                <span className="h-3 w-[2px] animate-pulse rounded-full bg-white [animation-delay:300ms]" />
                <span className="h-5 w-[2px] animate-pulse rounded-full bg-white [animation-delay:450ms]" />

              </span>

              <span className="text-[9px] uppercase tracking-[0.25em] text-white/60">
                Playing
              </span>

            </div>
          )}

        </div>

        {/* DETAILS */}

        <div className="flex min-w-0 flex-col justify-center">

          <div>

            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">
              Now playing
            </p>

            <h2 className="mt-3 truncate text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {song.title}
            </h2>

            <p className="mt-3 text-sm text-white/40">
              {song.artist || "Unknown Artist"}
            </p>

          </div>

          {/* PROGRESS */}

          <div className="mt-10">

            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.08]">

              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />

            </div>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) =>
                onSeek(Number(event.target.value))
              }
              className="mt-[-8px] h-4 w-full cursor-pointer opacity-0"
              aria-label="Seek song"
            />

            <div className="mt-[-2px] flex justify-between text-[10px] text-white/25">

              <span>
                {formatTime(currentTime)}
              </span>

              <span>
                {formatTime(duration)}
              </span>

            </div>

          </div>

          {/* CONTROLS */}

          <div className="mt-6 flex items-center justify-between gap-4">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={onPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Previous song"
            >
              <span className="text-lg">
                ⏮
              </span>
            </button>

            {/* PLAY */}

            <button
              type="button"
              onClick={onToggle}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <span className="text-xl">
                {isPlaying ? "Ⅱ" : "▶"}
              </span>
            </button>

            {/* NEXT */}

            <button
              type="button"
              onClick={onNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Next song"
            >
              <span className="text-lg">
                ⏭
              </span>
            </button>

          </div>

          {/* VOLUME */}

          <div className="mt-8 flex items-center gap-3">

            <span className="text-sm text-white/35">
              {volume === 0 ? "🔇" : "🔊"}
            </span>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) =>
                onVolumeChange(Number(event.target.value))
              }
              className="h-1 w-full cursor-pointer accent-white"
              aria-label="Volume"
            />

            <span className="w-8 text-right text-[10px] text-white/25">
              {Math.round(volume * 100)}
            </span>

          </div>

        </div>

      </div>

      {/* BOTTOM INFO */}

      <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white/20 md:px-8">

        <span>
          {song.language || "Hindi"}
        </span>

        <span>
          RetroRoom FM
        </span>

      </div>

    </div>
  );
}