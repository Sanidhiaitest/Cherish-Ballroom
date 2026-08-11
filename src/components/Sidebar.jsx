import { motion } from "framer-motion";
import { LayoutGrid, GitBranch, Table2, Share2, Sparkles, Zap, PieChart } from "lucide-react";
import { ChandelierMotif } from "./Illustrations";

const ITEMS = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "funnel", label: "Live Funnel", Icon: GitBranch },
  { id: "allLeads", label: "All Leads", Icon: Table2 },
  { id: "referral", label: "Referral Web", Icon: Share2 },
  { id: "automation", label: "Copilot", Icon: Zap },
  { id: "reports", label: "Report", Icon: PieChart },
];

export default function Sidebar({ view, setView }) {
  return (
    <div
      className="hidden md:flex flex-col shrink-0 w-64 px-5 py-7 relative overflow-hidden"
      style={{
        background: "linear-gradient(190deg, var(--color-ink) 0%, var(--color-ink-soft) 100%)",
        color: "var(--color-ivory)",
      }}
    >
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 0 }}>
        <ChandelierMotif opacity={0.07} width={220} />
      </div>

      <div className="flex items-center gap-3 px-2 mb-10 relative">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.35)" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 6c0 0 8 0 8 4s-8 4-8 4" stroke="var(--color-gold)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <circle cx="5" cy="6" r="1.6" fill="var(--color-gold)" />
            <circle cx="5" cy="14" r="1.6" fill="var(--color-gold-soft)" />
          </svg>
        </div>
        <div>
          <div className="font-serif text-[19px] leading-none tracking-wide">Cherish</div>
          <div className="font-mono text-[9.5px] mt-1 uppercase tracking-[0.16em]" style={{ color: "var(--color-gold-soft)" }}>
            Command Center
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 relative" style={{ zIndex: 1 }}>
        {ITEMS.map((it) => {
          const active = view === it.id;
          const Icon = it.Icon;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors duration-200"
              style={{ color: active ? "var(--color-paper)" : "var(--color-stone)" }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.28)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={16.5} strokeWidth={1.8} className="relative z-10" style={{ color: active ? "var(--color-gold-soft)" : undefined }} />
              <span className="relative z-10">{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", zIndex: 1 }}>
        <div
          className="rounded-2xl p-4"
          style={{ background: "linear-gradient(150deg, rgba(201,162,39,0.14), rgba(31,77,61,0.14))", border: "1px solid rgba(201,162,39,0.2)" }}
        >
          <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ color: "var(--color-gold-soft)" }}>
            <Sparkles size={11} />
            Gen-Z Half-Sold Index
          </div>
          <div className="font-serif text-[26px] mt-1.5" style={{ color: "var(--color-paper)" }}>0.63</div>
          <div className="font-body text-[11px] mt-1 leading-snug" style={{ color: "var(--color-stone)" }}>
            of inbound queries arrive pre-decided, not cold
          </div>
        </div>
      </div>
    </div>
  );
}
