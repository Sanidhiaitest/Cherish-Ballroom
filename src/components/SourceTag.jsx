import { Megaphone, Search, Heart, Building2, Users, FileSpreadsheet } from "lucide-react";
import { SOURCE_META } from "../data/leads";

const SOURCE_STYLE = {
  meta_ads: { Icon: Megaphone, text: "text-gold-deep", bg: "bg-gold/12", ring: "ring-gold/25" },
  google_ads: { Icon: Search, text: "text-gold-deep", bg: "bg-gold-deep/12", ring: "ring-gold-deep/25" },
  wedmegood: { Icon: Heart, text: "text-rose", bg: "bg-rose/10", ring: "ring-rose/25" },
  eventco: { Icon: Building2, text: "text-stone", bg: "bg-stone/10", ring: "ring-stone/25" },
  walkin: { Icon: Users, text: "text-emerald", bg: "bg-emerald/10", ring: "ring-emerald/25" },
  sheet: { Icon: FileSpreadsheet, text: "text-gold-deep", bg: "bg-gold/12", ring: "ring-gold/25" },
};

export function sourceColor(source) {
  return {
    meta_ads: "var(--color-gold)",
    google_ads: "var(--color-gold-deep)",
    wedmegood: "var(--color-rose)",
    eventco: "var(--color-stone)",
    walkin: "var(--color-emerald)",
    sheet: "var(--color-gold-deep)",
  }[source];
}

export default function SourceTag({ source, size = "sm" }) {
  const s = SOURCE_STYLE[source];
  const Icon = s.Icon;
  const label = SOURCE_META[source]?.label || source;
  const pad = size === "sm" ? "px-2 py-[3px] text-[10.5px]" : "px-2.5 py-1 text-[11.5px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-wider font-medium ring-1 ${s.bg} ${s.text} ${s.ring} ${pad}`}
    >
      <Icon size={size === "sm" ? 10 : 11.5} strokeWidth={2.5} />
      {label}
    </span>
  );
}
