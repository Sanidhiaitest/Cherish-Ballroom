import { Search, Bell, Smartphone } from "lucide-react";
import Avatar from "./Avatar";

const VIEWERS = { Aman: { initials: "AK", role: "Sales Manager" }, Harman: { initials: "HS", role: "Sales Manager" } };

export default function Topbar({ viewer = "Aman", setViewer, onPreviewCoupleApp }) {
  return (
    <div className="flex items-center gap-4 px-5 md:px-10 py-5 shrink-0">
      <div
        className="flex-1 max-w-md flex items-center gap-2.5 rounded-full px-4 py-2.5"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <Search size={15} style={{ color: "var(--color-stone)" }} />
        <input
          placeholder="Search leads, families, halls…"
          className="flex-1 bg-transparent outline-none text-[13px] font-body placeholder:text-stone"
          style={{ color: "var(--color-ink)" }}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={onPreviewCoupleApp}
          className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2.5 font-medium text-[12.5px] transition-transform hover:scale-[1.02] active:scale-95 shrink-0 whitespace-nowrap"
          style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
        >
          <Smartphone size={14} style={{ color: "var(--color-gold-soft)" }} />
          <span className="hidden md:inline">Preview couple's app</span>
          <span className="md:hidden">Couple's app</span>
        </button>
        <button
          onClick={onPreviewCoupleApp}
          className="sm:hidden flex items-center justify-center rounded-full w-10 h-10 shrink-0"
          style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
          aria-label="Preview couple's app"
        >
          <Smartphone size={15} style={{ color: "var(--color-gold-soft)" }} />
        </button>

        <button
          className="relative flex items-center justify-center rounded-full w-10 h-10 transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <Bell size={16} style={{ color: "var(--color-ink)" }} />
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full font-mono font-bold"
            style={{ width: 16, height: 16, fontSize: 9, background: "var(--color-rose)", color: "var(--color-paper)" }}
          >
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5 rounded-full pl-1.5 pr-1.5 py-1.5" style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}>
          <Avatar initials={VIEWERS[viewer].initials} source="walkin" size={30} />
          <div className="text-left hidden sm:block">
            <div className="text-[12.5px] font-semibold leading-none" style={{ color: "var(--color-ink)" }}>{viewer}</div>
            <div className="text-[10.5px] font-mono mt-0.5" style={{ color: "var(--color-stone)" }}>{VIEWERS[viewer].role}</div>
          </div>
          <div className="flex gap-0.5 rounded-full p-0.5 ml-1" style={{ background: "var(--color-ivory-soft)" }}>
            {Object.keys(VIEWERS).map((name) => (
              <button
                key={name}
                onClick={() => setViewer?.(name)}
                className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors"
                style={{ background: viewer === name ? "var(--color-ink)" : "transparent", color: viewer === name ? "var(--color-paper)" : "var(--color-stone)" }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
