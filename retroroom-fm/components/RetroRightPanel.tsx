"use client";

type Message = {
  name: string;
  message: string;
  time: string;
  bot?: boolean;
};

type Props = {
  listeners: number;
  messages: Message[];
  chatInput: string;
  setChatInput: (value: string) => void;
  onSend: () => void;
};

export default function RetroRightPanel({
  listeners,
  messages,
  chatInput,
  setChatInput,
  onSend,
}: Props) {
  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-4">
      {/* LISTENERS */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
              Live Listeners
            </div>

            <div className="mt-2 text-3xl font-black text-white">
              {listeners.toLocaleString()}
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/10 text-xl">
            👥
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          People are listening now
        </div>
      </div>

      {/* CHAT */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl">
        <div className="border-b border-white/10 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
            Chat Room
          </div>

          <div className="mt-1 text-sm font-bold text-white">
            RetroRoom Adda
          </div>
        </div>

        <div className="min-h-[330px] flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    message.bot
                      ? "text-orange-400"
                      : "text-white/70"
                  }`}
                >
                  {message.name}
                </span>

                <span className="text-[9px] text-white/20">
                  {message.time}
                </span>
              </div>

              <div className="mt-1 text-xs leading-5 text-white/45">
                {message.message}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3">
            <input
              value={chatInput}
              onChange={(e) =>
                setChatInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
              placeholder="Say something..."
              className="min-w-0 flex-1 bg-transparent py-3 text-xs text-white outline-none placeholder:text-white/20"
            />

            <button
              type="button"
              onClick={onSend}
              className="text-sm text-orange-500 transition hover:text-orange-400"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}