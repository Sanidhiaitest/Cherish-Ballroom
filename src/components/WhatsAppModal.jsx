import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Check, CheckCheck } from "lucide-react";
import Avatar from "./Avatar";

const AUTO_REPLIES = [
  "Thank you, noted! Will revert shortly.",
  "That works for us, thanks for confirming.",
  "Got it — appreciate the quick reply.",
  "Perfect, see you then.",
];

function seedThread(lead) {
  const last = lead.thread[lead.thread.length - 1];
  return [
    { from: "them", text: `Hi! Following up on ${lead.hall !== "—" ? lead.hall : "our conversation"} — just wanted to check in.`, seen: true },
    { from: "me", text: last?.e?.split(".")[0] + "." || "Thanks for reaching out — let me pull that up for you.", seen: true },
  ];
}

export default function WhatsAppModal({ lead, onClose }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const seeded = useMemo(() => (lead ? seedThread(lead) : []), [lead]);

  useEffect(() => {
    if (lead) setMessages(seeded);
  }, [lead, seeded]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "me", text: draft.trim(), seen: false }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => m.map((msg) => ({ ...msg, seen: true })));
      setTimeout(() => {
        setTyping(false);
        const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
        setMessages((m) => [...m, { from: "them", text: reply, seen: true }]);
      }, 1100);
    }, 500);
  }

  return (
    <AnimatePresence>
      {lead && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          style={{ background: "rgba(20,17,15,0.7)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="w-full max-w-[400px] h-[600px] max-h-[85vh] rounded-3xl flex flex-col overflow-hidden"
            style={{ background: "var(--color-paper)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4" style={{ background: "var(--color-ink)" }}>
              <Avatar initials={lead.initials} source={lead.source} size={38} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] truncate" style={{ color: "var(--color-paper)" }}>{lead.name}</div>
                <div className="font-mono text-[10.5px]" style={{ color: "var(--color-gold-soft)" }}>
                  {typing ? "typing…" : "online"}
                </div>
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-white/10">
                <X size={17} color="var(--color-stone)" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5" style={{ background: "var(--color-ivory)" }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.from === "me" ? "self-end" : "self-start"}`}
                  style={{
                    background: m.from === "me" ? "var(--color-gold)" : "var(--color-paper)",
                    color: m.from === "me" ? "var(--color-ink)" : "var(--color-ink)",
                    border: m.from === "me" ? "none" : "1px solid var(--color-stone-line)",
                    borderBottomRightRadius: m.from === "me" ? 4 : 16,
                    borderBottomLeftRadius: m.from === "me" ? 16 : 4,
                  }}
                >
                  {m.text}
                  {m.from === "me" && (
                    <span className="inline-flex ml-1.5 align-middle" style={{ color: m.seen ? "var(--color-emerald)" : "var(--color-stone)" }}>
                      {m.seen ? <CheckCheck size={13} /> : <Check size={13} />}
                    </span>
                  )}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="self-start rounded-2xl px-4 py-2.5"
                  style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }}
                        className="rounded-full"
                        style={{ width: 5, height: 5, background: "var(--color-stone)" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-3.5" style={{ background: "var(--color-paper)", borderTop: "1px solid var(--color-stone-line)" }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Message…"
                className="flex-1 rounded-full px-4 py-2.5 text-[13px] outline-none"
                style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
              />
              <button
                onClick={send}
                className="flex items-center justify-center rounded-full w-10 h-10 shrink-0"
                style={{ background: "var(--color-gold)" }}
              >
                <Send size={15} color="var(--color-ink)" />
              </button>
            </div>
            <div className="text-center font-body text-[10px] pb-2.5" style={{ color: "var(--color-stone)", background: "var(--color-paper)" }}>
              Simulated chat preview · wires in with WhatsApp Business API
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
