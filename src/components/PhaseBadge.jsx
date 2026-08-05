import { Lock, Map } from "lucide-react";
import { PHASE_META } from "../data/leads";

const PHASE_STYLE = {
  2: { Icon: Lock, text: "Phase 2 — Proposed" },
  3: { Icon: Map, text: "Phase 3 — Roadmap" },
};

export default function PhaseBadge({ phase, size = "sm" }) {
  const style = PHASE_STYLE[phase];
  if (!style || !PHASE_META[phase]) return null;
  const { Icon, text } = style;
  const pad = size === "sm" ? "px-2 py-0.5 text-[9.5px]" : "px-2.5 py-1 text-[10.5px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono uppercase tracking-wider ${pad}`}
      style={{ background: "var(--color-ivory-soft)", color: "var(--color-stone)" }}
      title={PHASE_META[phase].desc}
    >
      <Icon size={size === "sm" ? 9 : 10.5} />
      {text}
    </span>
  );
}
