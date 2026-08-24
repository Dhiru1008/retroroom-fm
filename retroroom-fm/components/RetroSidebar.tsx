"use client";

type Props = {
  language: string;
  setLanguage: (language: string) => void;
  themeOpen: boolean;
  setThemeOpen: (open: boolean) => void;
  setSirfGaane: (value: boolean) => void;
};

export default function RetroSidebar({
  language,
  setLanguage,
  themeOpen,
  setThemeOpen,
  setSirfGaane,
}: Props) {
  const languages = [
    "Hindi",
    "Punjabi",
    "Tamil",
    "Telugu",
    "Bengali",
  ];

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-white/10 bg-black/40 p-4 backdrop-blur-xl">
      {/* LOGO */}
      <div className="mb-8">
        <div className="text-xl font-black tracking-tight text-white">
          Retro<span className="text-orange-500">Room</span>
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/40">
          Music • Memories • Moments
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="space-y-1">
        <NavItem icon="⌂" label="Home" active />
        <NavItem icon="◉" label="Live Radio" />
        <NavItem icon="⌕" label="Explore" />
        <NavItem icon="↗" label="Live Chart" />
        <NavItem icon="♡" label="Favorites" />
        <NavItem icon="◷" label="History" />
      </div>

      {/* DIVIDER */}
      <div className="my-6 h-px bg-white/10" />

      {/* LANGUAGES */}
      <div>
        <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
          Languages
        </div>

        <div className="space-y-1">
          {languages.map((item) => {
            const active = language === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "bg-orange-500/15 text-orange-400"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item}</span>

                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={() => setThemeOpen(!themeOpen)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white"
        >
          <span>🎨</span>
          <span>Themes</span>
        </button>

        <button
          type="button"
          onClick={() => setSirfGaane(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          <span>🎧</span>
          <span>Music Only</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "bg-orange-500 text-black shadow-[0_0_25px_rgba(249,115,22,0.18)]"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="w-5 text-center text-base">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}