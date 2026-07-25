import { LayoutGrid, GitBranch, ListOrdered, Share2, Zap } from "lucide-react";

const ITEMS = [
  { id: "overview", label: "Home", Icon: LayoutGrid },
  { id: "funnel", label: "Funnel", Icon: GitBranch },
  { id: "queue", label: "Queue", Icon: ListOrdered },
  { id: "referral", label: "Referrals", Icon: Share2 },
  { id: "automation", label: "AI Engine", Icon: Zap },
];

export default function MobileNav({ view, setView }) {
  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-30">
      <div
        className="flex items-center gap-1 rounded-2xl px-2 py-2 shadow-xl overflow-x-auto"
        style={{ background: "var(--color-ink)", border: "1px solid var(--color-ink-line)" }}
      >
        {ITEMS.map((it) => {
          const active = view === it.id;
          const Icon = it.Icon;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className="flex-1 min-w-[64px] flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors"
              style={{ background: active ? "rgba(201,162,39,0.14)" : "transparent" }}
            >
              <Icon size={17} strokeWidth={1.8} color={active ? "var(--color-gold-soft)" : "var(--color-stone)"} />
              <span className="text-[9.5px] font-medium whitespace-nowrap" style={{ color: active ? "var(--color-paper)" : "var(--color-stone)" }}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
