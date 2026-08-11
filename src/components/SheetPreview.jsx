import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";

const BASE_ROWS = [
  { name: "Kabir Anand", type: "wedding", people: "300–500", date: "18 Jan", owner: "Aman", call: "called", duration: "0:41", sentiment: "positive" },
  { name: "Devansh Oberoi", type: "birthday", people: "70–100", date: "3 Dec", owner: "Aman", call: "queued" },
  { name: "Ashok Mehra", type: "corporate_event", people: "100–300", date: "28 Sep", owner: "Aman", call: "called", duration: "0:08", sentiment: "negative" },
  { name: "Riya Malhotra", type: "cocktail/sagan", people: "100–300", date: "Not fixed", owner: "Harman", call: "called", duration: "0:22", sentiment: "neutral" },
  { name: "Tanvi & Yash", type: "wedding", people: "150+", date: "not yet decided", owner: "Harman", call: "called", duration: "1m 12s", sentiment: "positive" },
  { name: "Neha Kapoor", type: "anniversary", people: "70–100", date: "22 Nov", owner: "Harman", call: "queued" },
];

const NEW_ROW_BY_OWNER = {
  Aman: { name: "Simran Sharma", type: "wedding", people: "100–300", date: "Feb 2026", owner: "Aman" },
  Harman: { name: "Meher Kaur", type: "wedding", people: "100–300", date: "Mar 2026", owner: "Harman" },
};

const CALL_META = {
  queued: { label: "Queued", color: "var(--color-stone)", dot: "var(--color-stone)", pulse: false },
  ringing: { label: "Ringing", color: "var(--color-rose)", dot: "var(--color-rose)", pulse: true },
  oncall: { label: "On call", color: "var(--color-gold-deep)", dot: "var(--color-gold)", pulse: true },
};

const SENTIMENT_META = {
  positive: { label: "Positive", color: "var(--color-emerald)", bg: "rgba(31,77,61,0.1)" },
  neutral: { label: "Neutral", color: "var(--color-stone)", bg: "rgba(139,133,120,0.12)" },
  negative: { label: "Negative", color: "var(--color-rose)", bg: "rgba(178,58,72,0.1)" },
};

// Mirrors the real calling vendor's own read-out (Caller Monkey): once a
// call completes it's duration + AI sentiment, not just a status word.
function CallStatus({ status, duration, sentiment }) {
  if (status === "called" && duration && sentiment) {
    const meta = SENTIMENT_META[sentiment];
    return (
      <span className="inline-flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-[10px]" style={{ color: "var(--color-stone)" }}>{duration}</span>
        <span className="font-mono text-[8.5px] uppercase tracking-wide rounded-full px-1.5 py-0.5" style={{ background: meta.bg, color: meta.color }}>
          {meta.label}
        </span>
      </span>
    );
  }
  if (!status) return <span className="font-body text-[11px] shrink-0" style={{ color: "var(--color-stone)" }}>—</span>;
  const meta = CALL_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[11px] shrink-0" style={{ color: meta.color }}>
      <span className={meta.pulse ? "rounded-full animate-pulse" : "rounded-full"} style={{ width: 6, height: 6, background: meta.dot }} />
      {meta.label}
    </span>
  );
}

// Loops a "row lands -> WhatsApp fires -> call goes out" beat every 12s so
// the card stays demonstrative during a live pitch without needing a click.
// Scoped to the current viewer, same as the rest of the dashboard.
export default function SheetPreview({ viewer = "Aman" }) {
  const baseRows = BASE_ROWS.filter((r) => r.owner === viewer);
  const newRow = NEW_ROW_BY_OWNER[viewer] || NEW_ROW_BY_OWNER.Aman;

  const [rows, setRows] = useState(baseRows);
  const [justLanded, setJustLanded] = useState(false);
  const [newCall, setNewCall] = useState(null);
  const [liveText, setLiveText] = useState("Watching the sheet for new leads…");

  useEffect(() => {
    let cancelled = false;
    const timers = [];
    function cycle() {
      setRows(baseRows);
      setJustLanded(false);
      setNewCall(null);
      setLiveText("Watching the sheet for new leads…");
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setRows([{ ...newRow }, ...baseRows]);
        setJustLanded(true);
        setNewCall({ status: "queued" });
        setLiveText(`${newRow.name} just landed — sending WhatsApp…`);
      }, 2600));
      timers.push(setTimeout(() => !cancelled && setLiveText(`WhatsApp sent to ${newRow.name} — call queued next`), 4000));
      timers.push(setTimeout(() => !cancelled && (setNewCall({ status: "ringing" }), setLiveText("Call ringing now")), 5200));
      timers.push(setTimeout(() => !cancelled && (setNewCall({ status: "oncall" }), setLiveText(`On the call with ${newRow.name.split(" ")[0]}`)), 7200));
      timers.push(setTimeout(() => !cancelled && (setNewCall({ status: "called", duration: "0:24", sentiment: "positive" }), setLiveText("Call complete — sentiment positive")), 9400));
    }
    cycle();
    const interval = setInterval(cycle, 12000);
    return () => { cancelled = true; clearInterval(interval); timers.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-stone-line)" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--color-ivory-soft)" }}>
        <span className="font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>Cherish Followup Sheet — Delhi</span>
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase" style={{ color: "var(--color-emerald)" }}>
          <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: "var(--color-emerald)" }} />
          Watching for new rows
        </span>
      </div>

      <AnimatePresence initial={false}>
        {rows.map((r) => {
          const isNew = r.name === newRow.name && justLanded;
          const call = r.name === newRow.name ? (newCall || {}) : r;
          return (
            <motion.div
              key={r.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between gap-3 px-4 py-3"
              style={{
                borderBottom: "1px solid var(--color-stone-line)",
                borderLeft: isNew ? "3px solid var(--color-gold)" : "3px solid transparent",
                background: "var(--color-paper)",
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[12.5px] truncate" style={{ color: "var(--color-ink)" }}>{r.name}</span>
                  {isNew && (
                    <span className="font-mono text-[8px] uppercase rounded-full px-1.5 py-0.5 shrink-0" style={{ border: "1px solid var(--color-gold)", color: "var(--color-gold-deep)" }}>New</span>
                  )}
                </div>
                <div className="font-mono text-[10px] truncate mt-0.5" style={{ color: "var(--color-stone)" }}>
                  {r.type} · {r.people} · {r.date}
                </div>
              </div>
              <CallStatus status={call.status || call.call} duration={call.duration} sentiment={call.sentiment} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="relative flex items-center gap-2.5 mx-3 my-3 rounded-full pl-1.5 pr-4 py-1.5" style={{ background: "var(--color-ivory-soft)" }}>
        <Mascot size={30} className="shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={liveText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="font-body text-[11px] truncate"
            style={{ color: "var(--color-emerald)" }}
          >
            {liveText}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
