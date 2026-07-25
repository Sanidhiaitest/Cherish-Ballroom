import { sourceColor } from "./SourceTag";

export default function Avatar({ initials, source, size = 38 }) {
  const color = sourceColor(source);
  return (
    <div
      className="flex items-center justify-center rounded-full font-serif shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        color: "var(--color-paper)",
        background: `linear-gradient(140deg, ${color}, var(--color-ink-soft))`,
        boxShadow: `0 0 0 2px var(--color-paper), 0 2px 8px -2px ${color}66`,
      }}
    >
      {initials}
    </div>
  );
}
