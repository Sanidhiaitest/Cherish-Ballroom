import { useState } from "react";
import { motion } from "framer-motion";
import { REF_TREE } from "../../data/leads";

export default function ReferralView() {
  const [hover, setHover] = useState(null);
  const nodeById = Object.fromEntries(REF_TREE.map((n) => [n.id, n]));
  const roots = REF_TREE.filter((n) => n.root);
  const booked = REF_TREE.filter((n) => n.status.startsWith("Booked")).length;

  const isDimmed = (n) => {
    if (!hover) return false;
    if (n.id === hover) return false;
    if (n.parent === hover) return false;
    return true;
  };

  return (
    <div>
      <h1 className="font-serif text-[27px]" style={{ color: "var(--color-ink)" }}>Referral Web</h1>
      <p className="font-body text-[13.5px] mt-1.5 mb-6" style={{ color: "var(--color-stone)" }}>
        The channel that was never tracked before — {roots.length} root families, {REF_TREE.length - roots.length} referred weddings, {booked} booked.
      </p>

      <div className="rounded-3xl p-6 md:p-8" style={{ background: "linear-gradient(160deg, var(--color-ink) 0%, #1a1512 100%)" }}>
        <svg width="100%" height="420" viewBox="0 0 760 380">
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

          {REF_TREE.filter((n) => n.parent).map((n, i) => {
            const p = nodeById[n.parent];
            const dimmed = hover && hover !== n.id && hover !== n.parent;
            return (
              <motion.path
                key={n.id}
                d={`M ${p.x} ${p.y} C ${(p.x + n.x) / 2} ${p.y}, ${(p.x + n.x) / 2} ${n.y}, ${n.x} ${n.y}`}
                stroke="url(#thread)"
                strokeWidth={dimmed ? 1 : 1.8}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: dimmed ? 0.25 : 1 }}
                transition={{ pathLength: { duration: 1, delay: i * 0.12, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
              />
            );
          })}

          {REF_TREE.map((n, i) => {
            const dimmed = isDimmed(n);
            return (
              <motion.g
                key={n.id}
                style={{ x: n.x, y: n.y, cursor: "pointer" }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                onMouseEnter={() => setHover(n.root ? n.id : n.parent)}
                onMouseLeave={() => setHover(null)}
              >
                {n.root && <circle r={18} fill="url(#rootGlow)" />}
                <circle
                  r={n.root ? 8 : 5.5}
                  fill={n.root ? "var(--color-gold)" : "var(--color-paper)"}
                  stroke={n.root ? "var(--color-gold-soft)" : "var(--color-stone)"}
                  strokeWidth="1.2"
                />
                <text x={n.root ? 15 : 11} y={4} fontFamily="Inter" fontSize="12.5" fontWeight={n.root ? 700 : 500} fill="var(--color-paper)">
                  {n.name}
                </text>
                <text x={n.root ? 15 : 11} y={18} fontFamily="JetBrains Mono" fontSize="9.5" fill="var(--color-stone)">
                  {n.status}
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
          Referred lead — hover a family to trace its chain
        </span>
      </div>
    </div>
  );
}
