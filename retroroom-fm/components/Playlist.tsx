"use client";

import { songs } from "@/data/songs";

type Song = (typeof songs)[number];

type PlaylistProps = {
  language: string;
  search?: string;
  onSelectSong: (song: Song) => void;
  currentSongId?: string | number;
  isPlaying?: boolean;
};

export default function Playlist({
  language,
  search = "",
  onSelectSong,
  currentSongId,
  isPlaying = false,
}: PlaylistProps) {
  const safeSearch = String(search ?? "").toLowerCase().trim();
  const safeLanguage = String(language ?? "").toLowerCase().trim();

  const filteredSongs = songs.filter((song) => {
    const songLanguage = String(song.language ?? "").toLowerCase();

    const matchesLanguage =
      !safeLanguage ||
      songLanguage === safeLanguage;

    const searchableText = [
      song.title,
      song.artist,
      song.language,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !safeSearch ||
      searchableText.includes(safeSearch);

    return matchesLanguage && matchesSearch;
  });

  if (filteredSongs.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center backdrop-blur-xl">
        <div className="text-4xl text-white/10">
          ♫
        </div>

        <p className="mt-4 text-sm text-white/45">
          No songs found
        </p>

        <p className="mt-2 text-xs text-white/20">
          Try another search or language.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {filteredSongs.map((song, index) => {
        const active =
          currentSongId === song.id;

        return (
          <button
            key={song.id}
            type="button"
            onClick={() => onSelectSong(song)}
            className={`group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300 ${
              active
                ? "border-white/[0.15] bg-white/[0.08] shadow-lg"
                : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.11] hover:bg-white/[0.055]"
            }`}
          >

            {/* NUMBER */}

            <div className="hidden w-7 shrink-0 text-center text-[10px] text-white/20 sm:block">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* COVER */}

            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]">

              {song.cover ? (
                <img
                  src={song.cover}
                  alt={song.title}
                  className={`h-full w-full object-cover transition duration-500 ${
                    active
                      ? "scale-110"
                      : "group-hover:scale-105"
                  }`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl text-white/20">
                  ♫
                </div>
              )}

              {/* ACTIVE OVERLAY */}

              {active && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">

                  {isPlaying ? (
                    <div className="flex items-end gap-[2px]">

                      <span className="h-3 w-[2px] animate-pulse rounded-full bg-white" />

                      <span className="h-5 w-[2px] animate-pulse rounded-full bg-white [animation-delay:150ms]" />

                      <span className="h-4 w-[2px] animate-pulse rounded-full bg-white [animation-delay:300ms]" />

                      <span className="h-6 w-[2px] animate-pulse rounded-full bg-white [animation-delay:450ms]" />

                    </div>
                  ) : (
                    <span className="text-sm text-white">
                      ▶
                    </span>
                  )}

                </div>
              )}

            </div>

            {/* INFO */}

            <div className="min-w-0 flex-1">

              <p
                className={`truncate text-sm font-medium ${
                  active
                    ? "text-white"
                    : "text-white/75"
                }`}
              >
                {song.title}
              </p>

              <p className="mt-1 truncate text-[11px] text-white/30">
                {song.artist || "Unknown Artist"}
              </p>

            </div>

            {/* LANGUAGE */}

            <span className="hidden rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[9px] uppercase tracking-[0.15em] text-white/25 md:block">
              {song.language || language}
            </span>

            {/* PLAY */}

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                active
                  ? "bg-white text-black"
                  : "border border-white/[0.08] bg-white/[0.03] text-white/30 group-hover:text-white"
              }`}
            >
              {active && isPlaying ? "Ⅱ" : "▶"}
            </div>

          </button>
        );
      })}
    </div>
  );
}