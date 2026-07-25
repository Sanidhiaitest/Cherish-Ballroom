import { motion } from "framer-motion";
import { Zap, MessageCircle, Bot, Users2, ArrowUpRight, CheckCircle2, Circle } from "lucide-react";
import { LEADS, NURTURE_STEPS, medianResponseSeconds, partnerMarginSummary, formatINR } from "../../data/leads";
import Avatar from "../Avatar";

function fmtSeconds(s) {
  if (s < 60) return `${s} sec`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`;
}

export default function AutomationView({ openLead, setView, onAIVoiceCall }) {
  const median = medianResponseSeconds();
  const fastestReplies = LEADS.filter((l) => l.firstResponseSeconds).sort((a, b) => a.firstResponseSeconds - b.firstResponseSeconds);
  const dmExample = fastestReplies[0];
  const nurtureLead = LEADS.find((l) => l.nurtureStep !== undefined) || LEADS[0];
  const voiceLead = LEADS.find((l) => l.name === "Ishaan & Priya");
  const margin = partnerMarginSummary();

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Automation Engine</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        The venue that responds first wins the booking — here's what runs while nobody's watching.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl px-7 py-8 md:px-9 md:py-10 mb-5"
        style={{ background: "linear-gradient(120deg, var(--color-ink) 0%, #241a12 60%, var(--color-gold-deep) 160%)" }}
      >
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: "var(--color-gold-soft)" }}>
              Speed to lead · this week
            </div>
            <div className="font-serif text-[52px] mt-2 leading-none" style={{ color: "var(--color-paper)" }}>
              {fmtSeconds(median)}
            </div>
            <div className="font-body text-[13px] mt-2" style={{ color: "var(--color-ivory)" }}>
              Median first response across Instagram &amp; WhatsApp inquiries
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2" style={{ background: "rgba(178,58,72,0.18)", border: "1px solid rgba(178,58,72,0.35)" }}>
              <span className="font-mono text-[11px]" style={{ color: "var(--color-rose-soft)" }}>Delhi banquet average: 11–47 hours</span>
            </div>
            <div className="font-body text-[11px] leading-relaxed" style={{ color: "var(--color-stone)" }}>
              MIT/InsideSales: replying within 5 min vs 30 min drops your odds of qualifying a lead by 21x. Being fast costs nothing — almost no one does it.
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Instant AI Response</div>
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Every Instagram DM and ad click gets qualified — date, guest count, budget, function type — before a human ever sees it.
          </p>
          {dmExample && (
            <button onClick={() => openLead(dmExample)} className="w-full flex flex-col gap-2 rounded-2xl p-4 text-left" style={{ background: "var(--color-ivory)" }}>
              <div className="flex items-center gap-2">
                <Avatar initials={dmExample.initials} source={dmExample.source} size={26} />
                <span className="font-semibold text-[12.5px]" style={{ color: "var(--color-ink)" }}>{dmExample.name}</span>
                <span className="ml-auto font-mono text-[11px] font-bold" style={{ color: "var(--color-emerald)" }}>{fmtSeconds(dmExample.firstResponseSeconds)}</span>
              </div>
              <div className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
                {dmExample.thread[0].e}
              </div>
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Post-Visit Nurture Sequence</div>
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Answers "ghar wapis aana ya nahi" automatically — a five-touch sequence fires the moment a walkthrough ends.
          </p>
          <button onClick={() => openLead(nurtureLead)} className="w-full text-left">
            <div className="font-body text-[12px] mb-3" style={{ color: "var(--color-ink)" }}>
              <span className="font-semibold">{nurtureLead.name}</span> — {nurtureLead.days === 0 ? "visited today" : `visited ${nurtureLead.days}d ago`}
            </div>
            <div className="flex flex-col gap-2">
              {NURTURE_STEPS.map((step, i) => {
                const done = i < (nurtureLead.nurtureStep ?? -1);
                const current = i === (nurtureLead.nurtureStep ?? -1);
                return (
                  <div key={step.id} className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2 size={15} style={{ color: "var(--color-emerald)" }} />
                    ) : (
                      <Circle size={15} style={{ color: current ? "var(--color-gold-deep)" : "var(--color-stone-line)" }} />
                    )}
                    <span className="font-body text-[12px]" style={{ color: current ? "var(--color-ink)" : "var(--color-stone)", fontWeight: current ? 600 : 400 }}>
                      {step.label}
                    </span>
                    <span className="ml-auto font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>{step.channel}</span>
                  </div>
                );
              })}
            </div>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-ink)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Bot size={15} style={{ color: "var(--color-gold-soft)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-paper)" }}>AI Voice Follow-up</div>
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            A Hindi/Hinglish voice agent calls 24–48h after the walkthrough — and hands hesitant leads straight to Kritika instead of another automated nudge.
          </p>
          {voiceLead && (
            <button
              onClick={() => onAIVoiceCall(voiceLead)}
              className="w-full flex items-center gap-3 rounded-2xl p-4 text-left"
              style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.25)" }}
            >
              <Avatar initials={voiceLead.initials} source={voiceLead.source} size={30} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[12.5px]" style={{ color: "var(--color-paper)" }}>{voiceLead.name}</div>
                <div className="font-body text-[11px]" style={{ color: "var(--color-stone)" }}>Play sample call</div>
              </div>
              <ArrowUpRight size={14} style={{ color: "var(--color-gold-soft)" }} />
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Users2 size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Partner Margin Tracker</div>
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Event-company leads carry a ~50% commission — tracked separately so spend can shift toward the channel that actually nets more.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3.5" style={{ background: "var(--color-ivory)" }}>
              <div className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>Event Co. · net per lead</div>
              <div className="font-serif text-[19px] mt-1" style={{ color: "var(--color-rose)" }}>{formatINR(margin.eventcoNetPerLead)}</div>
              <div className="font-mono text-[10px] mt-1" style={{ color: "var(--color-stone)" }}>{margin.eventcoCount} leads, after 50% cut</div>
            </div>
            <div className="rounded-2xl p-3.5" style={{ background: "var(--color-ivory)" }}>
              <div className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>Direct · net per lead</div>
              <div className="font-serif text-[19px] mt-1" style={{ color: "var(--color-emerald)" }}>{formatINR(margin.directNetPerLead)}</div>
              <div className="font-mono text-[10px] mt-1" style={{ color: "var(--color-stone)" }}>{margin.directCount} leads, Instagram + reference</div>
            </div>
          </div>
          <button onClick={() => setView("referral")} className="flex items-center gap-1.5 mt-4 font-mono text-[11px] uppercase tracking-wide" style={{ color: "var(--color-gold-deep)" }}>
            See the referral channel <ArrowUpRight size={12} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
