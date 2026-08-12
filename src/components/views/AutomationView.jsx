import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, Bot, ArrowUpRight, PhoneCall, Check, Hourglass,
  Pencil, HeartHandshake, Hash, FileText, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  LEADS, STAGES, SOURCE_META, AI_CALL_LOG, AI_CALLER_NUMBER, OWNER_BY_SOURCE,
  queuedForAICall, leadOwner, allMessageTemplates,
} from "../../data/leads";
import Avatar from "../Avatar";

const REF_VB_W = 760;
const REF_VB_H = 380;
const REF_ROOT_X = 110;
const REF_CHILD_X = [560, 590];

function useReferralGraph() {
  return useMemo(() => {
    const roots = LEADS.filter((l) => l.rootFamily);
    const byRoot = Object.fromEntries(roots.map((r) => [r.name, LEADS.filter((l) => l.ref === r.name)]));
    const bandH = REF_VB_H / roots.length;
    const nodes = [];
    const edges = [];
    roots.forEach((root, i) => {
      const bandTop = i * bandH;
      const rootY = bandTop + bandH / 2;
      nodes.push({ ...root, x: REF_ROOT_X, y: rootY });
      const kids = byRoot[root.name] || [];
      kids.forEach((kid, ki) => {
        const pad = bandH * 0.2;
        const usable = bandH - pad * 2;
        const y = kids.length === 1 ? rootY : bandTop + pad + (usable * ki) / (kids.length - 1);
        const kidNode = { ...kid, x: REF_CHILD_X[ki % 2], y };
        nodes.push(kidNode);
        edges.push({ id: kid.id, parentName: root.name, x1: REF_ROOT_X, y1: rootY, x2: kidNode.x, y2: y });
      });
    });
    return { nodes, edges, roots };
  }, []);
}

