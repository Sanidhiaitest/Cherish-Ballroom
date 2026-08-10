// The dashboard's mascot — a small glossy cloud character, blue fading to
// blush pink. Same character everywhere it appears; only size/position change.
export default function Mascot({ size = 84, className = "", style }) {
  return (
    <div className={className} style={{ width: size, height: size, ...style }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="mascotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="52%" stopColor="#93B7FA" />
            <stop offset="78%" stopColor="#F1A6CE" />
            <stop offset="100%" stopColor="#F080B0" />
          </linearGradient>
          <radialGradient id="mascotShine" cx="30%" cy="22%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="60" cy="107" rx="28" ry="5.5" fill="#000" opacity="0.14" />

        <g className="mascot-body">
          <circle cx="33" cy="47" r="21" fill="url(#mascotBody)" />
          <circle cx="87" cy="47" r="21" fill="url(#mascotBody)" />
          <circle cx="60" cy="33" r="23" fill="url(#mascotBody)" />
          <circle cx="25" cy="69" r="19" fill="url(#mascotBody)" />
          <circle cx="95" cy="69" r="19" fill="url(#mascotBody)" />
          <rect x="21" y="47" width="78" height="45" rx="22.5" fill="url(#mascotBody)" />
          <circle cx="33" cy="47" r="21" fill="url(#mascotShine)" />

          <g className="mascot-eyes">
            <ellipse cx="46" cy="64" rx="8.6" ry="10.5" fill="#fff" />
            <ellipse cx="76" cy="64" rx="8.6" ry="10.5" fill="#fff" />
            <circle cx="47.4" cy="66.4" r="4.9" fill="#1c1c22" />
            <circle cx="77.4" cy="66.4" r="4.9" fill="#1c1c22" />
            <circle cx="49.3" cy="63.8" r="1.5" fill="#fff" />
            <circle cx="79.3" cy="63.8" r="1.5" fill="#fff" />
          </g>
        </g>
      </svg>
    </div>
  );
}
