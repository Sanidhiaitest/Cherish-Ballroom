import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, CheckCircle2 } from "lucide-react";
import { buildProposal, formatINR, STAGES } from "../data/leads";

export default function ProposalModal({ lead, onClose }) {
  const proposal = lead ? buildProposal(lead) : null;
  const signed = lead?.stage === "booked";

  return (
    <AnimatePresence>
      {lead && proposal && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          style={{ background: "rgba(20,17,15,0.6)", backdropFilter: "blur(2px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[480px] max-h-[88vh] overflow-y-auto rounded-3xl p-8"
            style={{ background: "var(--color-paper)", boxShadow: "0 30px 80px -20px rgba(20,17,15,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-gold-deep)" }}>
                <FileText size={12} /> Banquet Event Order · Proposal
              </div>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5">
                <X size={18} style={{ color: "var(--color-stone)" }} />
              </button>
            </div>
            <h2 className="font-serif text-[24px] mt-2" style={{ color: "var(--color-ink)" }}>{lead.name}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 font-body text-[12px]" style={{ color: "var(--color-stone)" }}>
              <span>{lead.hall}</span>
              <span>{lead.guests} guests</span>
              <span>Stage: {STAGES.find((s) => s.id === lead.stage)?.label}</span>
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-stone-line)" }}>
              {proposal.lineItems.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-stone-line)", background: i % 2 ? "var(--color-ivory)" : "transparent" }}
                >
                  <div>
                    <div className="font-body text-[13px] font-medium" style={{ color: "var(--color-ink)" }}>{item.label}</div>
                    <div className="font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>{item.sub}</div>
                  </div>
                  <div className="font-mono text-[13px]" style={{ color: "var(--color-ink)" }}>{formatINR(item.amount)}</div>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3.5" style={{ background: "var(--color-ink)" }}>
                <div className="font-serif text-[14px]" style={{ color: "var(--color-paper)" }}>Total estimate</div>
                <div className="font-mono text-[15px] font-bold" style={{ color: "var(--color-gold-soft)" }}>{formatINR(proposal.total)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-2xl p-3.5 text-center" style={{ border: "1px solid var(--color-stone-line)" }}>
                <div className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>Deposit (25%)</div>
                <div className="font-serif text-[16px] mt-1" style={{ color: "var(--color-emerald)" }}>{formatINR(proposal.deposit)}</div>
              </div>
              <div className="rounded-2xl p-3.5 text-center" style={{ border: "1px solid var(--color-stone-line)" }}>
                <div className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>Balance due</div>
                <div className="font-serif text-[16px] mt-1" style={{ color: "var(--color-ink)" }}>{formatINR(proposal.balance)}</div>
              </div>
            </div>

            <div
              className="flex items-center gap-2.5 mt-5 rounded-2xl px-4 py-3"
              style={{
                background: signed ? "rgba(31,77,61,0.1)" : "var(--color-ivory)",
                border: `1px solid ${signed ? "rgba(31,77,61,0.28)" : "var(--color-stone-line)"}`,
              }}
            >
              {signed ? (
                <CheckCircle2 size={16} color="var(--color-emerald)" />
              ) : (
                <div className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-gold)" }} />
              )}
              <div className="font-body text-[12px]" style={{ color: "var(--color-ink)" }}>
                {signed ? "Deposit received, contract signed." : "Awaiting signature — proposal auto-tracked since first inquiry, no lead lost to an email thread."}
              </div>
            </div>

            <div className="text-center font-body text-[10.5px] mt-4" style={{ color: "var(--color-stone)" }}>
              Sample BEO/proposal layout — the Tripleseat-style document every lead gets automatically.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