export default function AutomationView({ openLead, onAIVoiceCall, viewer = "Aman" }) {
  const [refHover, setRefHover] = useState(null);
  const { nodes: refNodes, edges: refEdges, roots: refRoots } = useReferralGraph();
  const refTotalReferred = refNodes.length - refRoots.length;
  const refBooked = refNodes.filter((n) => n.stage === "booked").length;
  const anniversaryLead = LEADS.find((l) => l.anniversary);
  const pastReferrals = anniversaryLead ? LEADS.filter((l) => l.ref === anniversaryLead.name) : [];
  const isRefDimmed = (n) => {
    if (!refHover) return false;
    if (n.name === refHover) return false;
    if (n.ref === refHover) return false;
    return true;
  };
  const myLeads = LEADS.filter((l) => leadOwner(l) === viewer);
  const nurtureLead = myLeads.find((l) => l.nurtureStep !== undefined) || myLeads[0];
  const queued = queuedForAICall().filter((l) => leadOwner(l) === viewer);
  const myCallLog = AI_CALL_LOG.filter((e) => {
    const l = LEADS.find((lead) => lead.name === e.leadName);
    return l && leadOwner(l) === viewer;
  });
  const [openTemplateId, setOpenTemplateId] = useState(null);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateOverrides, setTemplateOverrides] = useState({});
  const [savedTemplateId, setSavedTemplateId] = useState(null);
  const [expandedCall, setExpandedCall] = useState(null);
  const templates = allMessageTemplates(nurtureLead);
  const mySources = Object.keys(OWNER_BY_SOURCE).filter((s) => OWNER_BY_SOURCE[s] === viewer);

  return (
    <div>
      <h1 className="font-serif text-[27px] mb-5" style={{ color: "var(--color-ink)" }}>Cherish Copilot</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Hash size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Number System</div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] rounded-full px-2.5 py-1.5" style={{ background: "rgba(201,162,39,0.12)", color: "var(--color-gold-deep)" }}>
              <PhoneCall size={11} /> {AI_CALLER_NUMBER}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-wide rounded-full px-2 py-1" style={{ border: "1px solid var(--color-stone-line)", color: "var(--color-stone)" }}>
              Voice-cloned per owner
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wide rounded-full px-2.5 py-1.5" style={{ background: "rgba(178,58,72,0.1)", color: "var(--color-rose)" }}>
              <MessageCircle size={10} /> Today · {viewer}'s WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wide rounded-full px-2.5 py-1.5" style={{ background: "rgba(31,77,61,0.1)", color: "var(--color-emerald)" }}>
              Proposed · Business API
            </span>
          </div>

          <div className="font-mono text-[9px] uppercase tracking-wider mb-1.5" style={{ color: "var(--color-stone)" }}>
            {viewer}'s channels, routed to this voice
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mySources.map((s) => (
              <span key={s} className="font-mono text-[9.5px] rounded-full px-2 py-1" style={{ background: "rgba(201,162,39,0.1)", color: "var(--color-gold-deep)" }}>
                {SOURCE_META[s]?.label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <FileText size={15} style={{ color: "var(--color-gold-deep)" }} />
            <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Message Templates</div>
          </div>
          <p className="font-body text-[11.5px] mb-3" style={{ color: "var(--color-stone)" }}>
            Previewed against {nurtureLead.name}. Tap to edit.
          </p>
          <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
            {templates.map((t) => {
              const isOpen = openTemplateId === t.id;
              const isEditing = editingTemplateId === t.id;
              const text = templateOverrides[t.id] ?? t.text;
              return (
                <div key={t.id}>
                  <button
                    onClick={() => setOpenTemplateId(isOpen ? null : t.id)}
                    className="w-full flex items-center justify-between gap-2 rounded-full px-3.5 py-2"
                    style={{ background: "var(--color-ivory)" }}
                  >
                    <span className="font-body text-[11.5px] font-medium truncate" style={{ color: "var(--color-ink)" }}>{t.label}</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[8.5px] uppercase tracking-wide rounded-full px-1.5 py-0.5" style={{ border: "1px solid var(--color-stone-line)", color: "var(--color-stone)" }}>
                        {t.channel}
                      </span>
                      {isOpen ? <ChevronUp size={12} style={{ color: "var(--color-stone)" }} /> : <ChevronDown size={12} style={{ color: "var(--color-stone)" }} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="rounded-xl px-3.5 py-3 mt-1.5" style={{ background: "rgba(201,162,39,0.08)" }}>
                      {isEditing ? (
                        <textarea
                          value={text}
                          onChange={(e) => setTemplateOverrides((o) => ({ ...o, [t.id]: e.target.value }))}
                          rows={3}
                          className="w-full rounded-lg px-2.5 py-2 text-[11.5px] outline-none resize-none"
                          style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)", color: "var(--color-ink)" }}
                        />
                      ) : (
                        <p className="font-body text-[11.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>{text}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            if (isEditing) { setSavedTemplateId(t.id); setTimeout(() => setSavedTemplateId((id) => (id === t.id ? null : id)), 1800); }
                            setEditingTemplateId(isEditing ? null : t.id);
                          }}
                          className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wide"
                          style={{ color: "var(--color-gold-deep)" }}
                        >
                          <Pencil size={10} /> {isEditing ? "Save" : "Edit"}
                        </button>
                        {savedTemplateId === t.id && !isEditing && (
                          <span className="flex items-center gap-1 font-mono text-[9.5px]" style={{ color: "var(--color-emerald)" }}>
                            <Check size={10} /> Saved
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        id="referral-web"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-2xl p-6 mt-5"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-stone-line)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <HeartHandshake size={15} style={{ color: "var(--color-gold-deep)" }} />
          <div className="font-serif text-[16px]" style={{ color: "var(--color-ink)" }}>Referral Web</div>
        </div>
        <p className="font-body text-[12px] mb-4" style={{ color: "var(--color-stone)" }}>
          {refRoots.length} root families · {refTotalReferred} referred · {refBooked} booked — the channel Event Co. leads cost you 50% to buy.
        </p>

        <div className="rounded-3xl p-6 md:p-8" style={{ background: "linear-gradient(160deg, var(--color-ink) 0%, #1a1512 100%)" }}>
          <svg width="100%" height="420" viewBox={`0 0 ${REF_VB_W} ${REF_VB_H}`}>
            <defs>
              <linearGradient id="thread" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.75" />
              </linearGradient>
              <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {refEdges.map((e, i) => {
              const dimmed = refHover && refHover !== e.id && refHover !== e.parentName;
              return (
                <motion.path
                  key={e.id}
                  d={`M ${e.x1} ${e.y1} C ${(e.x1 + e.x2) / 2} ${e.y1}, ${(e.x1 + e.x2) / 2} ${e.y2}, ${e.x2} ${e.y2}`}
                  stroke="url(#thread)"
                  strokeWidth={dimmed ? 1 : 1.8}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: dimmed ? 0.25 : 1 }}
                  transition={{ pathLength: { duration: 1, delay: i * 0.12, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
                />
              );
            })}

            {refNodes.map((n, i) => {
              const dimmed = isRefDimmed(n);
              const status = n.milestone || STAGES.find((s) => s.id === n.stage)?.label || n.stage;
              return (
                <motion.g
                  key={n.id}
                  style={{ x: n.x, y: n.y, cursor: "pointer" }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                  onMouseEnter={() => setRefHover(n.rootFamily ? n.name : n.ref)}
                  onMouseLeave={() => setRefHover(null)}
                  onClick={() => openLead(n)}
                >
                  {n.rootFamily && <circle r={18} fill="url(#rootGlow)" />}
                  <circle
                    r={n.rootFamily ? 8 : 5.5}
                    fill={n.rootFamily ? "var(--color-gold)" : "var(--color-paper)"}
                    stroke={n.rootFamily ? "var(--color-gold-soft)" : "var(--color-stone)"}
                    strokeWidth="1.2"
                  />
                  <text x={n.rootFamily ? 15 : 11} y={4} fontFamily="Inter" fontSize="12.5" fontWeight={n.rootFamily ? 700 : 500} fill="var(--color-paper)">
                    {n.name}
                  </text>
                  <text x={n.rootFamily ? 15 : 11} y={18} fontFamily="JetBrains Mono" fontSize="9.5" fill="var(--color-stone)">
                    {status}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap gap-5 mt-5 font-body text-[12px]" style={{ color: "var(--color-stone)" }}>
          <span className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 9, height: 9, background: "var(--color-gold)" }} />
            Root family (originated the chain)
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 9, height: 9, border: "1.5px solid var(--color-stone)", background: "var(--color-paper)" }} />
            Referred lead — hover to trace, click to open
          </span>
        </div>

        {anniversaryLead && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => openLead(anniversaryLead)}
            className="w-full mt-5 rounded-2xl p-5 text-left flex items-start gap-4"
            style={{ background: "var(--color-ivory)", border: "1.5px dashed var(--color-stone-line)" }}
          >
            <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ background: "rgba(201,162,39,0.12)" }}>
              <HeartHandshake size={17} style={{ color: "var(--color-gold-deep)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Avatar initials={anniversaryLead.initials} source={anniversaryLead.source} size={22} />
                <span className="font-serif text-[15px]" style={{ color: "var(--color-ink)" }}>{anniversaryLead.name} — {anniversaryLead.anniversary.label}</span>
              </div>
              <div className="font-body text-[12.5px] mt-1.5" style={{ color: "var(--color-stone)" }}>
                {anniversaryLead.anniversary.when} — reconnection note, not a pitch. {pastReferrals.length > 0
                  ? `Already referred ${pastReferrals[0].name}.`
                  : "Where referrals start — worth a personal line."}
              </div>
              <div className="flex items-center gap-1.5 mt-2 font-mono text-[10.5px] uppercase tracking-wide" style={{ color: "var(--color-gold-deep)" }}>
                Open thread <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-6 mt-5"
        style={{ background: "var(--color-ink)" }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Bot size={15} style={{ color: "var(--color-gold-soft)" }} />
          <div className="font-serif text-[16px]" style={{ color: "var(--color-paper)" }}>AI Voice Follow-up — Call Log</div>
        </div>
        <p className="font-body text-[12px] mb-2" style={{ color: "var(--color-stone)" }}>
          Hindi/Hinglish voice, cloned per owner, calls 24–48h after the walkthrough. Hesitation routes to a human.
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5" style={{ background: "rgba(255,255,255,0.05)" }}>
          <PhoneCall size={10} style={{ color: "var(--color-gold-soft)" }} />
          <span className="font-mono text-[9.5px]" style={{ color: "var(--color-stone)" }}>Always from {AI_CALLER_NUMBER} — never a personal number</span>
        </div>

        <div className="flex items-center gap-6 mb-4 pb-4 flex-wrap" style={{ borderBottom: "1px solid var(--color-ink-line)" }}>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-paper)" }}>{myCallLog.length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Called</div>
          </div>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-gold-soft)" }}>{myCallLog.filter((e) => e.tone !== "positive").length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Routed to a human</div>
          </div>
          <div>
            <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-emerald-soft)" }}>{queued.length}</div>
            <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Queued, not yet called</div>
          </div>
          {myCallLog.length > 0 && (
            <div>
              <div className="font-serif text-[22px] leading-none" style={{ color: "var(--color-paper)" }}>
                {(() => {
                  const secs = myCallLog.map((e) => { const [m, s] = (e.duration || "0:00").split(":").map(Number); return m * 60 + s; });
                  const avg = Math.round(secs.reduce((a, b) => a + b, 0) / secs.length);
                  return `${Math.floor(avg / 60)}:${String(avg % 60).padStart(2, "0")}`;
                })()}
              </div>
              <div className="font-mono text-[9.5px] uppercase mt-1" style={{ color: "var(--color-stone)" }}>Avg call duration</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-wider mb-2" style={{ color: "var(--color-stone)" }}>What happened</div>
            <div className="flex flex-col gap-2">
              {myCallLog.map((entry) => {
                const callLead = LEADS.find((l) => l.name === entry.leadName);
                if (!callLead) return null;
                const positive = entry.tone === "positive";
                const sentimentColor = { positive: "var(--color-emerald-soft)", neutral: "var(--color-stone)", negative: "var(--color-rose-soft)" }[entry.sentiment];
                const sentimentBg = { positive: "rgba(61,120,99,0.18)", neutral: "rgba(255,255,255,0.06)", negative: "rgba(178,58,72,0.18)" }[entry.sentiment];
                const isOpen = expandedCall === entry.leadName;
                return (
                  <div key={entry.leadName} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${positive ? "rgba(31,77,61,0.4)" : "rgba(201,162,39,0.25)"}` }}>
                    <button
                      onClick={() => setExpandedCall(isOpen ? null : entry.leadName)}
                      className="w-full flex items-center gap-3 p-3.5 text-left"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <Avatar initials={callLead.initials} source={callLead.source} size={28} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[12px]" style={{ color: "var(--color-paper)" }}>{callLead.name}</div>
                        <div className="font-body text-[10.5px] truncate" style={{ color: positive ? "var(--color-emerald-soft)" : "var(--color-gold-soft)" }}>{entry.outcomeLabel}</div>
                      </div>
                      {entry.duration && (
                        <span className="font-mono text-[9.5px] shrink-0" style={{ color: "var(--color-stone)" }}>{entry.duration}</span>
                      )}
                      {entry.sentiment && (
                        <span className="font-mono text-[8px] uppercase tracking-wide rounded-full px-1.5 py-0.5 shrink-0" style={{ background: sentimentBg, color: sentimentColor }}>
                          {entry.sentiment}
                        </span>
                      )}
                      <span className="font-mono text-[9px] uppercase shrink-0" style={{ color: "var(--color-stone)" }}>{leadOwner(callLead)}'s voice</span>
                      {isOpen ? <ChevronUp size={13} style={{ color: "var(--color-stone)" }} /> : <ChevronDown size={13} style={{ color: "var(--color-stone)" }} />}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 flex flex-col gap-2">
                        {entry.script.map((line, i) => (
                          <div
                            key={i}
                            className="max-w-[85%] rounded-xl px-3 py-2"
                            style={{
                              alignSelf: line.from === "ai" ? "flex-start" : "flex-end",
                              background: line.from === "ai" ? "rgba(255,255,255,0.05)" : "rgba(201,162,39,0.14)",
                            }}
                          >
                            <div className="font-mono text-[8px] uppercase tracking-wide mb-0.5" style={{ color: line.from === "ai" ? "var(--color-stone)" : "var(--color-gold-soft)" }}>
                              {line.from === "ai" ? "AI" : callLead.name.split(" ")[0]}
                            </div>
                            <div className="font-body text-[11.5px] leading-relaxed" style={{ color: "var(--color-ivory)" }}>{line.text}</div>
                          </div>
                        ))}
                        {entry.transfer && (
                          <div className="rounded-xl px-3 py-2 font-body text-[11px] italic" style={{ background: "rgba(178,58,72,0.12)", color: "var(--color-rose-soft)" }}>
                            {entry.transfer.line}
                          </div>
                        )}
                        <button
                          onClick={() => onAIVoiceCall(callLead, entry.script, entry.outcomeDetail, entry.transfer)}
                          className="flex items-center gap-1.5 self-start mt-1 font-mono text-[9.5px] uppercase tracking-wide"
                          style={{ color: "var(--color-gold-soft)" }}
                        >
                          <PhoneCall size={11} /> Open full replay
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Hourglass size={11} style={{ color: "var(--color-stone)" }} />
              <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: "var(--color-stone)" }}>What's not happening yet</span>
            </div>
            {queued.length > 0 ? (
              <div className="flex flex-col gap-2">
                {queued.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => openLead(lead)}
                    className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.14)" }}
                  >
                    <Avatar initials={lead.initials} source={lead.source} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12px]" style={{ color: "var(--color-paper)" }}>{lead.name}</div>
                      <div className="font-body text-[10.5px] truncate" style={{ color: "var(--color-stone)" }}>Visited — eligible, waiting on a call</div>
                    </div>
                    <span className="font-mono text-[9px] uppercase shrink-0" style={{ color: "var(--color-stone)" }}>{leadOwner(lead)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="font-body text-[12px] leading-relaxed" style={{ color: "var(--color-stone)" }}>
                Everyone past their walkthrough has already been called.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
