import { motion } from "framer-motion";
import { Flame, Snowflake, TrendingUp, Wallet, ArrowUpRight, PlusCircle, Radar, BellRing, ChevronRight, Bot } from "lucide-react";
import { LEADS, SOURCE_META, formatINR, liveChannelSplit, pendingCommitments, commitmentSource } from "../../data/leads";
import StatCard from "../StatCard";
import SourceTag, { sourceColor } from "../SourceTag";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

export default function OverviewView({ openLead, onLogLead }) {
  const bySource = Object.keys(SOURCE_META).map((s) => ({
    key: s,
    count: LEADS.filter((l) => l.source === s).length,
  })).sort((a, b) => b.count - a.count);
  const split = liveChannelSplit();
  const hotAll = LEADS.filter((l) => l.score >= 75 && l.stage !== "booked").sort((a, b) => b.score - a.score);
  const hot = hotAll.slice(0, 4);
  const booked = LEADS.filter((l) => l.stage === "booked");
  const bookedValue = booked.reduce((s, l) => s + l.value, 0);
  const cold = LEADS.filter((l) => l.days >= 5);
  const radarLead = LEADS.find((l) => l.name === "The Chopra Wedding");
  const commitments = pendingCommitments().sort((a, b) => (a.due === "Today" ? -1 : 1)).slice(0, 4);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl px-7 py-8 md:px-9 md:py-10 mb-6"
        style={{ background: "linear-gradient(120deg, var(--color-ink) 0%, #1c2e26 58%, var(--color-emerald) 130%)" }}
      >
        <svg className="absolute right-0 top-0 h-full opacity-40" width="360" viewBox="0 0 360 240" fill="none">
          <path d="M40 20 C 160 20, 160 120, 300 120 S 340 220, 360 220" stroke="url(#heroThread)" strokeWidth="1.4" fill="none" />
          <defs>
            <linearGradient id="heroThread" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: "var(--color-gold-soft)" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long" })} · {LEADS.length} threads live right now
            </div>
            <h1 className="font-serif text-[30px] md:text-[36px] mt-2 leading-tight" style={{ color: "var(--color-paper)" }}>
              Good evening, Kritika.
            </h1>
            <p className="font-body text-[13.5px] mt-2.5 max-w-md leading-relaxed" style={{ color: "var(--color-stone)" }}>
              Nobody falls through the cracks between an ad, an aggregator, or a walk-in — one thread, no matter which door they came through.
            </p>
          </div>
          <motion.button
            onClick={onLogLead}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full px-5 py-3 font-medium text-[13px] self-start shrink-0 whitespace-nowrap"
            style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
          >
            <PlusCircle size={15} />
            Log a lead
          </motion.button>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-4">
        <StatCard label="Active Leads" value={LEADS.length} sub="across all sources" Icon={TrendingUp} tint="var(--color-gold)" delay={0.05} />
        <StatCard label="Hot · Score ≥75" value={hotAll.length} sub="likely to convert" Icon={Flame} tint="var(--color-gold-deep)" delay={0.1} />
        <StatCard label="Going Cold" value={cold.length} sub="5+ days silent" Icon={Snowflake} tint="var(--color-rose)" delay={0.15} />
        <StatCard label="Booked pipeline" value={formatINR(bookedValue)} sub={`${booked.length} weddings on the books`} Icon={Wallet} tint="var(--color-emerald)" delay={0.2} />
      </div>

      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex-1 rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="font-serif text-[17px]" style={{ color: "var(--color-ink)" }}>Where they're coming from</div>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-2 rounded-full overflow-hidden flex" style={{ background: "var(--color-ivory-soft)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${split.indirectPct}%` }} transition={{ duration: 0.7 }} style={{ background: "var(--color-gold)" }} />
              <motion.div initial={{ width: 0 }} animate={{ width: `${split.directPct}%` }} transition={{ duration: 0.7, delay: 0.1 }} style={{ background: "var(--color-emerald)" }} />
            </div>
            <span className="font-mono text-[10.5px] shrink-0" style={{ color: "var(--color-stone)" }}>
              {split.indirectPct}% indirect · {split.directPct}% direct
            </span>
          </div>
          {bySource.map((s, i) => (
            <div key={s.key} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-1.5">
                <SourceTag source={s.key} />
                <span className="font-mono text-[12px]" style={{ color: "var(--color-stone)" }}>{s.count} leads</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-ivory-soft)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.count / LEADS.length) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: sourceColor(s.key) }}
                />
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 font-body text-[10.5px] leading-relaxed" style={{ borderTop: "1px solid var(--color-stone-line)", color: "var(--color-stone)" }}>
            This is this pipeline's live sample — Naveen's stated business-wide split (confirmed on the discovery call) is ~70% indirect / ~30% direct.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex-1 rounded-2xl p-6"
          style={{ background: "var(--color-ink)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-[17px]" style={{ color: "var(--color-paper)" }}>Needs a human, now</div>
            <Flame size={15} style={{ color: "var(--color-gold)" }} />
          </div>
          <div className="flex flex-col">
            {hot.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                onClick={() => openLead(l)}
                whileHover={{ x: 3 }}
                className="w-full flex items-center gap-3 py-2.5 text-left"
                style={{ borderBottom: i < hot.length - 1 ? "1px solid var(--color-ink-line)" : "none" }}
              >
                <Avatar initials={l.initials} source={l.source} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate" style={{ color: "var(--color-paper)" }}>{l.name}</div>
                  <SourceTag source={l.source} />
                </div>
                <div className="font-mono text-[16px]" style={{ color: "var(--color-gold-soft)" }}>{l.score}</div>
                <ArrowUpRight size={14} style={{ color: "var(--color-stone)" }} />
              </motion.button>
            ))}
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
          <div className="flex items-center gap-2 mb-1">
            <BellRing size={15} style={{ color: "var(--color-gold-deep)" }} />
            <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>What you said you'd do</span>
          </div>
          <p className="font-body text-[11.5px] mb-4" style={{ color: "var(--color-stone)" }}>
            Pulled from your own calls and notes — nobody has to remember these, the system does.
          </p>
          <div className="flex flex-col gap-1">
            {commitments.map(({ lead, text, due }, i) => (
              <motion.button
                key={lead.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => openLead(lead)}
                className="w-full flex items-center gap-3 py-2 text-left rounded-xl transition-colors hover:bg-black/[0.03]"
              >
                <span
                  className="font-mono text-[9.5px] uppercase tracking-wider rounded-full px-2 py-1 shrink-0"
                  style={{
                    background: due === "Today" ? "rgba(178,58,72,0.1)" : "var(--color-ivory-soft)",
                    color: due === "Today" ? "var(--color-rose)" : "var(--color-stone)",
                  }}
                >
                  {due}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate" style={{ color: "var(--color-ink)" }}>{text}</div>
                  <div className="flex items-center gap-1 font-mono text-[10px] mt-0.5" style={{ color: "var(--color-stone)" }}>
                    {lead.name}
                    <span style={{ opacity: 0.5 }}>·</span>
                    {commitmentSource(lead.name) === "Parsed from the AI call transcript" && <Bot size={9} />}
                    {commitmentSource(lead.name)}
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: "var(--color-stone)" }} />
              </motion.button>
            ))}
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
              <PhaseBadge phase={2} />
            </div>
            <div className="font-body text-[12.5px] mt-1 leading-relaxed" style={{ color: "var(--color-stone)" }}>
              {radarLead.name}'s quote has sat open for {radarLead.days} days with no reply. Today that just sits in Follow-Up. Objection Radar would read this as hesitation, not "gone cold" — and flag Kritika directly instead of firing another nudge.
            </div>
          </div>
        </motion.button>
      )}
    </div>
  );
}
