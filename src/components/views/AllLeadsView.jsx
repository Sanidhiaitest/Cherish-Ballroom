import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { STAGES, LEADS, leadOwner, roomsRequirement, formatINR } from "../../data/leads";
import SourceTag from "../SourceTag";
import Avatar from "../Avatar";
import ScoreRing from "../ScoreRing";
import EventBadge from "../EventBadge";

// Merges the old "Priority Queue" (score-ranked, stale-lead flag) into the full
// leads list so there's one canonical, excel-detailed place to see everyone —
// same fields the real intake sheet tracks (event type, guests, rooms, date,
// phone), plus the AI persona read the sheet alone can't give.
function LastTouch({ days, stale }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: stale ? "var(--color-rose)" : "var(--color-stone)" }}>
      {stale && (
        <span className="relative flex items-center justify-center shrink-0" style={{ width: 6, height: 6 }}>
          <span className="absolute inline-flex rounded-full opacity-60" style={{ width: 6, height: 6, background: "var(--color-rose)" }} />
          <span className="pulse-ring absolute rounded-full" style={{ width: 6, height: 6, color: "var(--color-rose)" }} />
        </span>
      )}
      {days === 0 ? "Today" : `${days}d ago`}
    </span>
  );
}

function stageLabel(l) {
  const base = STAGES.find((s) => s.id === l.stage)?.label;
  return l.followupStep === undefined ? base : `${base} · F${l.followupStep}`;
}

function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[8.5px] uppercase tracking-wide" style={{ color: "var(--color-stone)" }}>{label}</div>
      <div className="text-[11.5px] mt-0.5 truncate" style={{ color: "var(--color-ink)" }}>{value}</div>
    </div>
  );
}

export default function AllLeadsView({ openLead, setView, viewer = "Aman" }) {
  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer).sort((a, b) => b.score - a.score);
  const activeCount = myLeads.filter((l) => l.stage !== "booked").length;
  const bookedCount = myLeads.length - activeCount;

  return (
    <div>
      <button
        onClick={() => setView("overview")}
        className="flex items-center gap-1.5 mb-4 font-mono text-[11px] uppercase tracking-wide"
        style={{ color: "var(--color-stone)" }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>All Leads</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        {myLeads.length} in {viewer}'s book, ranked — {activeCount} active, {bookedCount} already booked.
      </p>

      {/* Desktop: dense excel-style table, same fields the real sheet tracks */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[1040px]">
          <div
            className="grid grid-cols-[1.9fr_0.85fr_0.9fr_0.65fr_1.4fr_0.75fr_1fr_0.55fr_0.8fr_20px] px-5 py-2.5 mb-2 font-mono text-[10px] uppercase tracking-wider"
            style={{ color: "var(--color-stone)" }}
          >
            <span>Lead</span><span>Event</span><span>Guests / Rooms</span><span>Value</span><span>Source</span><span>Stage</span><span>AI Match</span><span>Score</span><span>Last Touch</span><span />
          </div>

          <div className="flex flex-col gap-2.5">
            {myLeads.map((l, i) => {
              const stale = l.days >= 5 && l.stage !== "booked";
              return (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                  whileHover={{ x: 4 }}
                  onClick={() => openLead(l)}
                  className="grid grid-cols-[1.9fr_0.85fr_0.9fr_0.65fr_1.4fr_0.75fr_1fr_0.55fr_0.8fr_20px] items-center gap-y-2 rounded-2xl px-5 py-3.5 text-left"
                  style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={l.initials} source={l.source} size={36} />
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] truncate" style={{ color: "var(--color-ink)" }}>{l.name}</div>
                      <div className="font-mono text-[10px] mt-0.5 truncate" style={{ color: "var(--color-stone)" }}>{l.phone}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <EventBadge eventType={l.eventType} />
                    <span className="text-[10.5px] truncate" style={{ color: "var(--color-stone)" }}>{l.eventDate || "—"}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-[12px]" style={{ color: "var(--color-ink)" }}>{l.guests ? `${l.guests} pax` : "—"}</div>
                    <div className="text-[10.5px] truncate mt-0.5" style={{ color: "var(--color-stone)" }}>{roomsRequirement(l.guests)}</div>
                  </div>

                  <span className="text-[12px]" style={{ color: "var(--color-ink)" }}>{formatINR(l.value)}</span>

                  <div><SourceTag source={l.source} /></div>

                  <span className="text-[12px]" style={{ color: l.followupStep >= 4 ? "var(--color-rose)" : "var(--color-stone)" }}>
                    {stageLabel(l)}
                  </span>

                  <div className="min-w-0">
                    {l.aiProfile ? (
                      <span
                        className="inline-block text-[10.5px] leading-snug rounded-lg px-2 py-1"
                        style={{ background: "var(--color-ivory-soft)", color: "var(--color-gold-deep)" }}
                      >
                        {l.aiProfile.persona}
                      </span>
                    ) : (
                      <span className="text-[11px]" style={{ color: "var(--color-stone)" }}>—</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <ScoreRing score={l.score} size={36} strokeWidth={3} />
                  </div>

                  <LastTouch days={l.days} stale={stale} />

                  <ChevronRight size={16} className="justify-self-end" style={{ color: "var(--color-stone)" }} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: stacked detail cards — same fields, no horizontal scroll */}
      <div className="md:hidden flex flex-col gap-3">
        {myLeads.map((l, i) => {
          const stale = l.days >= 5 && l.stage !== "booked";
          return (
            <motion.button
              key={l.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
              onClick={() => openLead(l)}
              className="text-left rounded-2xl p-4"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar initials={l.initials} source={l.source} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[14px] truncate" style={{ color: "var(--color-ink)" }}>{l.name}</div>
                  <div className="font-mono text-[10.5px] mt-0.5" style={{ color: "var(--color-stone)" }}>{l.phone}</div>
                </div>
                <ScoreRing score={l.score} size={34} strokeWidth={3} />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                <SourceTag source={l.source} />
                <EventBadge eventType={l.eventType} />
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 rounded-xl p-3 mb-3" style={{ background: "var(--color-ivory-soft)" }}>
                <Field label="Stage" value={stageLabel(l)} />
                <Field label="Event Date" value={l.eventDate || "—"} />
                <Field label="Guests" value={l.guests ? `${l.guests} pax` : "—"} />
                <Field label="Rooms" value={roomsRequirement(l.guests)} />
                <Field label="Value" value={formatINR(l.value)} />
                <Field label="Last Touch" value={l.days === 0 ? "Today" : `${l.days}d ago`} />
              </div>

              {l.aiProfile && (
                <div className="flex items-start gap-1.5 rounded-xl px-3 py-2 mb-2" style={{ background: "rgba(201,162,39,0.08)" }}>
                  <span className="font-serif text-[12px] shrink-0" style={{ color: "var(--color-gold-deep)" }}>{l.aiProfile.persona}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                {stale ? (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: "var(--color-rose)" }}>
                    <span className="relative flex items-center justify-center" style={{ width: 6, height: 6 }}>
                      <span className="absolute inline-flex rounded-full opacity-60" style={{ width: 6, height: 6, background: "var(--color-rose)" }} />
                      <span className="pulse-ring absolute rounded-full" style={{ width: 6, height: 6, color: "var(--color-rose)" }} />
                    </span>
                    Needs a follow-up
                  </span>
                ) : <span />}
                <ChevronRight size={16} style={{ color: "var(--color-stone)" }} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
