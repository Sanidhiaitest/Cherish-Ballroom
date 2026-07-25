import { scoreTone } from "../data/leads";

const TONE_COLOR = { hot: "var(--color-gold)", warm: "var(--color-emerald-soft)", cold: "var(--color-stone)" };

export default function ScoreRing({ score, size = 44, strokeWidth = 3.5 }) {
  const { tone } = scoreTone(score);
  const color = TONE_COLOR[tone];
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-stone-line)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono font-bold"
        style={{ color, fontSize: size * 0.3 }}
      >
        {score}
      </div>
    </div>
  );
}
