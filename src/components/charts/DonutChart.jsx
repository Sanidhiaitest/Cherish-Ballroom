import { motion } from "framer-motion";

export default function DonutChart({ segments, size = 140, strokeWidth = 20, centerLabel, centerSub }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let offsetAcc = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-stone-line)" strokeWidth={strokeWidth} opacity={0.4} />
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const gap = c - dash;
          const offset = -offsetAcc * c;
          offsetAcc += frac;
          return (
            <motion.circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              initial={{ strokeDashoffset: c, strokeDasharray: `0 ${c}` }}
              animate={{ strokeDashoffset: offset, strokeDasharray: `${dash} ${gap}` }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: "easeOut" }}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-ink)" }}>{centerLabel}</div>
          {centerSub && <div className="font-mono text-[9px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>{centerSub}</div>}
        </div>
      )}
    </div>
  );
}
