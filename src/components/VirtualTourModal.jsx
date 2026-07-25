import { AnimatePresence, motion } from "framer-motion";
import { X, Compass, Flame, ChefHat, Soup, UtensilsCrossed, MessageCircle } from "lucide-react";

const HOTSPOTS = [
  { label: "Live Tandoor Counter", Icon: Flame, x: "14%" },
  { label: "Plating & Garnish Line", Icon: UtensilsCrossed, x: "42%" },
  { label: "Dessert Station", Icon: Soup, x: "68%" },
  { label: "Head Chef's Pass", Icon: ChefHat, x: "88%" },
];

const MENU_QA = [
  { q: "Do you have a Jain food option?", a: "Yes — our Emerald and Rubicon menus both include a full Jain counter, no onion, garlic, or root vegetables." },
  { q: "What's included in the ₹2,500/plate package?", a: "4 starters, 3 mains, a live tandoor counter, dessert bar, and unlimited soft beverages." },
  { q: "Can we taste before booking?", a: "Absolutely — this preview usually comes first, then we schedule your in-person tasting at the venue." },
];

export default function VirtualTourModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          style={{ background: "rgba(20,17,15,0.72)", backdropFilter: "blur(3px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-[560px] max-h-[88vh] overflow-y-auto rounded-3xl"
            style={{ background: "var(--color-paper)", boxShadow: "0 30px 80px -20px rgba(20,17,15,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden" style={{ height: 220, background: "linear-gradient(120deg, var(--color-ink) 0%, #3a2410 55%, #6b3a12 100%)" }}>
              <button onClick={onClose} className="absolute top-3 right-3 z-10 rounded-full p-1.5" style={{ background: "rgba(0,0,0,0.3)" }}>
                <X size={17} color="var(--color-paper)" />
              </button>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 z-10" style={{ background: "rgba(0,0,0,0.35)" }}>
                <Compass size={12} color="var(--color-gold-soft)" />
                <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--color-gold-soft)" }}>360° Kitchen Preview</span>
              </div>

              <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: "repeating-linear-gradient(100deg, transparent 0px, transparent 60px, rgba(201,162,39,0.25) 61px, transparent 62px)",
                }}
                animate={{ backgroundPositionX: ["0px", "400px"] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />

              {HOTSPOTS.map((h, i) => (
                <motion.div
                  key={h.label}
                  className="absolute bottom-8 flex flex-col items-center"
                  style={{ left: h.x }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="relative flex items-center justify-center rounded-full mb-1.5" style={{ width: 34, height: 34, background: "rgba(201,162,39,0.22)", border: "1.5px solid var(--color-gold-soft)" }}>
                    <span className="pulse-ring absolute rounded-full" style={{ width: 34, height: 34, color: "var(--color-gold-soft)" }} />
                    <h.Icon size={15} color="var(--color-gold-soft)" />
                  </div>
                  <span className="font-mono text-[8.5px] uppercase tracking-wide text-center max-w-[80px] leading-tight" style={{ color: "var(--color-ivory)" }}>{h.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="p-6">
              <div className="font-serif text-[19px] mb-1" style={{ color: "var(--color-ink)" }}>Virtual Kitchen Tour</div>
              <p className="font-body text-[12.5px] leading-relaxed mb-5" style={{ color: "var(--color-stone)" }}>
                Most venues only show halls. Cherish's kitchen is the actual reason people book — this preview travels to a lead's phone the moment they ask, days before the in-person tasting.
              </p>

              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={14} style={{ color: "var(--color-gold-deep)" }} />
                <span className="font-serif text-[14px]" style={{ color: "var(--color-ink)" }}>AI Menu Concierge</span>
                <span className="font-mono text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5" style={{ background: "var(--color-ivory-soft)", color: "var(--color-stone)" }}>Answers 24/7</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {MENU_QA.map((qa, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 font-body text-[12px]" style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}>
                      {qa.q}
                    </div>
                    <div className="self-start max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2 font-body text-[12px] leading-relaxed" style={{ background: "var(--color-ivory)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}>
                      {qa.a}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center font-body text-[10.5px] mt-4" style={{ color: "var(--color-stone)" }}>
                Simulated preview · a real tour is a one-time capture, reused across every lead
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
