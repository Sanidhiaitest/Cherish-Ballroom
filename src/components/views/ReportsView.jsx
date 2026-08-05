import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, MessageSquareWarning, FileText, TrendingUp, Wand2, ChevronRight, Megaphone, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  LEADS, STAGES, SOURCE_META, WEEKLY_LEAD_TREND, BOOKINGS_TREND, MONTHLY_BOOKING_GOAL,
  REVIEWS, SAVED_REPORTS, CAMPAIGNS, CONTENT_TRENDS, formatINR, medianResponseSeconds, partnerMarginSummary,
} from "../../data/leads";
import { sourceColor } from "../SourceTag";
import AreaChart from "../charts/AreaChart";
import DonutChart from "../charts/DonutChart";
import BarChart from "../charts/BarChart";

const PERIODS = ["7 Days", "30 Days", "6 Months"];

function seededDay(i) {
  // Deterministic pseudo-random 0-3 "activity" level per calendar day — no
  // real per-day dataset needed for a decorative heatmap.
  return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
}

export default function ReportsView() {
  const [period, setPeriod] = useState("7 Days");
  const [showAIReply, setShowAIReply] = useState(false);

  const bySource = Object.keys(SOURCE_META)
    .map((s) => ({
      label: SOURCE_META[s].label,
      value: LEADS.filter((l) => l.source === s).length,
      color: sourceColor(s),
    }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const funnelData = STAGES.map((s) => ({
    label: s.label.replace("Visit Scheduled", "Visit Sch.").replace("Follow-Up", "Follow-Up"),
    value: LEADS.filter((l) => l.stage === s.id).length,
    color: s.id === "booked" ? "var(--color-emerald)" : "var(--color-gold)",
  }));

  const median = medianResponseSeconds();
  const margin = partnerMarginSummary();
  const cold = LEADS.filter((l) => l.days >= 5).length;
  const bookedValue = LEADS.filter((l) => l.stage === "booked").reduce((s, l) => s + l.value, 0);
  const goalPct = Math.min(100, Math.round((bookedValue / MONTHLY_BOOKING_GOAL) * 100));

  const flaggedReview = REVIEWS.find((r) => r.flagged);
  const otherReviews = REVIEWS.filter((r) => !r.flagged);

  const insights = [
    `Inbound leads get a first reply in a median of ${median}s — Delhi banquet venues average 11–47 hours. That gap alone is the highest-leverage lever this quarter.`,
    `Event Co. leads net ${formatINR(margin.eventcoNetPerLead)}/lead after the 50% commission, vs ${formatINR(margin.directNetPerLead)}/lead everywhere else — worth weighing before the next partner renewal.`,
    `${cold} lead${cold === 1 ? "" : "s"} have gone quiet 5+ days with no reply — Objection Radar would flag these for a human call instead of another nudge.`,
    `Booked pipeline is at ${goalPct}% of this month's ₹${(MONTHLY_BOOKING_GOAL / 10000000).toFixed(1)}Cr goal.`,
  ];

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Reports & Insights</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        Every number already sitting in the CRM, read out loud.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-5"
        style={{ background: "linear-gradient(120deg, var(--color-ink), #1c2e26)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center rounded-lg w-7 h-7" style={{ background: "rgba(201,162,39,0.16)" }}>
            <Sparkles size={13.5} style={{ color: "var(--color-gold-soft)" }} />
          </div>
          <span className="font-serif text-[16px]" style={{ color: "var(--color-paper)" }}>Cherish AI Reports</span>
          <span className="font-mono text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ background: "rgba(201,162,39,0.16)", color: "var(--color-gold-soft)" }}>Beta</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <TrendingUp size={13} className="shrink-0 mt-0.5" style={{ color: "var(--color-gold-soft)" }} />
              <span className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-ivory)" }}>{line}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Content & Trends Advisor</div>
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Before the ad spend — what's actually earning attention right now, and what to leave alone.
          </p>
          <div className="flex flex-col gap-2.5">
            {CONTENT_TRENDS.map((t, i) => {
              const post = t.type === "post";
              return (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
                  style={{ background: post ? "rgba(31,77,61,0.07)" : "rgba(178,58,72,0.07)", border: `1px solid ${post ? "rgba(31,77,61,0.22)" : "rgba(178,58,72,0.22)"}` }}
                >
                  {post ? (
                    <ThumbsUp size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-emerald)" }} />
                  ) : (
                    <ThumbsDown size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-rose)" }} />
                  )}
                  <div>
                    <div className="font-body text-[12.5px] font-semibold" style={{ color: "var(--color-ink)" }}>{t.title}</div>
                    <div className="font-body text-[11.5px] mt-0.5 leading-relaxed" style={{ color: "var(--color-stone)" }}>{t.reason}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Campaign Performance</div>
          </div>
          <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
            Which ad spend is actually turning into leads and bookings.
          </p>
          <div className="flex flex-col">
            {CAMPAIGNS.map((c, i) => (
              <div key={c.name} className="py-3" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-stone-line)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-body text-[12.5px] font-semibold" style={{ color: "var(--color-ink)" }}>{c.name}</div>
                  <span className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>{c.platform}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]" style={{ color: "var(--color-stone)" }}>
                  <span>{formatINR(c.spend)} spent</span>
                  <span>{c.leads} leads</span>
                  <span style={{ color: "var(--color-gold-deep)" }}>{formatINR(Math.round(c.spend / c.leads))}/lead</span>
                  <span style={{ color: "var(--color-emerald)" }}>{c.booked} booked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <div className="flex gap-1 rounded-full p-1" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-full px-3 py-1 font-mono text-[10.5px]"
              style={{ background: period === p ? "var(--color-ink)" : "transparent", color: period === p ? "var(--color-paper)" : "var(--color-stone)" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="font-serif text-[15px] mb-0.5" style={{ color: "var(--color-ink)" }}>Incoming Leads</div>
          <div className="font-body text-[11.5px] mb-3" style={{ color: "var(--color-stone)" }}>for the last {period.toLowerCase()}</div>
          <AreaChart data={WEEKLY_LEAD_TREND} color="var(--color-gold)" />
          <div className="font-serif text-[26px] mt-2" style={{ color: "var(--color-ink)" }}>{WEEKLY_LEAD_TREND.reduce((s, d) => s + d.value, 0)}</div>
          <div className="font-mono text-[10px] uppercase" style={{ color: "var(--color-stone)" }}>Created this period</div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="font-serif text-[15px] mb-0.5" style={{ color: "var(--color-ink)" }}>Bookings Trend</div>
          <div className="font-body text-[11.5px] mb-3" style={{ color: "var(--color-stone)" }}>confirmed events per month</div>
          <AreaChart data={BOOKINGS_TREND} color="var(--color-emerald)" />
          <div className="font-serif text-[26px] mt-2" style={{ color: "var(--color-ink)" }}>{BOOKINGS_TREND.reduce((s, d) => s + d.value, 0)}</div>
          <div className="font-mono text-[10px] uppercase" style={{ color: "var(--color-stone)" }}>Booked, last 6 months</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded-2xl p-6 flex items-center gap-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <DonutChart segments={bySource} centerLabel={LEADS.length} centerSub="Leads" />
          <div className="flex flex-col gap-2.5">
            <div className="font-serif text-[15px] mb-1" style={{ color: "var(--color-ink)" }}>Lead Source Mix</div>
            {bySource.map((s) => (
              <div key={s.label} className="flex items-center gap-2 font-body text-[12px]" style={{ color: "var(--color-ink)" }}>
                <span className="rounded-full" style={{ width: 8, height: 8, background: s.color }} />
                {s.label} <span className="font-mono ml-auto" style={{ color: "var(--color-stone)" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="font-serif text-[15px] mb-3" style={{ color: "var(--color-ink)" }}>Funnel by Stage</div>
          <BarChart data={funnelData} />
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-5" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Monthly Booking Goal</div>
          <div className="font-mono text-[12px]" style={{ color: "var(--color-stone)" }}>{formatINR(bookedValue)} of {formatINR(MONTHLY_BOOKING_GOAL)}</div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-4" style={{ background: "var(--color-ivory-soft)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--color-gold), var(--color-emerald))" }}
          />
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const v = seededDay(i);
            const bg = v > 0.75 ? "var(--color-gold)" : v > 0.5 ? "var(--color-gold-soft)" : v > 0.25 ? "var(--color-ivory-soft)" : "var(--color-stone-line)";
            return <div key={i} className="aspect-square rounded-[3px]" style={{ background: bg }} title={`Day ${i + 1}`} />;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Star size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Reputation Monitor</div>
          </div>

          {flaggedReview && (
            <div className="rounded-2xl p-4 mb-3" style={{ background: "rgba(178,58,72,0.08)", border: "1px solid rgba(178,58,72,0.25)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquareWarning size={13} style={{ color: "var(--color-rose)" }} />
                <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "var(--color-rose)" }}>{flaggedReview.platform} · needs a reply</span>
              </div>
              <div className="font-body text-[12.5px] leading-relaxed mb-2" style={{ color: "var(--color-ink)" }}>
                "{flaggedReview.text}" <span style={{ color: "var(--color-stone)" }}>— {flaggedReview.author}</span>
              </div>
              <button
                onClick={() => setShowAIReply((v) => !v)}
                className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wide"
                style={{ color: "var(--color-gold-deep)" }}
              >
                <Wand2 size={11} /> {showAIReply ? "Hide AI-suggested reply" : "Suggest AI reply"}
              </button>
              {showAIReply && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2.5 rounded-xl px-3 py-2.5 font-body text-[12px] leading-relaxed"
                  style={{ background: "var(--color-paper)", border: "1px dashed var(--color-stone-line)", color: "var(--color-ink)" }}
                >
                  "Hi! So sorry for the delayed reply — that's on us. We'd love another chance to show you around, on us. DMing you now with our direct line."
                </motion.div>
              )}
            </div>
          )}
          {otherReviews.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-3 py-2.5" style={{ borderTop: "1px solid var(--color-stone-line)" }}>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9.5px] uppercase" style={{ color: "var(--color-stone)" }}>{r.platform}</span>
                  <span className="font-body text-[11.5px] font-medium" style={{ color: "var(--color-ink)" }}>{r.author}</span>
                </div>
                <div className="font-body text-[12px] mt-0.5 truncate" style={{ color: "var(--color-stone)" }}>{r.text}</div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} fill="var(--color-gold)" color="var(--color-gold)" />)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>Saved Reports</div>
          </div>
          <div className="flex flex-col">
            {SAVED_REPORTS.map((r, i) => (
              <div key={r.name} className="flex items-center justify-between py-2.5" style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-stone-line)" }}>
                <div>
                  <div className="font-body text-[12.5px] font-medium" style={{ color: "var(--color-ink)" }}>{r.name}</div>
                  <div className="font-mono text-[10.5px]" style={{ color: "var(--color-stone)" }}>by {r.author} · {r.type}</div>
                </div>
                <ChevronRight size={14} style={{ color: "var(--color-stone)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
