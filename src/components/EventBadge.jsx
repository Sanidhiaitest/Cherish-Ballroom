import { EVENT_TYPE_META } from "../data/leads";

export default function EventBadge({ eventType }) {
  const label = EVENT_TYPE_META[eventType]?.label || "—";
  return (
    <span
      className="inline-block font-mono text-[8.5px] uppercase tracking-wide rounded-full px-1.5 py-0.5 w-fit"
      style={{ border: "1px solid var(--color-stone-line)", color: "var(--color-stone)" }}
    >
      {label}
    </span>
  );
}
