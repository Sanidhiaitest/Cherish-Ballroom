import { Fragment } from "react";
import { motion } from "framer-motion";
import { Zap, MessageCircle, Bot, Users2, ArrowUpRight, CheckCircle2, Circle, Globe2, PhoneCall, ChefHat, Check, X as XIcon } from "lucide-react";
import { LEADS, NURTURE_STEPS, AI_CALL_LOG, COMPETITIVE_CHECKLIST, AI_CALLER_NUMBER, medianResponseSeconds, partnerMarginSummary, formatINR } from "../../data/leads";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

function fmtSeconds(s) {
  if (s < 60) return `${s} sec`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`;
}

export default function AutomationView({ openLead, setView, onAIVoiceCall, onOpenVirtualTour }) {
  const median = medianResponseSeconds();
  const fastestReplies = LEADS.filter((l) => l.firstResponseSeconds).sort((a, b) => a.firstResponseSeconds - b.firstResponseSeconds);
  const dmExample = fastestReplies[0];
  const nurtureLead = LEADS.find((l) => l.nurtureStep !== undefined) || LEADS[0];
  const margin = partnerMarginSummary();

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Cherish Copilot</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        The venue that responds first wins the booking — what's already live, and what's proposed to run alongside Aman and Harman next.
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
              Median first response across every inbound channel — ads, aggregators, walk-ins
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
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Instant First Reply</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Every ad click and aggregator inquiry gets a reply drafted in seconds — date, guest count, budget, function type surfaced for whoever picks it up next.
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
          <div className="flex items-center gap-2 mb-1.5">
            <MessageCircle size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Post-Visit Nurture Sequence</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Answers "ghar wapis aana ya nahi" — a five-touch sequence drafts itself the moment a walkthrough ends, queued for one-tap send from Aman or Harman's WhatsApp today, fully automatic once the business line is confirmed.
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
          <div className="flex items-center gap-2 mb-1.5">
            <Bot size={15} style={{ color: "var(--color-gold-soft)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-paper)" }}>AI Voice Follow-up — Call Log</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-1.5" style={{ color: "var(--color-stone)" }}>
            A Hindi/Hinglish voice, cloned to whichever of Aman or Harman the lead belongs to, calls 24–48h after the walkthrough. Simple, positive calls close themselves — hesitation gets routed to a human.
          </p>
          <p className="font-body text-[10.5px] mb-4" style={{ color: "var(--color-stone)" }}>
            Every call goes out from the Cherish business line ({AI_CALLER_NUMBER}) — never Aman's or Harman's personal number.
          </p>
          <div className="flex flex-col gap-2">
            {AI_CALL_LOG.map((entry) => {
              const callLead = LEADS.find((l) => l.name === entry.leadName);
              if (!callLead) return null;
              const positive = entry.tone === "positive";
              return (
                <button
                  key={entry.leadName}
                  onClick={() => onAIVoiceCall(callLead, entry.script, entry.outcomeDetail)}
                  className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${positive ? "rgba(31,77,61,0.4)" : "rgba(201,162,39,0.25)"}` }}
                >
                  <Avatar initials={callLead.initials} source={callLead.source} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[12px]" style={{ color: "var(--color-paper)" }}>{callLead.name}</div>
                    <div className="font-body text-[10.5px] truncate" style={{ color: positive ? "var(--color-emerald-soft)" : "var(--color-gold-soft)" }}>{entry.outcomeLabel}</div>
                  </div>
                  <PhoneCall size={13} style={{ color: "var(--color-stone)" }} />
                </button>
              );
            })}
          </div>
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
              <div className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>All other channels · net per lead</div>
              <div className="font-serif text-[19px] mt-1" style={{ color: "var(--color-emerald)" }}>{formatINR(margin.directNetPerLead)}</div>
              <div className="font-mono text-[10px] mt-1" style={{ color: "var(--color-stone)" }}>{margin.directCount} leads, ads + WedMeGood + walk-in</div>
            </div>
          </div>
          <button onClick={() => setView("referral")} className="flex items-center gap-1.5 mt-4 font-mono text-[11px] uppercase tracking-wide" style={{ color: "var(--color-gold-deep)" }}>
            See the referral channel <ArrowUpRight size={12} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: "linear-gradient(150deg, #3a2410, var(--color-ink))" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <ChefHat size={15} style={{ color: "var(--color-gold-soft)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-paper)" }}>Virtual Kitchen Tour & Menu Concierge</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            The kitchen is the actual differentiator — most venues only show halls. This travels to a lead's phone before the in-person tasting.
          </p>
          <button
            onClick={onOpenVirtualTour}
            className="w-full flex items-center gap-3 rounded-2xl p-4 text-left"
            style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.28)" }}
          >
            <div className="flex items-center justify-center rounded-xl w-9 h-9 shrink-0" style={{ background: "rgba(201,162,39,0.2)" }}>
              <ChefHat size={16} style={{ color: "var(--color-gold-soft)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[12.5px]" style={{ color: "var(--color-paper)" }}>360° preview + sample menu Q&A</div>
              <div className="font-body text-[11px]" style={{ color: "var(--color-stone)" }}>Preview what a lead receives</div>
            </div>
            <ArrowUpRight size={14} style={{ color: "var(--color-gold-soft)" }} />
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <div className="flex items-center justify-center rounded-2xl w-14 h-14 shrink-0" style={{ background: "rgba(31,77,61,0.1)" }}>
          <Globe2 size={22} style={{ color: "var(--color-emerald)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>The Dubai Benchmark</div>
            <span className="font-mono text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ background: "var(--color-ivory)", color: "var(--color-stone)" }}>Industry context</span>
          </div>
          <p className="font-body text-[12.5px] leading-relaxed mb-3" style={{ color: "var(--color-ink)" }}>
            <strong>70–80% of Middle East luxury hotels</strong> already run WhatsApp-native AI concierges tied into their CRM — Jumeirah uses AI-driven campaigns to send dining experiences to food-lovers specifically, not blanket offers. This isn't experimental technology anymore; it's table stakes at the top end of hospitality.
          </p>
          <div className="flex items-start gap-2 rounded-xl px-3.5 py-3" style={{ background: "var(--color-ivory)" }}>
            <Zap size={13} className="shrink-0 mt-0.5" style={{ color: "var(--color-gold-deep)" }} />
            <span className="font-body text-[12px] italic leading-relaxed" style={{ color: "var(--color-ink)" }}>
              "Innovation should amplify high-touch moments, not replace them." Every automation on this page exists to protect the walkthrough and the tasting — the two moments Cherish actually wins on.
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-6"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Where Delhi Stands Today</div>
          <span className="font-mono text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ background: "var(--color-ivory)", color: "var(--color-stone)" }}>Competitive audit</span>
        </div>
        <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
          Every premium Delhi peer audited still runs on personal WhatsApp and manual forms.
        </p>
        <div className="grid grid-cols-[1fr_70px_100px] gap-y-2.5 items-center">
          <span className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }} />
          <span className="font-mono text-[9.5px] uppercase text-center" style={{ color: "var(--color-gold-deep)" }}>Cherish</span>
          <span className="font-mono text-[9.5px] uppercase text-center" style={{ color: "var(--color-stone)" }}>Other Venues</span>
          {COMPETITIVE_CHECKLIST.map((item) => (
            <Fragment key={item}>
              <span className="font-body text-[12px]" style={{ color: "var(--color-ink)" }}>{item}</span>
              <span className="flex justify-center">
                <Check size={15} style={{ color: "var(--color-emerald)" }} />
              </span>
              <span className="flex justify-center">
                <XIcon size={13} style={{ color: "var(--color-stone)" }} />
              </span>
            </Fragment>
          ))}
        </div>
      </motion.div>
      </div>
    </div>
  );
}
