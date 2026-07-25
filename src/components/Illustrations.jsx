// Hand-drawn line-art flourishes in the brand's gold thread — decorative only.

export function ChandelierMotif({ opacity = 0.08, width = 200 }) {
  return (
    <svg width={width} viewBox="0 0 200 260" fill="none" style={{ opacity }}>
      <path d="M100 6 V26" stroke="var(--color-gold)" strokeWidth="1.2" />
      <path d="M40 26 H160" stroke="var(--color-gold)" strokeWidth="1.2" />
      <path d="M40 26 C 30 60, 40 80, 100 84 C 160 80, 170 60, 160 26" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
      <path d="M60 26 C 55 50, 62 66, 100 70 C 138 66, 145 50, 140 26" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
      {[40, 66, 100, 134, 160].map((x, i) => (
        <g key={i}>
          <path d={`M${x} ${26 + (i % 2) * 4} V ${100 + (i % 2 === 0 ? 20 : 0)}`} stroke="var(--color-gold)" strokeWidth="0.8" />
          <circle cx={x} cy={100 + (i % 2 === 0 ? 20 : 0)} r={3.2} fill="var(--color-gold)" />
        </g>
      ))}
      <circle cx="100" cy="84" r="5" fill="var(--color-gold)" />
    </svg>
  );
}

export function FloralSprig({ opacity = 0.5, width = 120, color = "var(--color-gold)" }) {
  return (
    <svg width={width} viewBox="0 0 120 160" fill="none" style={{ opacity }}>
      <path d="M60 156 C 58 100, 66 60, 60 6" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {[
        { y: 30, dir: 1 }, { y: 55, dir: -1 }, { y: 82, dir: 1 }, { y: 110, dir: -1 },
      ].map((leaf, i) => (
        <path
          key={i}
          d={`M60 ${leaf.y} C ${60 + leaf.dir * 26} ${leaf.y - 6}, ${60 + leaf.dir * 30} ${leaf.y + 14}, 60 ${leaf.y + 22}`}
          stroke={color}
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <circle cx="60" cy="10" r="4.5" fill={color} opacity="0.9" />
      <circle cx="60" cy="6" r="2.4" fill={color} />
    </svg>
  );
}
