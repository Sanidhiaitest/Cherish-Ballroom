import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from "lucide-react";
import Avatar from "./Avatar";

function useElapsed(running) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return s;
}

function fmt(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
}

export default function CallModal({ lead, onClose }) {
  const [phase, setPhase] = useState("ringing");
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const elapsed = useElapsed(phase === "connected");

  useEffect(() => {
    if (!lead) return;
    setPhase("ringing");
    const t = setTimeout(() => setPhase("connected"), 1900);
    return () => clearTimeout(t);
  }, [lead]);

  return (
    <AnimatePresence>
      {lead && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          style={{ background: "rgba(20,17,15,0.7)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="w-[300px] rounded-[32px] px-6 py-9 flex flex-col items-center text-center"
            style={{ background: "linear-gradient(175deg, var(--color-ink) 0%, #1c1712 100%)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
          >
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] mb-1" style={{ color: "var(--color-gold-soft)" }}>
              {phase === "ringing" ? "Calling…" : "Connected"}
            </div>

            <motion.div
              animate={phase === "ringing" ? { scale: [1, 1.06, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.3 }}
              className="my-5"
            >
              <Avatar initials={lead.initials} source={lead.source} size={84} />
            </motion.div>

            <div className="font-serif text-[21px]" style={{ color: "var(--color-paper)" }}>{lead.name}</div>
            <div className="font-mono text-[12.5px] mt-1.5" style={{ color: "var(--color-stone)" }}>
              {phase === "ringing" ? lead.phone : fmt(elapsed)}
            </div>

            <div className="flex items-center gap-4 mt-9">
              <button
                onClick={() => setMuted((m) => !m)}
                className="flex items-center justify-center rounded-full w-12 h-12 transition-colors"
                style={{ background: muted ? "var(--color-gold)" : "rgba(255,255,255,0.08)" }}
              >
                {muted ? <MicOff size={18} color={muted ? "var(--color-ink)" : "var(--color-paper)"} /> : <Mic size={18} color="var(--color-paper)" />}
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-full w-14 h-14"
                style={{ background: "var(--color-rose)" }}
              >
                <PhoneOff size={20} color="var(--color-paper)" />
              </button>
              <button
                onClick={() => setSpeaker((s) => !s)}
                className="flex items-center justify-center rounded-full w-12 h-12 transition-colors"
                style={{ background: speaker ? "var(--color-gold)" : "rgba(255,255,255,0.08)" }}
              >
                {speaker ? <Volume2 size={18} color="var(--color-ink)" /> : <VolumeX size={18} color="var(--color-paper)" />}
              </button>
            </div>

            <div className="font-body text-[10.5px] mt-8" style={{ color: "var(--color-stone)" }}>
              Simulated call preview · live dialing wires in with your telephony provider
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
