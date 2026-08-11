import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, PlusCircle, Camera, Check } from "lucide-react";
import { SOURCE_META } from "../data/leads";

const HALLS = ["Emerald Hall", "Rubicon Hall", "Pearl Hall", "Solitaire Hall", "Sapphire Hall"];

const INDIRECT_SOURCES = Object.values(SOURCE_META).filter((s) => s.channelType === "indirect");
const DIRECT_SOURCE = Object.values(SOURCE_META).find((s) => s.channelType === "direct");

const SCANNED_CARD_DEMO = { name: "Naveen & Simran Kaur", phone: "+91 98110 44221", eventDate: "Feb 14", guests: "260" };

function initialsOf(name) {
  const parts = name.trim().split(/[\s&]+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const emptyForm = { name: "", source: "meta_ads", phone: "", hall: "", eventDate: "", guests: "", note: "" };

export default function AddLeadModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [scanned, setScanned] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setForm(emptyForm);
    setScanned(false);
    onClose();
  }

  function handleScanCard() {
    setForm((f) => ({ ...f, ...SCANNED_CARD_DEMO, note: f.note || "Walk-in — details pulled from guest register photo." }));
    setScanned(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    const guests = parseInt(form.guests, 10);
    const lead = {
      id: Date.now(),
      name,
      initials: initialsOf(name),
      source: form.source,
      stage: "query",
      score: 60,
      days: 0,
      phone: form.phone.trim() || "Not provided",
      ref: null,
      hall: form.hall || "—",
      eventDate: form.eventDate || "Not given yet",
      guests: Number.isFinite(guests) ? guests : 0,
      value: 0,
      thread: [
        {
          t: "Just now",
          type: "dm",
          e: form.note.trim() || "Logged manually by Kritika — new inbound query.",
        },
      ],
    };
    onAdd(lead);
    setForm(emptyForm);
    setScanned(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          style={{ background: "rgba(20,17,15,0.6)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="w-full max-w-[440px] max-h-[88vh] overflow-y-auto rounded-3xl px-6 py-6"
            style={{ background: "var(--color-paper)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-gold-deep)" }}>
                  New inbound
                </div>
                <h2 className="font-serif text-[20px] mt-0.5" style={{ color: "var(--color-ink)" }}>Log a lead</h2>
              </div>
              <button onClick={handleClose} className="rounded-full p-1.5 transition-colors hover:bg-black/5">
                <X size={18} style={{ color: "var(--color-stone)" }} />
              </button>
            </div>
            <p className="font-body text-[12.5px] mb-5" style={{ color: "var(--color-stone)" }}>
              Every walk-in or phone call gets a thread too — log it here so nothing sits off the board.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                  Couple / client name *
                </label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Priyanka & Dev"
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none"
                  style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                  Source
                </label>
                <div className="font-mono text-[9.5px] uppercase tracking-wider mb-1.5" style={{ color: "var(--color-stone)" }}>
                  Indirect — ads &amp; aggregators
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {INDIRECT_SOURCES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => update("source", s.key)}
                      className="rounded-xl py-2 text-[12.5px] font-medium transition-colors"
                      style={{
                        background: form.source === s.key ? "var(--color-ink)" : "var(--color-ivory)",
                        color: form.source === s.key ? "var(--color-paper)" : "var(--color-stone)",
                        border: `1px solid ${form.source === s.key ? "var(--color-ink)" : "var(--color-stone-line)"}`,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="font-mono text-[9.5px] uppercase tracking-wider mb-1.5" style={{ color: "var(--color-stone)" }}>
                  Direct
                </div>
                <button
                  type="button"
                  onClick={() => update("source", DIRECT_SOURCE.key)}
                  className="w-full rounded-xl py-2 text-[12.5px] font-medium transition-colors"
                  style={{
                    background: form.source === DIRECT_SOURCE.key ? "var(--color-emerald)" : "var(--color-ivory)",
                    color: form.source === DIRECT_SOURCE.key ? "var(--color-paper)" : "var(--color-stone)",
                    border: `1px solid ${form.source === DIRECT_SOURCE.key ? "var(--color-emerald)" : "var(--color-stone-line)"}`,
                  }}
                >
                  {DIRECT_SOURCE.label} — walked in or referred by attendance
                </button>
                {form.source === DIRECT_SOURCE.key && (
                  <button
                    type="button"
                    onClick={handleScanCard}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2 mt-2 text-[11.5px] font-medium transition-colors"
                    style={{
                      background: scanned ? "rgba(63,107,86,0.1)" : "var(--color-paper)",
                      color: scanned ? "var(--color-emerald)" : "var(--color-stone)",
                      border: `1px dashed ${scanned ? "var(--color-emerald)" : "var(--color-stone-line)"}`,
                    }}
                  >
                    {scanned ? <Check size={13} /> : <Camera size={13} />}
                    {scanned ? "Filled from guest card photo" : "Scan guest register / visiting card instead"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98•• ••••"
                    className="w-full rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none"
                    style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                    Event date
                  </label>
                  <input
                    value={form.eventDate}
                    onChange={(e) => update("eventDate", e.target.value)}
                    placeholder="e.g. Dec 12 or TBD"
                    className="w-full rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none"
                    style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                  Guest count
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.guests}
                  onChange={(e) => update("guests", e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none"
                  style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                  Hall interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Undecided", ...HALLS].map((h) => {
                    const val = h === "Undecided" ? "" : h;
                    const active = form.hall === val;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => update("hall", val)}
                        className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors"
                        style={{
                          background: active ? "var(--color-gold)" : "var(--color-ivory)",
                          color: active ? "var(--color-ink)" : "var(--color-stone)",
                          border: `1px solid ${active ? "var(--color-gold)" : "var(--color-stone-line)"}`,
                        }}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider block mb-1.5" style={{ color: "var(--color-stone)" }}>
                  First note (optional)
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  placeholder="What did they ask about?"
                  rows={2}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={!form.name.trim()}
                whileHover={form.name.trim() ? { scale: 1.02 } : {}}
                whileTap={form.name.trim() ? { scale: 0.97 } : {}}
                className="flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-[13.5px] mt-1"
                style={{
                  background: form.name.trim() ? "var(--color-gold)" : "var(--color-stone-line)",
                  color: form.name.trim() ? "var(--color-ink)" : "var(--color-stone)",
                  cursor: form.name.trim() ? "pointer" : "not-allowed",
                }}
              >
                <PlusCircle size={15} /> Add to Lead Stages
              </motion.button>
              <div className="text-center font-body text-[10px]" style={{ color: "var(--color-stone)" }}>
                Simulated entry point · a real build reads this off your ad platforms and sheets — this form is just the walk-in and phone-call door
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
