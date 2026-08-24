"use client";

type Song = {
  title: string;
  artist: string;
  url?: string;
};

type Props = {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
};

export default function RetroNowPlaying({
  song,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
}: Props) {
  const progress =
    duration > 0
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      {/* TOP */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
            Now Playing
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            {song.title}
          </h1>

          <p className="mt-1 text-sm text-white/45">
            {song.artist}
          </p>
        </div>

        <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400">
          Live
        </div>
      </div>

      {/* ARTWORK */}
      <div className="relative mx-auto w-full max-w-[560px]">
        <div className="absolute inset-8 rounded-[32px] bg-orange-500/20 blur-[70px]" />

        <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-orange-950 via-zinc-900 to-black shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.35),transparent_45%)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mb-3 text-6xl">📻</div>

            <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
              RetroRoom FM
            </div>
          </div>

          {/* WAVEFORM */}
          <div className="absolute bottom-7 left-8 right-8 flex h-10 items-center justify-center gap-[3px] opacity-80">
            {Array.from({ length: 70 }).map((_, i) => {
              const height =
                10 +
                ((i * 17) % 25);

              return (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-orange-500/80"
                  style={{
                    height: `${height}px`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mx-auto mt-7 w-full max-w-[560px]">
        <div className="mb-2 flex justify-between text-[10px] text-white/35">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CONTROLS */}
      <div className="mt-7 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={onPrevious}
          className="text-xl text-white/45 transition hover:text-white"
        >
          ⏮
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-xl text-black shadow-[0_0_35px_rgba(249,115,22,0.3)] transition hover:scale-105"
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>

        <button
          type="button"
          onClick={onNext}
          className="text-xl text-white/45 transition hover:text-white"
        >
          ⏭
        </button>

        <button
          type="button"
          className="ml-3 text-lg text-white/45 transition hover:text-white"
        >
          ♡
        </button>
      </div>

      {/* UP NEXT */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
            Up Next
          </span>

          <button className="text-xs text-orange-400">
            View all
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              🎵
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">
                Your next song
              </div>
              <div className="text-xs text-white/35">
                RetroRoom FM
              </div>
            </div>

            <span className="text-xs text-white/25">
              •••
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}