import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_ROWS = [
  { name: "Kabir Anand", type: "wedding", people: "300–500", date: "18 Jan", visit: "will decide", owner: "Aman", call: "called" },
  { name: "Riya Malhotra", type: "cocktail/sagan", people: "100–300", date: "Not fixed", visit: "next week", owner: "Harman", call: "called" },
  { name: "Devansh Oberoi", type: "birthday", people: "70–100", date: "3 Dec", visit: "asap", owner: "Aman", call: "queued" },
  { name: "Tanvi & Yash", type: "wedding", people: "150+", date: "not yet decided", visit: "call me", owner: "Harman", call: "called" },
  { name: "Ashok Mehra", type: "corporate_event", people: "100–300", date: "28 Sep", visit: "weekday, any", owner: "Aman", call: "called" },
  { name: "Neha Kapoor", type: "anniversary", people: "70–100", date: "22 Nov", visit: "this weekend", owner: "Harman", call: "queued" },
];

const NEW_ROW = { name: "Simran Sharma", type: "wedding", people: "100–300", date: "Feb 2026", visit: "just submitted", owner: "Aman" };

const CALL_META = {
  queued: { label: "Queued", color: "var(--color-stone)", dot: "var(--color-stone)", pulse: false },
  ringing: { label: "Ringing", color: "var(--color-rose)", dot: "var(--color-rose)", pulse: true },
  oncall: { label: "On call", color: "var(--color-gold-soft)", dot: "var(--color-gold)", pulse: true },
  called: { label: "Called", color: "var(--color-emerald-soft)", dot: "var(--color-emerald-soft)", pulse: false },
};

function OwnerPill({ owner }) {
  const isAman = owner === "Aman";
  return (
    <span
      className="font-mono text-[8.5px] uppercase tracking-wide rounded-full px-1.5 py-0.5"
      style={{
        background: isAman ? "rgba(201,162,39,0.16)" : "rgba(61,120,99,0.2)",
        color: isAman ? "var(--color-gold-soft)" : "var(--color-emerald-soft)",
      }}
    >
      {owner}
    </span>
  );
}

function CallStatus({ status }) {
  if (!status) return <span className="font-body text-[11px]" style={{ color: "var(--color-stone)" }}>—</span>;
  const meta = CALL_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[11px]" style={{ color: meta.color }}>
      <span className={meta.pulse ? "rounded-full animate-pulse" : "rounded-full"} style={{ width: 6, height: 6, background: meta.dot }} />
      {meta.label}
    </span>
  );
}

// Loops a "row lands -> WhatsApp fires -> call goes out" beat every 12s so
// the card stays demonstrative during a live pitch without needing a click.
export default function SheetPreview() {
  const [rows, setRows] = useState(BASE_ROWS);
  const [justLanded, setJustLanded] = useState(false);
  const [waSent, setWaSent] = useState(false);
  const [newCallStatus, setNewCallStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const timers = [];
    function cycle() {
      setRows(BASE_ROWS);
      setJustLanded(false);
      setWaSent(false);
      setNewCallStatus(null);
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setRows([{ ...NEW_ROW, call: "queued" }, ...BASE_ROWS]);
        setJustLanded(true);
        setNewCallStatus("queued");
      }, 2600));
      timers.push(setTimeout(() => !cancelled && setWaSent(true), 4000));
      timers.push(setTimeout(() => !cancelled && setNewCallStatus("ringing"), 5200));
      timers.push(setTimeout(() => !cancelled && setNewCallStatus("oncall"), 7200));
      timers.push(setTimeout(() => !cancelled && setNewCallStatus("called"), 9400));
    }
    cycle();
    const interval = setInterval(cycle, 12000);
    return () => { cancelled = true; clearInterval(interval); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <span className="font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>Cherish Followup Sheet — Delhi</span>
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase" style={{ color: "var(--color-emerald-soft)" }}>
          <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: "var(--color-emerald-soft)" }} />
          Watching for new rows
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              {["Event", "People", "Name", "Date", "Visit plan", "Owner", "Call"].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[8.5px] uppercase tracking-wide text-left px-3 py-2 whitespace-nowrap"
                  style={{ background: "rgba(255,255,255,0.03)", color: "var(--color-stone)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((r) => {
                const isNew = r.name === "Simran Sharma" && justLanded;
                const callStatus = r.name === "Simran Sharma" ? newCallStatus : r.call;
                return (
                  <motion.tr
                    key={r.name}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, backgroundColor: isNew ? "rgba(201,162,39,0.14)" : "rgba(255,255,255,0)" }}
                    transition={{ duration: 0.5 }}
                  >
                    <td className="font-body text-[11px] px-3 py-2 whitespace-nowrap" style={{ color: "var(--color-paper)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{r.type}</td>
                    <td className="font-body text-[11px] px-3 py-2 whitespace-nowrap" style={{ color: "var(--color-paper)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{r.people}</td>
                    <td className="font-body text-[11px] px-3 py-2 font-semibold whitespace-nowrap" style={{ color: "var(--color-paper)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {r.name}
                      {isNew && (
                        <span className="ml-1.5 font-mono text-[8px] uppercase rounded-full px-1.5 py-0.5" style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}>New</span>
                      )}
                    </td>
                    <td className="font-body text-[11px] px-3 py-2 whitespace-nowrap" style={{ color: "var(--color-stone)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{r.date}</td>
                    <td className="font-body text-[11px] italic px-3 py-2 whitespace-nowrap" style={{ color: "var(--color-stone)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{r.visit}</td>
                    <td className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}><OwnerPill owner={r.owner} /></td>
                    <td className="px-3 py-2 whitespace-nowrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}><CallStatus status={callStatus} /></td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {waSent && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ background: "rgba(61,120,99,0.14)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="rounded-full" style={{ width: 6, height: 6, background: "var(--color-emerald-soft)" }} />
            <span className="font-body text-[11px]" style={{ color: "var(--color-emerald-soft)" }}>
              WhatsApp sent to Simran Sharma
              {newCallStatus === "queued" && " — call queued next"}
              {newCallStatus === "ringing" && " — call ringing now"}
              {newCallStatus === "oncall" && " — on the call now"}
              {newCallStatus === "called" && " — call complete"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
