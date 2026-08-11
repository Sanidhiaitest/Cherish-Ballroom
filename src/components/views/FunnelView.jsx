import { motion } from "framer-motion";
import { STAGES, LEADS, FOLLOWUP_STEPS, scoreTone, formatINR, TONE_COLOR, leadOwner } from "../../data/leads";
import SourceTag, { sourceColor } from "../SourceTag";
import Avatar from "../Avatar";
import EventBadge from "../EventBadge";

// The team's own F1-F4 vocabulary for the follow-up sequence, made visible
// on the card instead of living only inside the lead drawer -- a lead
// sitting in "Follow-Up" is meaningless without knowing which step it's on.
function FollowupStatus({ step }) {
  if (step === undefined) return null;
  const overdue = step >= 4;
  return (
    <div className="flex items-center gap-1 mb-2">
      {FOLLOWUP_STEPS.map((label, i) => {
        const idx = i + 1;
        const reached = idx <= step;
        const current = idx === step;
        return (
          <span
            key={label}
            className="font-mono text-[8px] font-bold rounded-full px-1.5 py-0.5"
            style={{
              background: reached ? (overdue && current ? "rgba(178,58,72,0.14)" : "rgba(201,162,39,0.14)") : "var(--color-paper)",
              color: reached ? (overdue && current ? "var(--color-rose)" : "var(--color-gold-deep)") : "var(--color-stone)",
              border: reached ? "none" : "1px solid var(--color-stone-line)",
            }}
          >
            {label}
          </span>
        );
      })}
      {overdue && (
        <span className="font-mono text-[8px] uppercase tracking-wide ml-0.5" style={{ color: "var(--color-rose)" }}>unanswered</span>
      )}
    </div>
  );
}

export default function FunnelView({ openLead, viewer = "Aman" }) {
  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer);
  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Lead Stages</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        {viewer}'s leads, one thread each — regardless of how they arrived.
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        {STAGES.map((stage, si) => {
          const items = myLeads.filter((l) => l.stage === stage.id);
          const value = items.reduce((s, l) => s + l.value, 0);
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: si * 0.05 }}
              className="min-w-[230px] w-[230px] shrink-0 rounded-2xl p-3.5"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
            >
              <div className="flex justify-between items-baseline px-1 pb-2.5 mb-3" style={{ borderBottom: "2px solid var(--color-ink)" }}>
                <span className="font-semibold text-[11.5px] uppercase tracking-wide" style={{ color: "var(--color-ink)" }}>{stage.label}</span>
                <span className="font-mono text-[11px]" style={{ color: "var(--color-stone)" }}>{items.length}</span>
              </div>
              {value > 0 && (
                <div className="px-1 mb-3 font-mono text-[10.5px]" style={{ color: "var(--color-gold-deep)" }}>{formatINR(value)} in play</div>
              )}
              <div className="flex flex-col gap-2.5">
                {items.map((l, i) => {
                  const tone = scoreTone(l.score);
                  return (
                    <motion.button
                      key={l.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: si * 0.05 + i * 0.04 }}
                      whileHover={{ y: -3, boxShadow: "0 10px 20px -8px rgba(20,17,15,0.18)" }}
                      onClick={() => openLead(l)}
                      className="rounded-xl p-3 text-left cursor-pointer"
                      style={{
                        background: "var(--color-ivory)",
                        border: "1px solid var(--color-stone-line)",
                        borderLeft: `3px solid ${sourceColor(l.source)}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar initials={l.initials} source={l.source} size={26} />
                        <div className="min-w-0">
                          <div className="font-semibold text-[12.5px] leading-tight truncate" style={{ color: "var(--color-ink)" }}>{l.name}</div>
                          <div className="font-mono text-[9.5px] truncate mt-0.5" style={{ color: "var(--color-stone)" }}>
                            {l.guests ? `${l.guests} pax` : "—"} · {l.eventDate || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="mb-2"><EventBadge eventType={l.eventType} /></div>
                      <FollowupStatus step={l.followupStep} />
                      <div className="flex justify-between items-center">
                        <SourceTag source={l.source} />
                        <span className="font-mono text-[11px] font-bold" style={{ color: TONE_COLOR[tone.tone] }}>{l.score}</span>
                      </div>
                    </motion.button>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-[11.5px] italic px-1 py-2" style={{ color: "var(--color-stone)" }}>Nothing waiting here — good.</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
