import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, MessageCircle, Bot, CheckCircle2, Circle, PhoneCall, ListFilter, FileSpreadsheet, Hourglass, AlertCircle, Send, Pencil, Check } from "lucide-react";
import {
  LEADS, NURTURE_STEPS, AI_CALL_LOG, AI_CALLER_NUMBER, DATA_INTAKE_TODAY, medianResponseSeconds,
  fmtSeconds, queuedForAICall, triageToday, leadOwner, OPEN_QUESTION_WHATSAPP_VOICE, nurtureDraft,
} from "../../data/leads";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

export default function AutomationView({ openLead, onAIVoiceCall, viewer = "Aman" }) {
  const [nurtureEditing, setNurtureEditing] = useState(false);
  const [nurtureSent, setNurtureSent] = useState(false);
  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer);
  const median = medianResponseSeconds();
  const fastestReplies = myLeads.filter((l) => l.firstResponseSeconds).sort((a, b) => a.firstResponseSeconds - b.firstResponseSeconds);
  const dmExample = fastestReplies[0];
  const nurtureLead = myLeads.find((l) => l.nurtureStep !== undefined) || myLeads[0];
  const queued = queuedForAICall().filter((l) => leadOwner(l) === viewer);
  const myCallLog = AI_CALL_LOG.filter((e) => {
    const l = LEADS.find((lead) => lead.name === e.leadName);
    return l && leadOwner(l) === viewer;
  });
  const triageAll = triageToday();
  const triage = { ...triageAll, green: triageAll.green.filter((l) => leadOwner(l) === viewer), yellow: triageAll.yellow.filter((l) => leadOwner(l) === viewer) };
  const draft = nurtureDraft(nurtureLead);
  const [draftText, setDraftText] = useState(draft?.text || "");

  return (
    <div>
      <h1 className="font-serif text-[27px] mb-5" style={{ color: "var(--color-ink)" }}>Cherish Copilot</h1>

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
              Median first response, all channels
            </div>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2" style={{ background: "rgba(178,58,72,0.18)", border: "1px solid rgba(178,58,72,0.35)" }}>
              <span className="font-mono text-[11px]" style={{ color: "var(--color-rose-soft)" }}>Delhi banquet average: 11–47 hrs</span>
            </div>
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2" style={{ background: "rgba(201,162,39,0.14)", border: "1px solid rgba(201,162,39,0.3)" }}>
              <span className="font-mono text-[11px]" style={{ color: "var(--color-gold-soft)" }}>5 min vs 30 min reply → 21x odds (MIT)</span>
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
            Right folder + profile, sent the moment a lead lands — matched to function type, no manual searching.
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
            Every query gets a light before it hits the queue — not rejection, triage.
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
          className="rounded-2xl p-6 lg:col-span-2"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <MessageCircle size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Post-Visit Nurture Sequence</div>
            <PhaseBadge phase={2} />
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            5-touch sequence drafts itself when a walkthrough ends — one-tap send today, automatic once the business line is live.
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
        <p className="font-body text-[12px] mb-2" style={{ color: "var(--color-stone)" }}>
          Hindi/Hinglish voice, cloned per owner, calls 24–48h after the walkthrough. Hesitation routes to a human.
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5" style={{ background: "rgba(255,255,255,0.05)" }}>
          <PhoneCall size={10} style={{ color: "var(--color-gold-soft)" }} />
          <span className="font-mono text-[9.5px]" style={{ color: "var(--color-stone)" }}>Always from {AI_CALLER_NUMBER} — never a personal number</span>
        </div>

        <div className="flex items-center gap-6 mb-4 pb-4 flex-wrap" style={{ borderBottom: "1px solid var(--color-ink-line)" }}>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-paper)" }}>{myCallLog.length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Called</div>
          </div>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-gold-soft)" }}>{myCallLog.filter((e) => e.tone !== "positive").length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Routed to a human</div>
          </div>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-emerald-soft)" }}>{queued.length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Queued, not yet called</div>
          </div>
          {myCallLog.length > 0 && (
            <div>
              <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-paper)" }}>
                {(() => {
                  const secs = myCallLog.map((e) => { const [m, s] = (e.duration || "0:00").split(":").map(Number); return m * 60 + s; });
                  const avg = Math.round(secs.reduce((a, b) => a + b, 0) / secs.length);
                  return `${Math.floor(avg / 60)}:${String(avg % 60).padStart(2, "0")}`;
                })()}
              </div>
              <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Avg call duration</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-wider mb-2" style={{ color: "var(--color-stone)" }}>What happened</div>
            <div className="flex flex-col gap-2">
              {myCallLog.map((entry) => {
                const callLead = LEADS.find((l) => l.name === entry.leadName);
                if (!callLead) return null;
                const positive = entry.tone === "positive";
                const sentimentColor = { positive: "var(--color-emerald-soft)", neutral: "var(--color-stone)", negative: "var(--color-rose-soft)" }[entry.sentiment];
                const sentimentBg = { positive: "rgba(61,120,99,0.18)", neutral: "rgba(255,255,255,0.06)", negative: "rgba(178,58,72,0.18)" }[entry.sentiment];
                return (
                  <button
                    key={entry.leadName}
                    onClick={() => onAIVoiceCall(callLead, entry.script, entry.outcomeDetail, entry.transfer)}
                    className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left"
                    style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${positive ? "rgba(31,77,61,0.4)" : "rgba(201,162,39,0.25)"}` }}
                  >
                    <Avatar initials={callLead.initials} source={callLead.source} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12px]" style={{ color: "var(--color-paper)" }}>{callLead.name}</div>
                      <div className="font-body text-[10.5px] truncate" style={{ color: positive ? "var(--color-emerald-soft)" : "var(--color-gold-soft)" }}>{entry.outcomeLabel}</div>
                    </div>
                    {entry.duration && (
                      <span className="font-mono text-[9.5px] shrink-0" style={{ color: "var(--color-stone)" }}>{entry.duration}</span>
                    )}
                    {entry.sentiment && (
                      <span className="font-mono text-[8px] uppercase tracking-wide rounded-full px-1.5 py-0.5 shrink-0" style={{ background: sentimentBg, color: sentimentColor }}>
                        {entry.sentiment}
                      </span>
                    )}
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
    </div>
  );
}
