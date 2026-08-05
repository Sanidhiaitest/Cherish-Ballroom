import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { Zap, MessageCircle, Bot, Users2, ArrowUpRight, CheckCircle2, Circle, Globe2, PhoneCall, ChefHat, Check, X as XIcon, ShieldCheck, ListFilter, FileSpreadsheet, Hourglass, Mic, CalendarClock, AlertCircle, Send, Pencil, ShieldQuestion } from "lucide-react";
import {
  LEADS, NURTURE_STEPS, AI_CALL_LOG, COMPETITIVE_CHECKLIST, AI_CALLER_NUMBER, DATA_INTAKE_TODAY, medianResponseSeconds,
  partnerMarginSummary, formatINR, queuedForAICall, triageToday, leadOwner, VOICE_NOTE_FALLBACK_EXAMPLE,
  PRE_VISIT_PRIMER_EXAMPLE, OPEN_QUESTION_WHATSAPP_VOICE, nurtureDraft, GUARDRAILS,
} from "../../data/leads";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

function fmtSeconds(s) {
  if (s < 60) return `${s} sec`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`;
}

export default function AutomationView({ openLead, setView, onAIVoiceCall, onOpenVirtualTour }) {
  const [nurtureEditing, setNurtureEditing] = useState(false);
  const [nurtureSent, setNurtureSent] = useState(false);
  const median = medianResponseSeconds();
  const fastestReplies = LEADS.filter((l) => l.firstResponseSeconds).sort((a, b) => a.firstResponseSeconds - b.firstResponseSeconds);
  const dmExample = fastestReplies[0];
  const nurtureLead = LEADS.find((l) => l.nurtureStep !== undefined) || LEADS[0];
  const margin = partnerMarginSummary();
  const queued = queuedForAICall();
  const triage = triageToday();
  const draft = nurtureDraft(nurtureLead);
  const [draftText, setDraftText] = useState(draft?.text || "");

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Cherish Copilot</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-4" style={{ color: "var(--color-stone)" }}>
        The venue that responds first wins the booking — what's already live, and what's proposed to run alongside Aman and Harman next.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2.5 rounded-2xl px-4 py-3 mb-5"
        style={{ background: "rgba(31,77,61,0.07)", border: "1px solid rgba(31,77,61,0.22)" }}
      >
        <ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: "var(--color-emerald)" }} />
        <span className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          Everything below feeds Aman and Harman — the negotiation, the tasting, the close stay theirs. And it's fully reversible: any of it can be switched off, anytime you say so. The goal isn't fewer of you — it's each of you working 10 leads a day instead of 3, same person, not more hours.
        </span>
      </motion.div>

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
            <div className="font-mono text-[10.5px] mt-2" style={{ color: "var(--color-gold-soft)" }}>
              A 2:00pm lead gets a first touch by 2:02pm — not whenever someone's free between calls.
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2" style={{ background: "rgba(178,58,72,0.18)", border: "1px solid rgba(178,58,72,0.35)" }}>
              <span className="font-mono text-[11px]" style={{ color: "var(--color-rose-soft)" }}>Delhi banquet average: 11–47 hours</span>
            </div>
            <div className="font-body text-[11px] leading-relaxed" style={{ color: "var(--color-stone)" }}>
              Two people are absorbing 15–25 leads a day on Instagram alone — 8–10 hours of someone's day is just calling. This is what buys that time back.
            </div>
            <div className="font-body text-[11px] leading-relaxed" style={{ color: "var(--color-stone)" }}>
              MIT/InsideSales: replying within 5 min vs 30 min drops your odds of qualifying a lead by 21x. Being fast costs nothing — almost no one does it.
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl px-5 py-4 mb-5"
        style={{ background: "var(--color-paper)", border: "1px dashed var(--color-stone-line)" }}
      >
        <div className="flex items-center justify-center rounded-xl w-9 h-9 shrink-0" style={{ background: "rgba(201,162,39,0.12)" }}>
          <FileSpreadsheet size={16} style={{ color: "var(--color-gold-deep)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-serif text-[14px]" style={{ color: "var(--color-ink)" }}>Data intake</span>
            <PhaseBadge phase={2} />
          </div>
          <div className="font-body text-[11.5px] leading-relaxed" style={{ color: "var(--color-stone)" }}>
            <span style={{ color: "var(--color-rose)" }}>Today:</span> {DATA_INTAKE_TODAY.today}
          </div>
          <div className="font-body text-[11.5px] leading-relaxed mt-0.5" style={{ color: "var(--color-stone)" }}>
            <span style={{ color: "var(--color-emerald)" }}>Proposed:</span> {DATA_INTAKE_TODAY.proposed}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-2.5 rounded-2xl px-4 py-3 mb-5"
        style={{ background: "rgba(178,58,72,0.06)", border: "1px solid rgba(178,58,72,0.2)" }}
      >
        <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-rose)" }} />
        <span className="font-body text-[11.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          <span className="font-mono text-[9.5px] uppercase tracking-wider mr-1.5" style={{ color: "var(--color-rose)" }}>Open question:</span>
          {OPEN_QUESTION_WHATSAPP_VOICE}
        </span>
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
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>First Touch — Profile + Video Folder</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Today someone manually picks from the curated folders (cocktail, haldi, mehendi, reception, baby shower, birthday) and sends a reel by hand. This sends the right folder plus the company profile the moment a lead lands — matched to function type, no searching.
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
          transition={{ delay: 0.12 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <ListFilter size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Qualification Screen</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            "If 5 queries come in, this filters it to the 3 that are actually yours to work" — Aman's own framing. Not a rejection system, a triage: every query gets a light before it hits the queue.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-emerald)" }} />
              <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--color-stone)" }}>Green — call today ({triage.green.length})</span>
            </div>
            {triage.green.map((l) => (
              <button key={l.id} onClick={() => openLead(l)} className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left" style={{ background: "rgba(31,77,61,0.06)" }}>
                <span className="text-[12px] font-medium" style={{ color: "var(--color-ink)" }}>{l.name}</span>
                <span className="ml-auto font-mono text-[10.5px]" style={{ color: "var(--color-emerald)" }}>{l.score}</span>
              </button>
            ))}
            {triage.yellow.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-1 mt-1">
                  <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-gold-deep)" }} />
                  <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--color-stone)" }}>Yellow — worth a look ({triage.yellow.length})</span>
                </div>
                {triage.yellow.map((l) => (
                  <button key={l.id} onClick={() => openLead(l)} className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left" style={{ background: "rgba(201,162,39,0.08)" }}>
                    <span className="text-[12px] font-medium" style={{ color: "var(--color-ink)" }}>{l.name}</span>
                    <span className="ml-auto font-mono text-[10.5px]" style={{ color: "var(--color-gold-deep)" }}>{l.score}</span>
                  </button>
                ))}
              </>
            )}
            <div className="flex items-center gap-2 mb-1 mt-1">
              <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-stone)" }} />
              <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--color-stone)" }}>Red — auto-handled, never reaches you ({triage.red.length})</span>
            </div>
            {triage.red.map((r, i) => (
              <div key={i} className="font-body text-[11px] leading-relaxed rounded-xl px-3 py-2" style={{ background: "var(--color-ivory)", color: "var(--color-stone)" }}>
                {r.note}
              </div>
            ))}
          </div>
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
          </button>
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

          {draft && (
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-stone-line)" }}>
              <div className="font-mono text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "var(--color-gold-deep)" }}>
                Drafted, not sent — "{draft.label}"
              </div>
              {nurtureSent ? (
                <div className="flex items-center gap-1.5 font-body text-[11.5px]" style={{ color: "var(--color-emerald)" }}>
                  <Check size={12} /> Sent — it was already written, just hit send.
                </div>
              ) : (
                <>
                  {nurtureEditing ? (
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl px-3 py-2 text-[11.5px] outline-none resize-none"
                      style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                    />
                  ) : (
                    <p className="font-body text-[11.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>{draftText}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setNurtureSent(true)} className="flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-[10.5px]" style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}>
                      <Send size={10} /> Approve &amp; send
                    </button>
                    <button onClick={() => setNurtureEditing((v) => !v)} className="flex items-center gap-1.5 rounded-full px-3 py-1 font-medium text-[10.5px]" style={{ border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}>
                      <Pencil size={10} /> {nurtureEditing ? "Done" : "Edit"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Mic size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Voice-Note Fallback</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-3" style={{ color: "var(--color-stone)" }}>
            For calls that happen the old way — no brief, no prep. The recording (with consent) gets transcribed so nothing said out loud gets lost.
          </p>
          <div className="rounded-xl px-3.5 py-2.5 mb-2" style={{ background: "var(--color-ivory)" }}>
            <div className="font-body text-[11.5px] italic leading-relaxed" style={{ color: "var(--color-ink)" }}>{VOICE_NOTE_FALLBACK_EXAMPLE.raw}</div>
          </div>
          <div className="flex flex-col gap-1">
            {VOICE_NOTE_FALLBACK_EXAMPLE.extracted.map((f, i) => (
              <div key={i} className="flex items-center justify-between font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>
                <span className="uppercase">{f.field}</span>
                <span style={{ color: "var(--color-ink)" }}>{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <CalendarClock size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Pre-Visit Primer</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-3" style={{ color: "var(--color-stone)" }}>
            A day before a confirmed visit, this goes out automatically — small, but it's the polish that reinforces premium without costing anyone time.
          </p>
          <div className="rounded-xl px-3.5 py-2.5" style={{ background: "var(--color-ivory)" }}>
            <div className="font-body text-[11.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>{PRE_VISIT_PRIMER_EXAMPLE.message}</div>
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="rounded-2xl p-6 mt-5"
        style={{ background: "var(--color-ink)" }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Bot size={15} style={{ color: "var(--color-gold-soft)" }} />
          <div className="font-serif text-[16px]" style={{ color: "var(--color-paper)" }}>AI Voice Follow-up — Call Log</div>
          <PhaseBadge phase={2} />
        </div>
        <p className="font-body text-[12px] mb-1.5" style={{ color: "var(--color-stone)" }}>
          A Hindi/Hinglish voice, cloned to whichever of Aman or Harman owns that lead's channel, calls 24–48h after the walkthrough. Simple, positive calls close themselves — hesitation gets routed to a human.
        </p>
        <p className="font-body text-[10.5px] mb-5" style={{ color: "var(--color-stone)" }}>
          Every call goes out from the Cherish business line ({AI_CALLER_NUMBER}) — never Aman's or Harman's personal number. Your cell number stays yours; the Cherish number is what absorbs the cold outreach. Once a lead is warm, handoff can stay on the Cherish number or move to a direct line — your choice, lead by lead.
        </p>

        <div className="flex items-center gap-6 mb-4 pb-4" style={{ borderBottom: "1px solid var(--color-ink-line)" }}>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-paper)" }}>{AI_CALL_LOG.length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Called</div>
          </div>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-gold-soft)" }}>{AI_CALL_LOG.filter((e) => e.tone !== "positive").length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Routed to a human</div>
          </div>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-emerald-soft)" }}>{queued.length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Queued, not yet called</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-wider mb-2" style={{ color: "var(--color-stone)" }}>What happened</div>
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
                    <span className="font-mono text-[9px] uppercase shrink-0" style={{ color: "var(--color-stone)" }}>{leadOwner(callLead)}'s voice</span>
                    <PhoneCall size={13} style={{ color: "var(--color-stone)" }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Hourglass size={11} style={{ color: "var(--color-stone)" }} />
              <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--color-stone)" }}>What's not happening yet</span>
            </div>
            {queued.length > 0 ? (
              <div className="flex flex-col gap-2">
                {queued.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => openLead(lead)}
                    className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.14)" }}
                  >
                    <Avatar initials={lead.initials} source={lead.source} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12px]" style={{ color: "var(--color-paper)" }}>{lead.name}</div>
                      <div className="font-body text-[10.5px] truncate" style={{ color: "var(--color-stone)" }}>Visited — eligible, waiting on a call</div>
                    </div>
                    <span className="font-mono text-[9px] uppercase shrink-0" style={{ color: "var(--color-stone)" }}>{leadOwner(lead)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-stone)" }}>
                Everyone past their walkthrough has already been called.
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-6 mt-5"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldQuestion size={15} style={{ color: "var(--color-gold-deep)" }} />
          <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Before you ask</div>
          <span className="font-mono text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ background: "var(--color-ivory)", color: "var(--color-stone)" }}>Guardrails</span>
        </div>
        <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
          The questions any of this deserves, answered up front rather than after something goes wrong.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUARDRAILS.map((g, i) => (
            <div key={i} className="rounded-xl px-3.5 py-3" style={{ background: "var(--color-ivory)" }}>
              <div className="font-mono text-[9.5px] uppercase tracking-wider mb-1" style={{ color: "var(--color-gold-deep)" }}>{g.title}</div>
              <div className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-ink)" }}>{g.note}</div>
            </div>
          ))}
        </div>
      </motion.div>

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
