import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowUpRight } from "lucide-react";
import { LEADS, STAGES } from "../../data/leads";
import Avatar from "../Avatar";
import PhaseBadge from "../PhaseBadge";

const VB_W = 760;
const VB_H = 380;
const ROOT_X = 110;
const CHILD_X = [560, 590];

function useGraph() {
  return useMemo(() => {
    const roots = LEADS.filter((l) => l.rootFamily);
    const byRoot = Object.fromEntries(roots.map((r) => [r.name, LEADS.filter((l) => l.ref === r.name)]));
    const bandH = VB_H / roots.length;
    const nodes = [];
    const edges = [];
    roots.forEach((root, i) => {
      const bandTop = i * bandH;
      const rootY = bandTop + bandH / 2;
      nodes.push({ ...root, x: ROOT_X, y: rootY });
      const kids = byRoot[root.name] || [];
      kids.forEach((kid, ki) => {
        const pad = bandH * 0.2;
        const usable = bandH - pad * 2;
        const y = kids.length === 1 ? rootY : bandTop + pad + (usable * ki) / (kids.length - 1);
        const kidNode = { ...kid, x: CHILD_X[ki % 2], y };
        nodes.push(kidNode);
        edges.push({ id: kid.id, parentName: root.name, x1: ROOT_X, y1: rootY, x2: kidNode.x, y2: y });
      });
    });
    return { nodes, edges, roots };
  }, []);
}

export default function ReferralView({ openLead }) {
  const [hover, setHover] = useState(null);
  const { nodes, edges, roots } = useGraph();
  const totalReferred = nodes.length - roots.length;
  const booked = nodes.filter((n) => n.stage === "booked").length;
  const anniversaryLead = LEADS.find((l) => l.anniversary);
  const pastReferrals = anniversaryLead ? LEADS.filter((l) => l.ref === anniversaryLead.name) : [];

  const isDimmed = (n) => {
    if (!hover) return false;
    if (n.name === hover) return false;
    if (n.ref === hover) return false;
    return true;
  };

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Referral Web</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        {roots.length} root families · {totalReferred} referred · {booked} booked
      </p>

      <div className="rounded-3xl p-6 md:p-8" style={{ background: "linear-gradient(160deg, var(--color-ink) 0%, #1a1512 100%)" }}>
        <svg width="100%" height="420" viewBox={`0 0 ${VB_W} ${VB_H}`}>
          <defs>
            <linearGradient id="thread" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.75" />
            </linearGradient>
            <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {edges.map((e, i) => {
            const dimmed = hover && hover !== e.id && hover !== e.parentName;
            return (
              <motion.path
                key={e.id}
                d={`M ${e.x1} ${e.y1} C ${(e.x1 + e.x2) / 2} ${e.y1}, ${(e.x1 + e.x2) / 2} ${e.y2}, ${e.x2} ${e.y2}`}
                stroke="url(#thread)"
                strokeWidth={dimmed ? 1 : 1.8}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: dimmed ? 0.25 : 1 }}
                transition={{ pathLength: { duration: 1, delay: i * 0.12, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
              />
            );
          })}

          {nodes.map((n, i) => {
            const dimmed = isDimmed(n);
            const status = n.milestone || STAGES.find((s) => s.id === n.stage)?.label || n.stage;
            return (
              <motion.g
                key={n.id}
                style={{ x: n.x, y: n.y, cursor: "pointer" }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                onMouseEnter={() => setHover(n.rootFamily ? n.name : n.ref)}
                onMouseLeave={() => setHover(null)}
                onClick={() => openLead(n)}
              >
                {n.rootFamily && <circle r={18} fill="url(#rootGlow)" />}
                <circle
                  r={n.rootFamily ? 8 : 5.5}
                  fill={n.rootFamily ? "var(--color-gold)" : "var(--color-paper)"}
                  stroke={n.rootFamily ? "var(--color-gold-soft)" : "var(--color-stone)"}
                  strokeWidth="1.2"
                />
                <text x={n.rootFamily ? 15 : 11} y={4} fontFamily="Inter" fontSize="12.5" fontWeight={n.rootFamily ? 700 : 500} fill="var(--color-paper)">
                  {n.name}
                </text>
                <text x={n.rootFamily ? 15 : 11} y={18} fontFamily="JetBrains Mono" fontSize="9.5" fill="var(--color-stone)">
                  {status}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-5 mt-5 font-body text-[12px]" style={{ color: "var(--color-stone)" }}>
        <span className="flex items-center gap-2">
          <span className="inline-block rounded-full" style={{ width: 9, height: 9, background: "var(--color-gold)" }} />
          Root family (originated the chain)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block rounded-full" style={{ width: 9, height: 9, border: "1.5px solid var(--color-stone)", background: "var(--color-paper)" }} />
          Referred lead — hover to trace, click to open
        </span>
      </div>

      {anniversaryLead && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openLead(anniversaryLead)}
          className="w-full mt-5 rounded-2xl p-5 text-left flex items-start gap-4"
          style={{ background: "var(--color-paper)", border: "1.5px dashed var(--color-stone-line)" }}
        >
          <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ background: "rgba(201,162,39,0.12)" }}>
            <HeartHandshake size={17} style={{ color: "var(--color-gold-deep)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Avatar initials={anniversaryLead.initials} source={anniversaryLead.source} size={22} />
              <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>{anniversaryLead.name} — {anniversaryLead.anniversary.label}</span>
              <PhaseBadge phase={2} />
            </div>
            <div className="font-body text-[12.5px] mt-1.5" style={{ color: "var(--color-stone)" }}>
              {anniversaryLead.anniversary.when} — reconnection note, not a pitch. {pastReferrals.length > 0
                ? `Already referred ${pastReferrals[0].name}.`
                : "Where referrals start — worth a personal line."}
            </div>
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: "var(--color-gold-deep)" }}>
              Open thread <ArrowUpRight size={12} />
            </div>
          </div>
        </motion.button>
      )}
    </div>
  );
}
