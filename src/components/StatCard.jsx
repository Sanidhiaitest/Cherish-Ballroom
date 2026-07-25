import { motion } from "framer-motion";

export default function StatCard({ label, value, sub, Icon, tint = "var(--color-gold)", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="flex-1 min-w-[150px] rounded-2xl p-5 relative overflow-hidden"
      style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)", boxShadow: "0 1px 2px rgba(20,17,15,0.04)" }}
    >
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-[0.10]"
        style={{ background: tint }}
      />
      <div className="flex items-center justify-between relative">
        <div className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--color-stone)" }}>{label}</div>
        {Icon && (
          <div className="flex items-center justify-center rounded-lg w-7 h-7" style={{ background: `${tint}1a` }}>
            <Icon size={13.5} style={{ color: tint }} />
          </div>
        )}
      </div>
      <div className="font-serif text-[32px] mt-2 leading-none" style={{ color: "var(--color-ink)" }}>{value}</div>
      {sub && <div className="font-body text-[12px] mt-1.5" style={{ color: "var(--color-stone)" }}>{sub}</div>}
    </motion.div>
  );
}
