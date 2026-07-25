import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { STAGES, LEADS } from "../../data/leads";
import SourceTag from "../SourceTag";
import Avatar from "../Avatar";
import ScoreRing from "../ScoreRing";

export default function QueueView({ openLead }) {
  const sorted = [...LEADS].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Priority Queue</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        Who to call first — ranked, not guessed.
      </p>

      <div className="hidden md:grid grid-cols-[2.2fr_1fr_1fr_0.9fr_1fr_24px] px-5 py-2.5 mb-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-stone)" }}>
        <span>Lead</span><span>Source</span><span>Stage</span><span>Score</span><span>Last Touch</span><span />
      </div>

      <div className="flex flex-col gap-2.5">
        {sorted.map((l, i) => {
          const stale = l.days >= 5;
          return (
            <motion.button
              key={l.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.035 }}
              whileHover={{ x: 4 }}
              onClick={() => openLead(l)}
              className="grid grid-cols-2 md:grid-cols-[2.2fr_1fr_1fr_0.9fr_1fr_24px] items-center gap-y-2 rounded-2xl px-5 py-3.5 text-left"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
            >
              <div className="flex items-center gap-3 col-span-2 md:col-span-1 min-w-0">
                <Avatar initials={l.initials} source={l.source} size={36} />
                <div className="min-w-0">
                  <div className="font-semibold text-[13.5px] truncate" style={{ color: "var(--color-ink)" }}>{l.name}</div>
                  <div className="md:hidden mt-1"><SourceTag source={l.source} /></div>
                </div>
              </div>
              <div className="hidden md:block"><SourceTag source={l.source} /></div>
              <span className="text-[12px] hidden md:block" style={{ color: "var(--color-stone)" }}>
                {STAGES.find((s) => s.id === l.stage)?.label}
              </span>
              <div className="flex items-center">
                <ScoreRing score={l.score} size={38} strokeWidth={3} />
              </div>
              <span
                className="text-[12px] font-medium relative flex items-center gap-2"
                style={{ color: stale ? "var(--color-rose)" : "var(--color-stone)" }}
              >
                {stale && (
                  <span className="relative flex items-center justify-center" style={{ width: 6, height: 6 }}>
                    <span className="absolute inline-flex rounded-full opacity-60" style={{ width: 6, height: 6, background: "var(--color-rose)" }} />
                    <span className="pulse-ring absolute rounded-full" style={{ width: 6, height: 6, color: "var(--color-rose)" }} />
                  </span>
                )}
                {l.days === 0 ? "Today" : `${l.days}d ago`}
              </span>
              <ChevronRight size={15} className="hidden md:block" style={{ color: "var(--color-stone)" }} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
