import { motion } from "framer-motion";

export default function BarChart({ data, height = 150, color = "var(--color-gold)" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="font-mono text-[10.5px] font-bold" style={{ color: d.color || color }}>{d.value}</span>
          <motion.div
            className="w-full rounded-t-md"
            style={{ background: d.color || color, minHeight: 3 }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max((d.value / max) * (height - 46), 3)}px` }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="font-body text-[9.5px] text-center leading-tight" style={{ color: "var(--color-stone)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
