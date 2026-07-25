import { useId, useMemo } from "react";
import { motion } from "framer-motion";

// Smooth "mountain" area chart — Catmull-Rom-ish smoothing through points via
// quadratic midpoint beziers, filled with a gradient, animated draw-in.
export default function AreaChart({ data, color = "var(--color-gold)", height = 140, width = 400 }) {
  const gid = useId();
  const { linePath, areaPath, points } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value), 1);
    const stepX = width / (data.length - 1);
    const pts = data.map((d, i) => ({
      x: i * stepX,
      y: height - (d.value / max) * (height - 18) - 4,
    }));
    let line = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const midX = (pts[i - 1].x + pts[i].x) / 2;
      line += ` C ${midX} ${pts[i - 1].y}, ${midX} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    const area = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;
    return { linePath: line, areaPath: area, points: pts };
  }, [data, height, width]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#${gid})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 4 : 2.5}
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}
