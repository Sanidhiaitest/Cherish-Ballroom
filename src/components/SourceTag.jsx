import { Camera, Users, Building2 } from "lucide-react";

const SOURCE_STYLE = {
  instagram: { label: "Instagram", Icon: Camera, text: "text-gold-deep", bg: "bg-gold/12", ring: "ring-gold/25" },
  reference: { label: "Reference", Icon: Users, text: "text-emerald", bg: "bg-emerald/10", ring: "ring-emerald/25" },
  eventco: { label: "Event Co.", Icon: Building2, text: "text-rose", bg: "bg-rose/10", ring: "ring-rose/25" },
};

export function sourceColor(source) {
  return { instagram: "var(--color-gold)", reference: "var(--color-emerald)", eventco: "var(--color-rose)" }[source];
}

export default function SourceTag({ source, size = "sm" }) {
  const s = SOURCE_STYLE[source];
  const Icon = s.Icon;
  const pad = size === "sm" ? "px-2 py-[3px] text-[10.5px]" : "px-2.5 py-1 text-[11.5px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-wider font-medium ring-1 ${s.bg} ${s.text} ${s.ring} ${pad}`}
    >
      <Icon size={size === "sm" ? 10 : 11.5} strokeWidth={2.5} />
      {s.label}
    </span>
  );
}
