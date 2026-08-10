import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet, Bell, MessageCircle, PhoneCall, Bot, Check, CheckCheck,
  ArrowRightCircle, CalendarCheck, Play, RotateCcw, ChevronRight, Sparkles,
} from "lucide-react";
import { SHEET_LEADS } from "../../data/sheetLeads";
import { AI_CALLER_NUMBER } from "../../data/leads";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

const STEPS = [
  { id: "landing", label: "New row", Icon: FileSpreadsheet },
  { id: "notified", label: "Notified", Icon: Bell },
  { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { id: "calling", label: "AI Call", Icon: PhoneCall },
  { id: "done", label: "Booked in", Icon: CalendarCheck },
];

function buildLeadRecord(lead) {
  return {
    id: `flow-${lead.id}-${Date.now()}`,
    name: lead.name,
    initials: lead.initials,
    source: "sheet",
    ownerOverride: lead.owner,
    stage: lead.positive ? "visit_scheduled" : "query",
    score: lead.positive ? 68 : 45,
    days: 0,
    phone: lead.phone,
    ref: null,
    hall: "—",
    guests: lead.guestsMid,
    value: 0,
    thread: [
      { t: "Just now", type: "dm", e: `New row in the Followup Sheet — ${lead.eventTypeLabel}, ${lead.guestsLabel}, tentatively ${lead.dateLabel}.` },
      { t: "Just now", type: "ai", e: `Auto-reply sent on WhatsApp: "${lead.whatsapp.ack}"` },
      { t: "Just now", type: lead.positive ? "visit" : "alert", e: lead.outcome },
    ],
  };
}

function Waveform({ active }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.span
          key={i}
          className="rounded-full"
          style={{ width: 3, background: "var(--color-gold)" }}
          animate={active ? { height: [6, 6 + ((i * 37) % 20), 6] } : { height: 6 }}
          transition={{ duration: 0.6 + (i % 5) * 0.08, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function LeadFlowView({ openLead, onLeadBooked }) {
  const [selectedId, setSelectedId] = useState(SHEET_LEADS[0].id);
  const [phase, setPhase] = useState("idle");
  const [waMessages, setWaMessages] = useState([]);
  const [waTyping, setWaTyping] = useState(false);
  const [callLines, setCallLines] = useState(0);
  const [callPhase, setCallPhase] = useState("dialing");
  const [builtLeads, setBuiltLeads] = useState({});
  const addedRef = useRef(new Set());

  const lead = SHEET_LEADS.find((l) => l.id === selectedId);
  const contextRows = SHEET_LEADS.filter((l) => l.id !== selectedId).slice(0, 4);
  const record = builtLeads[lead.id];

  function selectLead(id) {
    setSelectedId(id);
    setPhase("idle");
    setWaMessages([]);
    setCallLines(0);
    setCallPhase("dialing");
  }

  useEffect(() => {
    if (phase !== "landing") return;
    const t = setTimeout(() => setPhase("notified"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "notified") return;
    const t = setTimeout(() => setPhase("whatsapp"), 1300);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "whatsapp" || !lead) return;
    setWaMessages([]);
    setWaTyping(false);
    const t1 = setTimeout(() => setWaMessages([{ from: "me", text: lead.whatsapp.ack, seen: false }]), 300);
    const t2 = setTimeout(() => {
      setWaMessages((m) => m.map((x) => ({ ...x, seen: true })));
      setWaTyping(true);
    }, 1500);
    const t3 = setTimeout(() => {
      setWaTyping(false);
      setWaMessages((m) => [...m, { from: "them", text: lead.whatsapp.reply, seen: true }]);
    }, 2800);
    const t4 = setTimeout(() => setPhase("calling"), 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [phase, lead]);

  useEffect(() => {
    if (phase !== "calling") return;
    setCallPhase("dialing");
    setCallLines(0);
    const t = setTimeout(() => setCallPhase("talking"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "calling" || callPhase !== "talking" || !lead) return;
    if (callLines >= lead.callScript.length) {
      const next = lead.transfer ? "transferring" : "complete";
      const t = setTimeout(() => setCallPhase(next), lead.transfer ? 800 : 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCallLines((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [phase, callPhase, callLines, lead]);

  useEffect(() => {
    if (phase !== "calling" || callPhase !== "transferring") return;
    const t = setTimeout(() => setCallPhase("complete"), 2000);
    return () => clearTimeout(t);
  }, [phase, callPhase]);

  useEffect(() => {
    if (phase !== "calling" || callPhase !== "complete") return;
    const t = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(t);
  }, [phase, callPhase]);

  useEffect(() => {
    if (phase !== "done" || !lead) return;
    if (addedRef.current.has(lead.id)) return;
    addedRef.current.add(lead.id);
    const rec = buildLeadRecord(lead);
    onLeadBooked(rec);
    setBuiltLeads((m) => ({ ...m, [lead.id]: rec }));
  }, [phase, lead, onLeadBooked]);

  const stepIndex = STEPS.findIndex((s) => s.id === phase);

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>New Lead → Message → Call</h1>
        <PhaseBadge phase={2} size="md" />
      </div>
      <p className="font-body text-[13.5px] mb-6 max-w-2xl" style={{ color: "var(--color-stone)" }}>
        Straight from the Followup Sheet export (Aug 7) — 14 real enquiries, still waiting on a first reply. Pick one and watch
        the whole path: the row landing, the team getting notified, the WhatsApp acknowledgment, and the AI call that follows.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {SHEET_LEADS.map((l) => {
          const active = l.id === selectedId;
          const isDone = !!builtLeads[l.id];
          return (
            <button
              key={l.id}
              onClick={() => selectLead(l.id)}
              className="shrink-0 flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors"
              style={{
                background: active ? "var(--color-ink)" : "var(--color-paper)",
                border: `1px solid ${active ? "var(--color-ink)" : "var(--color-stone-line)"}`,
              }}
            >
              <Avatar initials={l.initials} source="sheet" size={22} />
              <span className="font-body text-[12px] font-medium whitespace-nowrap" style={{ color: active ? "var(--color-paper)" : "var(--color-ink)" }}>
                {l.name}
              </span>
              {isDone && <Check size={12} style={{ color: active ? "var(--color-gold-soft)" : "var(--color-emerald)" }} />}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-6 mb-5" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
        <div className="flex items-center gap-2 mb-3">
          <FileSpreadsheet size={15} style={{ color: "var(--color-gold-deep)" }} />
          <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Followup Sheet — live</div>
        </div>
        <div className="hidden md:grid grid-cols-[1.3fr_1fr_1fr_1.2fr_1fr] px-3 py-1.5 mb-1 font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--color-stone)" }}>
          <span>Event Type</span><span>Guests</span><span>Date</span><span>Full Name</span><span>Phone</span>
        </div>

        <AnimatePresence mode="wait">
          {phase === "idle" ? (
            <motion.button
              key="waiting"
              onClick={() => setPhase("landing")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-4 mb-2"
              style={{ border: "1px dashed var(--color-stone-line)", color: "var(--color-gold-deep)" }}
            >
              <Play size={14} /> <span className="font-body text-[12.5px] font-medium">Simulate {lead.name.split(" ")[0]}'s row landing</span>
            </motion.button>
          ) : (
            <motion.div
              key="landed"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1.2fr_1fr] gap-y-1.5 items-center rounded-xl px-3 py-3 mb-2"
              style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.35)" }}
            >
              <span className="col-span-2 md:col-span-1 font-body text-[12.5px] font-medium" style={{ color: "var(--color-ink)" }}>{lead.eventTypeLabel}</span>
              <span className="font-body text-[12px]" style={{ color: "var(--color-ink)" }}>{lead.guestsLabel}</span>
              <span className="font-body text-[12px]" style={{ color: "var(--color-ink)" }}>{lead.dateLabel}</span>
              <span className="flex items-center gap-2 font-body text-[12.5px] font-medium" style={{ color: "var(--color-ink)" }}>
                <Avatar initials={lead.initials} source="sheet" size={22} />
                {lead.name}
              </span>
              <span className="font-mono text-[11px]" style={{ color: "var(--color-stone)" }}>{lead.phone}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {contextRows.map((r) => (
          <div key={r.id} className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1.2fr_1fr] gap-y-1 items-center px-3 py-2 opacity-55">
            <span className="col-span-2 md:col-span-1 font-body text-[12px]" style={{ color: "var(--color-stone)" }}>{r.eventTypeLabel}</span>
            <span className="font-body text-[11.5px]" style={{ color: "var(--color-stone)" }}>{r.guestsLabel}</span>
            <span className="font-body text-[11.5px]" style={{ color: "var(--color-stone)" }}>{r.dateLabel}</span>
            <span className="font-body text-[12px]" style={{ color: "var(--color-stone)" }}>{r.name}</span>
            <span className="font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>{r.phone}</span>
          </div>
        ))}
      </div>

      {phase !== "idle" && (
        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.Icon;
            const active = i === stepIndex;
            const done = i < stepIndex || phase === "done";
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{
                    background: active ? "var(--color-ink)" : done ? "rgba(31,77,61,0.1)" : "var(--color-ivory)",
                    color: active ? "var(--color-gold-soft)" : done ? "var(--color-emerald)" : "var(--color-stone)",
                  }}
                >
                  <Icon size={12} />
                  <span className="font-mono text-[9.5px] uppercase tracking-wide whitespace-nowrap">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={12} style={{ color: "var(--color-stone-line)" }} />}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnimatePresence>
          {(phase === "notified" || (stepIndex >= 1)) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5"
              style={{ background: "var(--color-ink)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bell size={14} style={{ color: "var(--color-gold-soft)" }} />
                <span className="font-serif text-[15px]" style={{ color: "var(--color-paper)" }}>Team notified</span>
              </div>
              <p className="font-body text-[12px]" style={{ color: "var(--color-stone)" }}>
                New row detected — auto-assigned to <span style={{ color: "var(--color-gold-soft)" }}>{lead.owner}</span>, no manual retyping.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stepIndex >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden lg:row-span-2"
              style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
            >
              <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: "var(--color-ink)" }}>
                <Avatar initials={lead.initials} source="sheet" size={30} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px] truncate" style={{ color: "var(--color-paper)" }}>{lead.name}</div>
                  <div className="font-mono text-[10px]" style={{ color: "var(--color-gold-soft)" }}>{waTyping ? "typing…" : "online"}</div>
                </div>
                <MessageCircle size={15} style={{ color: "var(--color-gold-soft)" }} />
              </div>
              <div className="flex flex-col gap-2.5 px-4 py-4 min-h-[160px]" style={{ background: "var(--color-ivory)" }}>
                {waMessages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${m.from === "me" ? "self-end" : "self-start"}`}
                    style={{
                      background: m.from === "me" ? "var(--color-gold)" : "var(--color-paper)",
                      color: "var(--color-ink)",
                      border: m.from === "me" ? "none" : "1px solid var(--color-stone-line)",
                    }}
                  >
                    {m.text}
                    {m.from === "me" && (
                      <span className="inline-flex ml-1.5 align-middle" style={{ color: m.seen ? "var(--color-emerald)" : "var(--color-stone)" }}>
                        {m.seen ? <CheckCheck size={12} /> : <Check size={12} />}
                      </span>
                    )}
                  </motion.div>
                ))}
                {waTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start rounded-2xl px-3.5 py-2.5" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }} className="rounded-full" style={{ width: 5, height: 5, background: "var(--color-stone)" }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="text-center font-body text-[10px] py-2" style={{ color: "var(--color-stone)", background: "var(--color-paper)" }}>
                Instant acknowledgment · one-tap send today, automatic once the Business API is live
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stepIndex >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5"
              style={{ background: "linear-gradient(175deg, var(--color-ink) 0%, #1c1712 100%)" }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <Bot size={15} style={{ color: "var(--color-gold-soft)" }} />
                <span className="font-serif text-[15px]" style={{ color: "var(--color-paper)" }}>
                  {callPhase === "dialing" ? "Dialing…" : callPhase === "transferring" ? "Transferring…" : callPhase === "complete" ? "Call complete" : "In progress"}
                </span>
              </div>
              <div className="font-mono text-[9.5px] mb-3" style={{ color: "var(--color-stone)" }}>
                From {AI_CALLER_NUMBER} · guest hears "{lead.owner} calling from Cherish" · {lead.phone}
              </div>
              <Waveform active={callPhase === "talking" || callPhase === "transferring"} />
              <div className="flex flex-col gap-2.5 mt-4 min-h-[100px]">
                {lead.callScript.slice(0, callLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${line.from === "ai" ? "self-start" : "self-end"}`}
                    style={{
                      background: line.from === "ai" ? "rgba(201,162,39,0.14)" : "rgba(255,255,255,0.06)",
                      color: "var(--color-ivory)",
                      border: `1px solid ${line.from === "ai" ? "rgba(201,162,39,0.28)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <span className="font-mono text-[8.5px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-gold-soft)" }}>
                      {line.from === "ai" ? "AI Agent" : lead.name.split(" ")[0]}
                    </span>
                    {line.text}
                  </motion.div>
                ))}
                {callPhase === "transferring" && lead.transfer && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 self-center" style={{ background: "rgba(201,162,39,0.12)", border: "1px dashed rgba(201,162,39,0.35)" }}>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }} className="rounded-full shrink-0" style={{ width: 11, height: 11, border: "2px solid var(--color-gold-soft)", borderTopColor: "transparent" }} />
                    <div className="font-body text-[11.5px]" style={{ color: "var(--color-ivory)" }}>{lead.transfer.line}</div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: lead.positive ? "rgba(31,77,61,0.08)" : "rgba(178,58,72,0.08)", border: `1px solid ${lead.positive ? "rgba(31,77,61,0.28)" : "rgba(178,58,72,0.28)"}` }}
            >
              <div className="flex items-center gap-2">
                <ArrowRightCircle size={15} style={{ color: lead.positive ? "var(--color-emerald)" : "var(--color-rose)" }} />
                <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Outcome</span>
              </div>
              <p className="font-body text-[12.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>{lead.outcome}</p>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
                  <Sparkles size={11} style={{ color: "var(--color-gold-deep)" }} />
                  <span className="font-mono text-[10.5px] uppercase tracking-wide" style={{ color: "var(--color-ink)" }}>Now live in the pipeline</span>
                </span>
              </div>
              {record && (
                <button
                  onClick={() => openLead(record)}
                  className="flex items-center justify-center gap-2 rounded-full py-2.5 mt-1 font-semibold text-[12.5px]"
                  style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
                >
                  Open {lead.name.split(" ")[0]}'s thread <ChevronRight size={14} />
                </button>
              )}
              <button
                onClick={() => selectLead(SHEET_LEADS[(SHEET_LEADS.findIndex((l) => l.id === selectedId) + 1) % SHEET_LEADS.length].id)}
                className="flex items-center justify-center gap-2 rounded-full py-2 font-medium text-[12px]"
                style={{ border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
              >
                <RotateCcw size={12} /> Run the next lead
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
