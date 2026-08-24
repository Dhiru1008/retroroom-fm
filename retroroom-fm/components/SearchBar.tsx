"use client";

type SearchBarProps = {
  search?: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({
  search = "",
  setSearch,
}: SearchBarProps) {
  return (
    <div className="group relative">

      {/* Search icon */}

      <div className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-white/25 transition group-focus-within:text-white/50">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </div>

      {/* Input */}

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search songs, artists..."
        className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-14 pr-14 text-sm text-white outline-none backdrop-blur-xl transition-all placeholder:text-white/20 hover:border-white/[0.12] focus:border-white/[0.18] focus:bg-white/[0.055] focus:shadow-[0_0_40px_rgba(255,255,255,0.04)]"
      />

      {/* Clear */}

      {search.length > 0 && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/[0.1] hover:text-white"
          aria-label="Clear search"
        >
          ×
        </button>
      )}

      {/* Keyboard hint */}

      {search.length === 0 && (
        <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] text-white/20 sm:flex">
          SEARCH
        </div>
      )}

    </div>
  );
}