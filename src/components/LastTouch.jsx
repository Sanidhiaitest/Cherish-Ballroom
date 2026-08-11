export default function LastTouch({ days, stale }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: stale ? "var(--color-rose)" : "var(--color-stone)" }}>
      {stale && (
        <span className="relative flex items-center justify-center shrink-0" style={{ width: 6, height: 6 }}>
          <span className="absolute inline-flex rounded-full opacity-60" style={{ width: 6, height: 6, background: "var(--color-rose)" }} />
          <span className="pulse-ring absolute rounded-full" style={{ width: 6, height: 6, color: "var(--color-rose)" }} />
        </span>
      )}
      {days === 0 ? "Today" : `${days}d ago`}
    </span>
  );
}
