import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowUpRight, PlusCircle, Radar, BellRing, ChevronRight, CalendarClock, Check, X, Users2 } from "lucide-react";
import { LEADS, pendingCommitments, leadOwner } from "../../data/leads";
import Mascot from "../Mascot";
import SheetPreview from "../SheetPreview";

function greetingPeriod(h) {
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

// Trims a commitment's full sentence down to a short, scannable phrase --
// everything before the first em-dash or parenthetical, capped at 5 words.
function shortReason(commitment) {
  if (!commitment) return null;
  const trimmed = commitment.text.split(" — ")[0].split(" (")[0];
  const words = trimmed.split(" ");
  return words.length > 5 ? words.slice(0, 5).join(" ") + "…" : trimmed;
}

// Ticks once a minute so the hero's clock and greeting period stay honest
// without forcing the whole view to re-render constantly.
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function OverviewView({ openLead, onLogLead, setView, viewer = "Aman" }) {
  const now = useClock();
  const [syncDismissed, setSyncDismissed] = useState(false);
  const [syncLogged, setSyncLogged] = useState(false);
  const [syncHall, setSyncHall] = useState("");
  const [syncDate, setSyncDate] = useState("");

  function logSync() {
    setSyncLogged(true);
    setSyncHall("");
    setSyncDate("");
    setTimeout(() => setSyncDismissed(true), 1600);
  }

  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer);
  const hotAll = myLeads.filter((l) => l.score >= 75 && l.stage !== "booked").sort((a, b) => b.score - a.score);
  const hot = hotAll.slice(0, 4);
  const cold = myLeads.filter((l) => l.days >= 5);
  const radarLead = cold.find((l) => l.name === "The Chopra Wedding") || cold[0];
  const commitments = pendingCommitments()
    .filter(({ lead }) => leadOwner(lead) === viewer)
    .sort((a, b) => (a.due === "Today" ? -1 : 1))
    .slice(0, 4);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl px-7 pb-8 mt-24 mb-6 lg:hidden"
        style={{ background: "linear-gradient(120deg, var(--color-ink) 0%, #1c2e26 58%, var(--color-emerald) 130%)", paddingTop: "clamp(120px, 20vw, 210px)" }}
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <svg className="absolute right-0 top-0 h-full opacity-25" width="360" viewBox="0 0 360 240" fill="none">
            <path d="M40 20 C 160 20, 160 120, 300 120 S 340 220, 360 220" stroke="url(#heroThread)" strokeWidth="1.4" fill="none" />
            <defs>
              <linearGradient id="heroThread" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-[8%] rounded-full"
            style={{
              width: "min(70vw, 640px)",
              height: "min(70vw, 640px)",
              background: "radial-gradient(circle, rgba(125,211,252,0.32) 0%, rgba(240,128,176,0.22) 46%, rgba(240,128,176,0) 72%)",
              filter: "blur(30px)",
            }}
          />
        </div>

        <Mascot
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ width: "clamp(150px, 20vw, 260px)", height: "clamp(150px, 20vw, 260px)", top: "clamp(-96px, -14vw, -64px)" }}
        />

        <div className="relative flex flex-col items-center text-center max-w-md mx-auto">
          {hotAll.length + cold.length > 0 && (
            <button
              onClick={() => document.getElementById("needs-attention")?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="flex items-center gap-1.5 rounded-full pl-2 pr-3 py-1.5 mb-4"
              style={{ background: "rgba(178,58,72,0.18)", border: "1px solid rgba(178,58,72,0.4)" }}
            >
              <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: "var(--color-rose-soft)" }} />
              <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--color-rose-soft)" }}>
                {hotAll.length + cold.length} need attention
              </span>
            </button>
          )}
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: "var(--color-gold-soft)" }}>
            {now.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <div className="font-serif leading-none mt-2" style={{ color: "var(--color-paper)", fontSize: "clamp(44px, 8vw, 60px)", fontVariantNumeric: "tabular-nums" }}>
            {now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).replace(/\s?(AM|PM)/i, "")}
            <span className="font-mono text-[16px] ml-1.5 align-top" style={{ color: "var(--color-gold-soft)" }}>
              {now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).match(/AM|PM/i)?.[0]}
            </span>
          </div>
          <h1 className="font-serif text-[24px] md:text-[27px] mt-3 leading-tight" style={{ color: "var(--color-paper)" }}>
            Good {greetingPeriod(now.getHours())}, {viewer}.
          </h1>
          <p className="font-body text-[11.5px] mt-1.5 max-w-sm" style={{ color: "var(--color-stone)" }}>
            One thread, no matter which door they came through.
          </p>

          <div className="flex items-stretch gap-4 sm:gap-6 mt-5 pt-5 w-full max-w-xs justify-center" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex-1">
              <div className="font-serif text-[20px] leading-none" style={{ color: "var(--color-paper)" }}>{myLeads.length}</div>
              <div className="font-mono text-[8.5px] uppercase tracking-wide mt-1" style={{ color: "var(--color-stone)" }}>Active</div>
            </div>
            <div className="flex-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="font-serif text-[20px] leading-none" style={{ color: "var(--color-gold-soft)" }}>{hotAll.length}</div>
              <div className="font-mono text-[8.5px] uppercase tracking-wide mt-1" style={{ color: "var(--color-stone)" }}>Hot</div>
            </div>
            <div className="flex-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="font-serif text-[20px] leading-none" style={{ color: "var(--color-rose-soft)" }}>{cold.length}</div>
              <div className="font-mono text-[8.5px] uppercase tracking-wide mt-1" style={{ color: "var(--color-stone)" }}>Going cold</div>
            </div>
          </div>

          <motion.button
            onClick={onLogLead}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full px-5 py-3 font-medium text-[13px] mt-5 whitespace-nowrap"
            style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
          >
            <PlusCircle size={15} />
            Log a lead
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex relative items-center gap-5 rounded-2xl pl-6 pr-7 py-4 mb-6 overflow-hidden"
        style={{ background: "linear-gradient(120deg, var(--color-ink) 0%, #1c2e26 58%, var(--color-emerald) 130%)" }}
      >
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 320, height: 320,
            background: "radial-gradient(circle, rgba(125,211,252,0.22) 0%, rgba(240,128,176,0.14) 46%, rgba(240,128,176,0) 72%)",
            filter: "blur(24px)",
          }}
        />
        <Mascot className="relative shrink-0" style={{ width: 76, height: 76 }} />

        <div className="relative min-w-0 shrink-0">
          <div className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--color-gold-soft)" }}>
            {now.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · {now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
          </div>
          <h1 className="font-serif text-[19px] leading-tight mt-0.5" style={{ color: "var(--color-paper)" }}>
            Good {greetingPeriod(now.getHours())}, {viewer}.
          </h1>
        </div>

        <div className="relative flex items-center gap-5 pl-5 shrink-0" style={{ borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
          <div>
            <div className="font-serif text-[17px] leading-none" style={{ color: "var(--color-paper)" }}>{myLeads.length}</div>
            <div className="font-mono text-[8px] uppercase tracking-wide mt-1" style={{ color: "var(--color-stone)" }}>Active</div>
          </div>
          <div>
            <div className="font-serif text-[17px] leading-none" style={{ color: "var(--color-gold-soft)" }}>{hotAll.length}</div>
            <div className="font-mono text-[8px] uppercase tracking-wide mt-1" style={{ color: "var(--color-stone)" }}>Hot</div>
          </div>
          <div>
            <div className="font-serif text-[17px] leading-none" style={{ color: "var(--color-rose-soft)" }}>{cold.length}</div>
            <div className="font-mono text-[8px] uppercase tracking-wide mt-1" style={{ color: "var(--color-stone)" }}>Going cold</div>
          </div>
        </div>

        {hotAll.length + cold.length > 0 && (
          <button
            onClick={() => document.getElementById("needs-attention")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="relative flex items-center gap-1.5 rounded-full pl-2 pr-3 py-1.5 ml-auto shrink-0"
            style={{ background: "rgba(178,58,72,0.18)", border: "1px solid rgba(178,58,72,0.4)" }}
          >
            <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: "var(--color-rose-soft)" }} />
            <span className="font-mono text-[10px] uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--color-rose-soft)" }}>
              {hotAll.length + cold.length} need attention
            </span>
          </button>
        )}

        <motion.button
          onClick={onLogLead}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative flex items-center gap-1.5 rounded-full px-4 py-2.5 font-medium text-[12.5px] shrink-0 whitespace-nowrap ${hotAll.length + cold.length > 0 ? "" : "ml-auto"}`}
          style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
        >
          <PlusCircle size={14} />
          Log a lead
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {!syncDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-5 mb-6 overflow-hidden"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-xl w-9 h-9 shrink-0" style={{ background: "rgba(31,77,61,0.1)" }}>
                <CalendarClock size={16} style={{ color: "var(--color-emerald)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Quick sync before today's calls</span>
                  <button onClick={() => setSyncDismissed(true)} className="rounded-full p-1 hover:bg-black/5 shrink-0">
                    <X size={14} style={{ color: "var(--color-stone)" }} />
                  </button>
                </div>
                {syncLogged ? (
                  <div className="flex items-center gap-1.5 mt-2 font-body text-[12.5px]" style={{ color: "var(--color-emerald)" }}>
                    <Check size={13} /> Noted — today's AI calls will reflect this.
                  </div>
                ) : (
                  <>
                    <p className="font-body text-[12px] mt-1 mb-3" style={{ color: "var(--color-stone)" }}>
                      Anything booked or blocked since yesterday?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <input
                        value={syncHall}
                        onChange={(e) => setSyncHall(e.target.value)}
                        placeholder="Hall — e.g. Rubicon"
                        className="rounded-lg px-3 py-1.5 text-[12px] outline-none"
                        style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)", minWidth: 140 }}
                      />
                      <input
                        value={syncDate}
                        onChange={(e) => setSyncDate(e.target.value)}
                        placeholder="Date — e.g. Dec 24"
                        className="rounded-lg px-3 py-1.5 text-[12px] outline-none"
                        style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)", minWidth: 140 }}
                      />
                      <button onClick={logSync} className="rounded-full px-4 py-1.5 font-medium text-[11.5px]" style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}>
                        Log it
                      </button>
                      <button onClick={() => setSyncDismissed(true)} className="rounded-full px-4 py-1.5 font-medium text-[11.5px]" style={{ border: "1px solid var(--color-stone-line)", color: "var(--color-stone)" }}>
                        Nothing's changed
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users2 size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Leads</div>
          </div>
          <button
            onClick={() => setView("allLeads")}
            className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wide"
            style={{ color: "var(--color-gold-deep)" }}
          >
            View all <ChevronRight size={12} />
          </button>
        </div>
        <SheetPreview viewer={viewer} />
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5">
        <motion.div
          id="needs-attention"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex-1 rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-[17px]" style={{ color: "var(--color-ink)" }}>Needs a human, now</div>
            <Flame size={15} style={{ color: "var(--color-gold-deep)" }} />
          </div>
          <div className="flex flex-col gap-2.5">
            {hot.map((l, i) => {
              const reason = shortReason(l.commitment);
              const isToday = l.commitment?.due === "Today";
              return (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  onClick={() => openLead(l)}
                  whileHover={{ x: 3 }}
                  className="w-full flex items-center gap-3.5 rounded-2xl p-3 text-left"
                  style={{ background: "var(--color-ivory-soft)" }}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-2xl shrink-0"
                    style={{ width: 50, height: 50, background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
                  >
                    <span className="font-serif text-[18px] leading-none" style={{ color: "var(--color-gold-deep)" }}>{l.score}</span>
                    <span className="font-mono text-[6.5px] uppercase mt-0.5 tracking-wide" style={{ color: "var(--color-stone)" }}>Score</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate" style={{ color: "var(--color-ink)" }}>{l.name}</div>
                    {reason && (
                      <div className="text-[11.5px] truncate mt-0.5" style={{ color: "var(--color-stone)" }}>{reason}</div>
                    )}
                    {l.commitment?.due && (
                      <span
                        className="inline-block mt-1 font-mono text-[8px] uppercase tracking-wide rounded-full px-1.5 py-0.5"
                        style={{
                          background: isToday ? "rgba(178,58,72,0.1)" : "var(--color-paper)",
                          color: isToday ? "var(--color-rose)" : "var(--color-stone)",
                          border: isToday ? "none" : "1px solid var(--color-stone-line)",
                        }}
                      >
                        {l.commitment.due}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight size={14} className="shrink-0" style={{ color: "var(--color-stone)" }} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {commitments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="w-full mt-5 rounded-2xl p-5"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BellRing size={15} style={{ color: "var(--color-gold-deep)" }} />
            <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>To Do List</span>
          </div>
          <div className="relative pl-5">
            <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px" style={{ background: "var(--color-stone-line)" }} />
            {commitments.map(({ lead, text, due }, i) => {
              const isToday = due === "Today";
              return (
                <div key={lead.id} className="relative pb-3.5 last:pb-0">
                  <span
                    className="absolute -left-5 top-1.5 rounded-full"
                    style={{ width: 8, height: 8, background: isToday ? "var(--color-rose)" : "var(--color-gold)", border: "2px solid var(--color-paper)" }}
                  />
                  <div className="font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: isToday ? "var(--color-rose)" : "var(--color-stone)" }}>
                    {due}
                  </div>
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    onClick={() => openLead(lead)}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left"
                    style={{ background: isToday ? "rgba(178,58,72,0.06)" : "var(--color-ivory-soft)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium truncate" style={{ color: "var(--color-ink)" }}>{text}</div>
                      <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--color-stone)" }}>{lead.name}</div>
                    </div>
                    <ChevronRight size={14} className="shrink-0" style={{ color: "var(--color-stone)" }} />
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {radarLead && (
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          onClick={() => openLead(radarLead)}
          className="w-full mt-5 rounded-2xl p-5 text-left flex items-start gap-4"
          style={{ background: "var(--color-paper)", border: "1.5px dashed var(--color-stone-line)" }}
        >
          <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ background: "rgba(201,162,39,0.12)" }}>
            <Radar size={17} style={{ color: "var(--color-gold-deep)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Objection Radar</span>
            </div>
            <div className="font-body text-[12.5px] mt-1" style={{ color: "var(--color-stone)" }}>
              {radarLead.name} — {radarLead.days}d silent. Reads as hesitation, not cold — flags {viewer} directly.
            </div>
          </div>
        </motion.button>
      )}
    </div>
  );
}
