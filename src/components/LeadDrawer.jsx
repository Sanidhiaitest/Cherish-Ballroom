import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, MessageCircle, Sparkles, MapPin, FileText, StickyNote, AlertTriangle, PhoneCall, Smartphone } from "lucide-react";
import { STAGES, scoreTone, formatINR } from "../data/leads";
import SourceTag from "./SourceTag";
import Avatar from "./Avatar";
import ScoreRing from "./ScoreRing";

const TYPE_ICON = {
  dm: MessageCircle,
  ai: Sparkles,
  visit: MapPin,
  quote: FileText,
  call: PhoneCall,
  note: StickyNote,
  alert: AlertTriangle,
};

export default function LeadDrawer({ lead, onClose, onCall, onWhatsApp, onPreviewCouple }) {
  return (
    <AnimatePresence>
      {lead && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ background: "rgba(20,17,15,0.55)", backdropFilter: "blur(2px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full sm:w-[440px] h-full overflow-y-auto px-7 py-8"
            style={{ background: "var(--color-paper)", boxShadow: "-24px 0 60px -20px rgba(20,17,15,0.35)" }}
            initial={{ x: 460 }}
            animate={{ x: 0 }}
            exit={{ x: 460 }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="float-right rounded-full p-1.5 transition-colors hover:bg-black/5">
              <X size={19} style={{ color: "var(--color-stone)" }} />
            </button>

            <div className="flex items-center gap-3.5 mb-1 pt-1">
              <Avatar initials={lead.initials} source={lead.source} size={52} />
              <div>
                <SourceTag source={lead.source} />
                <h2 className="font-serif text-[22px] mt-1 leading-tight" style={{ color: "var(--color-ink)" }}>{lead.name}</h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 font-body text-[12px]" style={{ color: "var(--color-stone)" }}>
              <span>{lead.phone}</span>
              {lead.hall !== "—" && <span>{lead.hall} · {lead.guests} pax</span>}
              {lead.ref && <span>Referred by {lead.ref}</span>}
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-5 mb-5">
              <div className="rounded-2xl py-3 flex flex-col items-center justify-center" style={{ border: "1px solid var(--color-stone-line)" }}>
                <ScoreRing score={lead.score} size={40} strokeWidth={3} />
                <div className="font-mono text-[9.5px] mt-1.5 uppercase" style={{ color: "var(--color-stone)" }}>
                  {scoreTone(lead.score).label}
                </div>
              </div>
              <div className="rounded-2xl py-3 px-1 flex flex-col items-center justify-center text-center" style={{ border: "1px solid var(--color-stone-line)" }}>
                <div className="font-serif text-[15px] leading-tight" style={{ color: "var(--color-ink)" }}>
                  {STAGES.find((s) => s.id === lead.stage)?.label}
                </div>
                <div className="font-mono text-[9.5px] mt-2 uppercase" style={{ color: "var(--color-stone)" }}>Stage</div>
              </div>
              <div className="rounded-2xl py-3 px-1 flex flex-col items-center justify-center text-center" style={{ border: "1px solid var(--color-stone-line)" }}>
                <div className="font-serif text-[15px] leading-tight" style={{ color: "var(--color-gold-deep)" }}>{formatINR(lead.value)}</div>
                <div className="font-mono text-[9.5px] mt-2 uppercase" style={{ color: "var(--color-stone)" }}>Est. value</div>
              </div>
            </div>

            <div className="flex gap-2.5 mb-3">
              <motion.button
                onClick={() => onCall?.(lead)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 font-semibold text-[13px]"
                style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
              >
                <Phone size={13.5} /> Call Now
              </motion.button>
              <motion.button
                onClick={() => onWhatsApp?.(lead)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 font-semibold text-[13px]"
                style={{ background: "transparent", color: "var(--color-ink)", border: "1.5px solid var(--color-ink)" }}
              >
                <MessageCircle size={13.5} /> WhatsApp
              </motion.button>
            </div>
            <button
              onClick={() => onPreviewCouple?.(lead)}
              className="w-full flex items-center justify-center gap-2 rounded-full py-2 mb-7 font-medium text-[12px] transition-colors hover:bg-black/5"
              style={{ color: "var(--color-stone)" }}
            >
              <Smartphone size={12.5} /> See what {lead.name.split(" ")[0]} sees on their phone
            </button>

            <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-stone)" }}>
              One Thread, Every Touchpoint
            </div>
            <div className="relative flex flex-col gap-5 pl-1">
              <div className="absolute left-[13px] top-1 bottom-1 w-[2px]" style={{ background: "linear-gradient(var(--color-gold), var(--color-stone-line))" }} />
              {lead.thread.map((t, i) => {
                const Icon = TYPE_ICON[t.type] || StickyNote;
                const isAlert = t.type === "alert";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="relative pl-9"
                  >
                    <div
                      className="absolute left-0 top-0 flex items-center justify-center rounded-full"
                      style={{
                        width: 27, height: 27,
                        background: isAlert ? "var(--color-rose)" : "var(--color-paper)",
                        border: `2px solid ${isAlert ? "var(--color-rose)" : "var(--color-gold)"}`,
                      }}
                    >
                      <Icon size={12} color={isAlert ? "var(--color-paper)" : "var(--color-gold-deep)"} />
                    </div>
                    <div className="font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>{t.t}</div>
                    <div className="font-body text-[13px] mt-1 leading-relaxed" style={{ color: "var(--color-ink)" }}>{t.e}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
