import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { STAGES, LEADS, FOLLOWUP_STEPS, formatINR, roomsRequirement, whatsappSent, leadOwner } from "../../data/leads";
import SourceTag, { sourceColor } from "../SourceTag";
import Avatar from "../Avatar";
import EventBadge from "../EventBadge";
import ScoreRing from "../ScoreRing";
import LastTouch from "../LastTouch";

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

// Whether a WhatsApp message has already gone out to this lead — the thing
// Aman/Harman actually want to know before calling: has anyone reached out yet.
function WhatsAppStatus({ sent }) {
  return (
    <div className="flex items-center gap-1.5 mb-2 font-mono text-[9px] uppercase tracking-wide" style={{ color: sent ? "var(--color-emerald)" : "var(--color-stone)" }}>
      <MessageCircle size={10} style={{ opacity: sent ? 1 : 0.5 }} />
      {sent ? "WhatsApp sent" : "No WhatsApp yet"}
    </div>
  );
}

function stageLabel(l) {
  const base = STAGES.find((s) => s.id === l.stage)?.label;
  return l.followupStep === undefined ? base : `${base} · F${l.followupStep}`;
}

export default function FunnelView({ openLead, viewer = "Aman" }) {
  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer);
  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Lead Stages</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        {viewer}'s leads, one thread each — calls, WhatsApp, follow-up, all on the card.
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
              className="min-w-[260px] w-[260px] shrink-0 rounded-2xl p-3.5"
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
                  const stale = l.days >= 5 && l.stage !== "booked";
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
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[12.5px] leading-tight truncate" style={{ color: "var(--color-ink)" }}>{l.name}</div>
                          <div className="font-mono text-[9px] truncate mt-0.5" style={{ color: "var(--color-stone)" }}>{l.phone}</div>
                        </div>
                        <ScoreRing score={l.score} size={30} strokeWidth={2.5} />
                      </div>

                      <div className="font-mono text-[9.5px] truncate mb-2" style={{ color: "var(--color-stone)" }}>
                        {l.guests ? `${l.guests} pax · ${roomsRequirement(l.guests)}` : roomsRequirement(l.guests)}
                        {l.value > 0 && ` · ${formatINR(l.value)}`}
                      </div>

                      <div className="mb-2"><EventBadge eventType={l.eventType} /></div>

                      {l.aiProfile && (
                        <div
                          className="inline-block text-[9.5px] leading-snug rounded-lg px-2 py-1 mb-2"
                          style={{ background: "rgba(201,162,39,0.1)", color: "var(--color-gold-deep)" }}
                        >
                          {l.aiProfile.persona}
                        </div>
                      )}

                      <FollowupStatus step={l.followupStep} />
                      <WhatsAppStatus sent={whatsappSent(l)} />

                      <div className="flex items-center justify-between mb-1.5">
                        <SourceTag source={l.source} />
                        <span className="text-[10.5px]" style={{ color: l.followupStep >= 4 ? "var(--color-rose)" : "var(--color-stone)" }}>
                          {stageLabel(l)}
                        </span>
                      </div>

                      <LastTouch days={l.days} stale={stale} />
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
