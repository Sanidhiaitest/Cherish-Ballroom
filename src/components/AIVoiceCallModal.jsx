import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Bot, ArrowRightCircle } from "lucide-react";
import Avatar from "./Avatar";
import { AI_CALLER_NUMBER, leadOwner } from "../data/leads";

const DEFAULT_SCRIPT = [
  { from: "ai", text: "Namaste! Main Cherish Ballrooms ki taraf se bol rahi hoon. Kal aapne Solitaire Hall dekha tha — kaisa laga?" },
  { from: "lead", text: "Bahut achha tha, hall toh perfect hai." },
  { from: "ai", text: "Wonderful! Kya aap is week tasting date finalize karna chahenge?" },
  { from: "lead", text: "Haan, mujhe interest hai but abhi budget thoda tight hai." },
  { from: "ai", text: "Samajh sakti hoon. Main Kritika ko is call ka summary bhej rahi hoon — woh aapko best package options ke saath khud call karengi." },
];

const DEFAULT_OUTCOME = "Hesitation on budget detected — routed to Kritika directly instead of firing another nudge.";

function Waveform({ active }) {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="rounded-full"
          style={{ width: 3, background: "var(--color-gold)" }}
          animate={active ? { height: [6, 6 + ((i * 37) % 26), 6] } : { height: 6 }}
          transition={{ duration: 0.6 + (i % 5) * 0.08, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function AIVoiceCallModal({ lead, script = DEFAULT_SCRIPT, outcome = DEFAULT_OUTCOME, onClose }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState("dialing");

  useEffect(() => {
    if (!lead) return;
    setPhase("dialing");
    setVisibleLines(0);
    const dial = setTimeout(() => setPhase("talking"), 1400);
    return () => clearTimeout(dial);
  }, [lead]);

  useEffect(() => {
    if (phase !== "talking") return;
    if (visibleLines >= script.length) {
      const done = setTimeout(() => setPhase("complete"), 700);
      return () => clearTimeout(done);
    }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 1500);
    return () => clearTimeout(t);
  }, [phase, visibleLines, script.length]);

  return (
    <AnimatePresence>
      {lead && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          style={{ background: "rgba(20,17,15,0.72)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[420px] max-h-[88vh] overflow-y-auto rounded-3xl"
            style={{ background: "linear-gradient(175deg, var(--color-ink) 0%, #1c1712 100%)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
              <div className="flex items-center justify-center rounded-full w-11 h-11 shrink-0" style={{ background: "rgba(201,162,39,0.14)", border: "1px solid rgba(201,162,39,0.3)" }}>
                <Bot size={19} color="var(--color-gold-soft)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-gold-soft)" }}>
                  AI Voice Follow-up · Hindi/Hinglish
                </div>
                <div className="font-serif text-[16px] mt-0.5" style={{ color: "var(--color-paper)" }}>
                  {phase === "dialing" ? "Dialing…" : phase === "complete" ? "Call complete" : "In progress"}
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-white/10">
                <X size={17} color="var(--color-stone)" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-6 pb-1">
              <Avatar initials={lead.initials} source={lead.source} size={34} />
              <div className="font-body text-[13px]" style={{ color: "var(--color-ivory)" }}>{lead.name}</div>
              <div className="ml-auto font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>{lead.phone}</div>
            </div>
            <div className="px-6 pb-3 font-mono text-[9.5px]" style={{ color: "var(--color-stone)" }}>
              Calling from {AI_CALLER_NUMBER} — the Cherish line. Guest hears: "{leadOwner(lead)} calling from Cherish."
            </div>

            <div className="px-6"><Waveform active={phase === "talking"} /></div>

            <div className="px-6 py-5 flex flex-col gap-3 min-h-[210px]">
              {script.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${line.from === "ai" ? "self-start" : "self-end"}`}
                  style={{
                    background: line.from === "ai" ? "rgba(201,162,39,0.14)" : "rgba(255,255,255,0.06)",
                    color: "var(--color-ivory)",
                    border: `1px solid ${line.from === "ai" ? "rgba(201,162,39,0.28)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-gold-soft)" }}>
                    {line.from === "ai" ? "AI Agent" : lead.name.split(" ")[0]}
                  </span>
                  {line.text}
                </motion.div>
              ))}

              {phase === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-2xl px-4 py-3 mt-1"
                  style={{ background: "rgba(178,58,72,0.14)", border: "1px solid rgba(178,58,72,0.32)" }}
                >
                  <ArrowRightCircle size={15} className="shrink-0 mt-0.5" color="var(--color-rose-soft)" />
                  <div className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-ivory)" }}>{outcome}</div>
                </motion.div>
              )}
            </div>

            <div className="text-center font-body text-[10px] pb-4" style={{ color: "var(--color-stone)" }}>
              Simulated preview · placed 24–48h after the site visit
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
