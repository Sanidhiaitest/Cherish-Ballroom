import { AnimatePresence, motion } from "framer-motion";
import { X, Bell, Home, MessageCircle, Calendar, User, ChevronRight } from "lucide-react";
import { STAGES } from "../data/leads";

const FRIENDLY_EVENT_COPY = {
  dm: "We received your message and started your event thread.",
  ai: "We received your message and started your event thread.",
  visit: "Thank you for touring with us — it was wonderful meeting you.",
  quote: "Your quote is in your inbox, whenever you're ready to look.",
  call: "Good speaking with your family today.",
  note: "We shared a few more details for you to look over.",
  alert: "Still here whenever you're ready to pick this back up — no rush.",
};

const FRIENDLY_STAGE_COPY = {
  query: "We've got your message — someone from our team will reach out shortly.",
  visit_scheduled: "Your walkthrough is booked. We can't wait to show you around.",
  visited: "So lovely having you at Cherish. Your quote is being put together.",
  quoted: "Your quote is ready — take your time, we're here for any questions.",
  followup: "Just checking in — we're holding your dates while you decide.",
  booked: "You're booked! Welcome to the Cherish family.",
};

export default function CouplePreviewModal({ lead, onClose }) {
  const stageIdx = lead ? STAGES.findIndex((s) => s.id === lead.stage) : 0;
  const firstName = lead?.name.split(/[\s&]/)[0] || "there";

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
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4 font-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--color-gold-soft)" }}>
              What {lead.name.split(" ")[0]} sees on their phone
            </div>

            <div
              className="relative rounded-[46px] p-3"
              style={{ background: "var(--color-ink)", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)", width: 340 }}
            >
              <button onClick={onClose} className="absolute -top-3 -right-3 rounded-full p-2 z-10" style={{ background: "var(--color-paper)" }}>
                <X size={16} color="var(--color-ink)" />
              </button>

              <div className="rounded-[34px] overflow-hidden" style={{ background: "var(--color-ivory)", height: 660 }}>
                <div className="relative flex items-center justify-center py-2.5" style={{ background: "var(--color-ivory)" }}>
                  <div className="rounded-full" style={{ width: 90, height: 22, background: "var(--color-ink)" }} />
                </div>

                <div className="px-5 pb-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--color-stone)" }}>Welcome back</div>
                    <div className="font-serif text-[19px] mt-0.5" style={{ color: "var(--color-ink)" }}>Hi, {firstName} 👋</div>
                  </div>
                  <button className="flex items-center justify-center rounded-full w-9 h-9" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
                    <Bell size={14} color="var(--color-ink)" />
                  </button>
                </div>

                <div className="mx-5 rounded-3xl p-5" style={{ background: "linear-gradient(135deg, var(--color-ink), #1c2e26)" }}>
                  <div className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--color-gold-soft)" }}>Your event</div>
                  <div className="font-serif text-[18px] mt-1" style={{ color: "var(--color-paper)" }}>
                    {lead.hall !== "—" ? lead.hall : "Hall — to be decided"}
                  </div>
                  {lead.guests > 0 && (
                    <div className="font-body text-[12px] mt-0.5" style={{ color: "var(--color-stone)" }}>{lead.guests} guests</div>
                  )}
                  <div className="font-body text-[12.5px] mt-3 leading-relaxed" style={{ color: "var(--color-ivory)" }}>
                    {FRIENDLY_STAGE_COPY[lead.stage]}
                  </div>
                </div>

                <div className="mx-5 mt-4">
                  <div className="flex items-center justify-between">
                    {STAGES.map((s, i) => (
                      <div key={s.id} className="flex-1 flex flex-col items-center relative">
                        {i > 0 && (
                          <div
                            className="absolute top-[7px] right-1/2 w-full h-[2px]"
                            style={{ background: i <= stageIdx ? "var(--color-gold)" : "var(--color-stone-line)" }}
                          />
                        )}
                        <div
                          className="rounded-full z-10"
                          style={{
                            width: 15, height: 15,
                            background: i <= stageIdx ? "var(--color-gold)" : "var(--color-paper)",
                            border: `2px solid ${i <= stageIdx ? "var(--color-gold)" : "var(--color-stone-line)"}`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-center font-mono text-[10px] uppercase tracking-wider mt-2" style={{ color: "var(--color-gold-deep)" }}>
                    {STAGES[stageIdx]?.label}
                  </div>
                </div>

                <div className="mx-5 mt-5">
                  <div className="font-serif text-[14px] mb-2.5" style={{ color: "var(--color-ink)" }}>Recent updates</div>
                  <div className="flex flex-col gap-2">
                    {lead.thread.slice(-2).map((t, i) => (
                      <div key={i} className="rounded-2xl px-3.5 py-2.5" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
                        <div className="font-mono text-[9px]" style={{ color: "var(--color-stone)" }}>{t.t}</div>
                        <div className="font-body text-[11.5px] mt-1 leading-snug" style={{ color: "var(--color-ink)" }}>
                          {FRIENDLY_EVENT_COPY[t.type] || "Update logged on your event thread."}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mx-5 mt-4">
                  <button className="w-full flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "var(--color-gold)" }}>
                    <span className="flex items-center gap-2 font-semibold text-[12.5px]" style={{ color: "var(--color-ink)" }}>
                      <MessageCircle size={14} /> Message the Cherish team
                    </span>
                    <ChevronRight size={15} color="var(--color-ink)" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-3.5" style={{ background: "var(--color-ink)" }}>
                  {[{ Icon: Home, label: "Home", active: true }, { Icon: Calendar, label: "Timeline" }, { Icon: MessageCircle, label: "Messages" }, { Icon: User, label: "Profile" }].map((it) => (
                    <div key={it.label} className="flex flex-col items-center gap-1">
                      <it.Icon size={16} color={it.active ? "var(--color-gold-soft)" : "var(--color-stone)"} />
                      <span className="font-mono text-[8px]" style={{ color: it.active ? "var(--color-paper)" : "var(--color-stone)" }}>{it.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 max-w-[300px] text-center font-body text-[11.5px]" style={{ color: "var(--color-stone)" }}>
              Same thread, mirrored back to the couple — a lightweight teaser of the couple-facing app in the roadmap.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
