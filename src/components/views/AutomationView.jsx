import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Zap, MessageCircle, Bot, Users2, ArrowUpRight, CheckCircle2, Circle, Globe2, PhoneCall, ChefHat, Check, X as XIcon, ShieldCheck, ListFilter, FileSpreadsheet, Hourglass, Mic, CalendarClock, AlertCircle, Send, Pencil, ShieldQuestion, HeartHandshake } from "lucide-react";
import {
  LEADS, STAGES, NURTURE_STEPS, AI_CALL_LOG, COMPETITIVE_CHECKLIST, AI_CALLER_NUMBER, DATA_INTAKE_TODAY, medianResponseSeconds,
  partnerMarginSummary, formatINR, queuedForAICall, triageToday, leadOwner, VOICE_NOTE_FALLBACK_EXAMPLE,
  PRE_VISIT_PRIMER_EXAMPLE, OPEN_QUESTION_WHATSAPP_VOICE, nurtureDraft, GUARDRAILS,
} from "../../data/leads";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

function fmtSeconds(s) {
  if (s < 60) return `${s} sec`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`;
}

const REF_VB_W = 760;
const REF_VB_H = 380;
const REF_ROOT_X = 110;
const REF_CHILD_X = [560, 590];

function useReferralGraph() {
  return useMemo(() => {
    const roots = LEADS.filter((l) => l.rootFamily);
    const byRoot = Object.fromEntries(roots.map((r) => [r.name, LEADS.filter((l) => l.ref === r.name)]));
    const bandH = REF_VB_H / roots.length;
    const nodes = [];
    const edges = [];
    roots.forEach((root, i) => {
      const bandTop = i * bandH;
      const rootY = bandTop + bandH / 2;
      nodes.push({ ...root, x: REF_ROOT_X, y: rootY });
      const kids = byRoot[root.name] || [];
      kids.forEach((kid, ki) => {
        const pad = bandH * 0.2;
        const usable = bandH - pad * 2;
        const y = kids.length === 1 ? rootY : bandTop + pad + (usable * ki) / (kids.length - 1);
        const kidNode = { ...kid, x: REF_CHILD_X[ki % 2], y };
        nodes.push(kidNode);
        edges.push({ id: kid.id, parentName: root.name, x1: REF_ROOT_X, y1: rootY, x2: kidNode.x, y2: y });
      });
    });
    return { nodes, edges, roots };
  }, []);
}

export default function AutomationView({ openLead, onAIVoiceCall, onOpenVirtualTour, viewer = "Aman" }) {
  const [nurtureEditing, setNurtureEditing] = useState(false);
  const [nurtureSent, setNurtureSent] = useState(false);
  const [refHover, setRefHover] = useState(null);
  const { nodes: refNodes, edges: refEdges, roots: refRoots } = useReferralGraph();
  const refTotalReferred = refNodes.length - refRoots.length;
  const refBooked = refNodes.filter((n) => n.stage === "booked").length;
  const anniversaryLead = LEADS.find((l) => l.anniversary);
  const pastReferrals = anniversaryLead ? LEADS.filter((l) => l.ref === anniversaryLead.name) : [];
  const isRefDimmed = (n) => {
    if (!refHover) return false;
    if (n.name === refHover) return false;
    if (n.ref === refHover) return false;
    return true;
  };
  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer);
  const median = medianResponseSeconds();
  const fastestReplies = myLeads.filter((l) => l.firstResponseSeconds).sort((a, b) => a.firstResponseSeconds - b.firstResponseSeconds);
  const dmExample = fastestReplies[0];
  const nurtureLead = myLeads.find((l) => l.nurtureStep !== undefined) || myLeads[0];
  const margin = partnerMarginSummary();
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
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Cherish Copilot</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-4" style={{ color: "var(--color-stone)" }}>
        Live today, and what's next — built alongside Aman and Harman.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-5"
        style={{ background: "rgba(31,77,61,0.07)", border: "1px solid rgba(31,77,61,0.22)" }}
      >
        <ShieldCheck size={15} className="shrink-0" style={{ color: "var(--color-emerald)" }} />
        <span className="font-body text-[12px]" style={{ color: "var(--color-ink)" }}>
          Negotiation, tasting, close — stay yours. Reversible anytime. 10 leads/day instead of 3, same people.
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
          className="rounded-2xl p-6"
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
            Old-way calls, no brief — recorded (with consent) and transcribed so nothing's lost.
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
            Sent automatically, a day before every confirmed visit.
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
            Event-co. leads carry a ~50% cut — tracked so spend shifts to what nets more.
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
          <button
            onClick={() => document.getElementById("referral-web")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="flex items-center gap-1.5 mt-4 font-mono text-[11px] uppercase tracking-wide"
            style={{ color: "var(--color-gold-deep)" }}
          >
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
            Most venues only show halls. This reaches a lead's phone before the tasting.
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
        id="referral-web"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="rounded-2xl p-6 mt-5"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <HeartHandshake size={15} style={{ color: "var(--color-gold-deep)" }} />
          <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Referral Web</div>
        </div>
        <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
          {refRoots.length} root families · {refTotalReferred} referred · {refBooked} booked — the channel Event Co. leads cost you 50% to buy.
        </p>

        <div className="rounded-3xl p-6 md:p-8" style={{ background: "linear-gradient(160deg, var(--color-ink) 0%, #1a1512 100%)" }}>
          <svg width="100%" height="420" viewBox={`0 0 ${REF_VB_W} ${REF_VB_H}`}>
            <defs>
              <linearGradient id="thread" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.75" />
              </linearGradient>
              <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {refEdges.map((e, i) => {
              const dimmed = refHover && refHover !== e.id && refHover !== e.parentName;
              return (
                <motion.path
                  key={e.id}
                  d={`M ${e.x1} ${e.y1} C ${(e.x1 + e.x2) / 2} ${e.y1}, ${(e.x1 + e.x2) / 2} ${e.y2}, ${e.x2} ${e.y2}`}
                  stroke="url(#thread)"
                  strokeWidth={dimmed ? 1 : 1.8}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: dimmed ? 0.25 : 1 }}
                  transition={{ pathLength: { duration: 1, delay: i * 0.12, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
                />
              );
            })}

            {refNodes.map((n, i) => {
              const dimmed = isRefDimmed(n);
              const status = n.milestone || STAGES.find((s) => s.id === n.stage)?.label || n.stage;
              return (
                <motion.g
                  key={n.id}
                  style={{ x: n.x, y: n.y, cursor: "pointer" }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                  onMouseEnter={() => setRefHover(n.rootFamily ? n.name : n.ref)}
                  onMouseLeave={() => setRefHover(null)}
                  onClick={() => openLead(n)}
                >
                  {n.rootFamily && <circle r={18} fill="url(#rootGlow)" />}
                  <circle
                    r={n.rootFamily ? 8 : 5.5}
                    fill={n.rootFamily ? "var(--color-gold)" : "var(--color-paper)"}
                    stroke={n.rootFamily ? "var(--color-gold-soft)" : "var(--color-stone)"}
                    strokeWidth="1.2"
                  />
                  <text x={n.rootFamily ? 15 : 11} y={4} fontFamily="Inter" fontSize="12.5" fontWeight={n.rootFamily ? 700 : 500} fill="var(--color-paper)">
                    {n.name}
                  </text>
                  <text x={n.rootFamily ? 15 : 11} y={18} fontFamily="JetBrains Mono" fontSize="9.5" fill="var(--color-stone)">
                    {status}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap gap-5 mt-5 font-body text-[12px]" style={{ color: "var(--color-stone)" }}>
          <span className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 9, height: 9, background: "var(--color-gold)" }} />
            Root family (originated the chain)
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 9, height: 9, border: "1.5px solid var(--color-stone)", background: "var(--color-paper)" }} />
            Referred lead — hover to trace, click to open
          </span>
        </div>

        {anniversaryLead && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => openLead(anniversaryLead)}
            className="w-full mt-5 rounded-2xl p-5 text-left flex items-start gap-4"
            style={{ background: "var(--color-ivory)", border: "1.5px dashed var(--color-stone-line)" }}
          >
            <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ background: "rgba(201,162,39,0.12)" }}>
              <HeartHandshake size={17} style={{ color: "var(--color-gold-deep)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Avatar initials={anniversaryLead.initials} source={anniversaryLead.source} size={22} />
                <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>{anniversaryLead.name} — {anniversaryLead.anniversary.label}</span>
                <PhaseBadge phase={2} />
              </div>
              <div className="font-body text-[12.5px] mt-1.5" style={{ color: "var(--color-stone)" }}>
                {anniversaryLead.anniversary.when} — reconnection note, not a pitch. {pastReferrals.length > 0
                  ? `Already referred ${pastReferrals[0].name}.`
                  : "Where referrals start — worth a personal line."}
              </div>
              <div className="flex items-center gap-1.5 mt-2 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: "var(--color-gold-deep)" }}>
                Open thread <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.button>
        )}
      </motion.div>

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
          Answered up front, before something goes wrong.
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
          <p className="font-body text-[12.5px] mb-3" style={{ color: "var(--color-ink)" }}>
            <strong>70–80% of Middle East luxury hotels</strong> already run WhatsApp-native AI concierges. Table stakes, not experimental.
          </p>
          <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={{ background: "var(--color-ivory)" }}>
            <Zap size={13} className="shrink-0" style={{ color: "var(--color-gold-deep)" }} />
            <span className="font-body text-[12px] italic" style={{ color: "var(--color-ink)" }}>
              Amplifies the walkthrough and tasting — doesn't replace them.
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
