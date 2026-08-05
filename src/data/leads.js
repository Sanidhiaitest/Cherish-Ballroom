// Source taxonomy rebuilt from the real discovery calls (Naveen/Kritika/Aman/Harman),
// not the earlier research-based guess. Two channel types, matching how Naveen
// actually described the business:
//   Indirect — paid + aggregator-mediated (Google Ads, Meta/Instagram Ads, WedMeGood,
//     other aggregators, event-management partners) — confirmed ~70% of volume.
//   Direct — walk-ins and unincentivized word-of-mouth (including guests who refer
//     someone). Naveen was explicit this is NOT a formal referral program — no
//     incentive structure exists today, it's people who liked the venue and came back
//     or told someone. Referral-chain leads (`ref` set) are Direct for this reason.
export const SOURCE_META = {
  meta_ads: { label: "Meta / Instagram Ads", channelType: "indirect", key: "meta_ads" },
  google_ads: { label: "Google Ads", channelType: "indirect", key: "google_ads" },
  wedmegood: { label: "WedMeGood", channelType: "indirect", key: "wedmegood" },
  eventco: { label: "Event Company", channelType: "indirect", key: "eventco" },
  walkin: { label: "Walk-in / Word of Mouth", channelType: "direct", key: "walkin" },
};

export const CHANNEL_TYPE_META = {
  indirect: { label: "Indirect", desc: "Google Ads, Meta/Instagram Ads, WedMeGood, other aggregators, event partners" },
  direct: { label: "Direct", desc: "Walk-ins and word-of-mouth — unprompted, unincentivized" },
};

// Naveen's stated business-wide split from the discovery call — a separate claim from
// whatever the current 17-lead sample happens to show below. An earlier draft of this
// pitch conflated a small-sample stat with this aggregate (the disputed "34%" figure)
// and it cost credibility in the room; the two are kept explicitly distinct here so
// that never happens again.
export const CONFIRMED_CHANNEL_SPLIT = {
  indirect: 70,
  direct: 30,
  source: "Naveen, discovery call — supersedes the earlier self-corrected 34% figure",
};

export const STAGES = [
  { id: "query", label: "Query" },
  { id: "visit_scheduled", label: "Visit Scheduled" },
  { id: "visited", label: "Visited" },
  { id: "quoted", label: "Quoted" },
  { id: "followup", label: "Follow-Up" },
  { id: "booked", label: "Booked" },
];

// The team's own vocabulary for the follow-up sequence — a lead isn't marked dead
// until F4 goes unanswered. Used to label where a "followup"-stage lead actually is,
// on top of the STAGES funnel above rather than replacing it.
export const FOLLOWUP_STEPS = ["F1", "F2", "F3", "F4"];

export const TONE_COLOR = {
  hot: "var(--color-gold-deep)",
  warm: "var(--color-emerald)",
  cold: "var(--color-stone)",
};

// Phase framing carried through the whole product, not just the roadmap slide.
// Phase 1 is real and live in this build. Phase 2/3 features stay visible — the
// vision is part of the pitch — but are visibly marked "proposed" so nothing here
// overclaims what's actually running today. This directly answers the on-site
// pushback: skepticism was about voice/WhatsApp automation specifically, not
// about tracking, so the two need to look different, not identical.
export const PHASE_META = {
  1: { label: "Phase 1", tag: "Live", desc: "Lead capture, tracking, and follow-up visibility — this build." },
  2: { label: "Phase 2", tag: "Proposed", desc: "Messaging and voice copilot — reversible anytime, off until you say go." },
  3: { label: "Phase 3", tag: "Roadmap", desc: "On-property recognition and personalization — parked, not part of the opening ask." },
};

// Every lead lives in exactly one place. Referred leads point back at the
// referrer's `name` via `ref` — the Referral Web is derived from this, not
// a separate dataset, so there is never a second identity for the same family.
export const LEADS = [
  {
    id: 1, name: "Ananya & Rohit", initials: "AR", source: "meta_ads", stage: "followup",
    score: 82, days: 2, phone: "+91 98•• ••71", ref: null, hall: "Emerald Hall", guests: 450, value: 1900000,
    firstResponseSeconds: 118, nurtureStep: 2, followupStep: 2,
    commitment: { text: "Follow-up call re: budget hint (₹18–20L)", due: "Tomorrow AM" },
    aiProfile: {
      persona: "Aesthetic-First Planner",
      signals: [
        "Saved 6 reels from @cherish.ballrooms before ever DMing",
        "Follows 10+ luxury decor accounts — style-led, not just price-led",
        "Asked specifically about crystal lighting, not square footage",
      ],
      tip: "Lead with visuals, not the price sheet — resend the Emerald lighting reel before calling.",
    },
    thread: [
      { t: "Day 0, 11:42 PM", type: "dm", e: "DM'd @cherish.ballrooms reel — asked about Emerald hall availability, Dec dates." },
      { t: "Day 0, 11:44 PM", type: "ai", e: "System auto-logged guest count (450) from the DM, flagged qualified, slotted a site visit for Day 2." },
      { t: "Day 2, 4:30 PM", type: "visit", e: "Property round with Vikram (banquet mgr). Liked Emerald + crystal lighting. Budget hint: ₹18–20L." },
      { t: "Day 2, 8:10 PM", type: "note", e: "Thank-you + kitchen reel drafted, sent by Vikram." },
      { t: "Day 4", type: "alert", e: "No reply yet — F2 follow-up due tomorrow AM." },
    ],
  },
  {
    id: 2, name: "Meera Kapoor", initials: "MK", source: "walkin", stage: "quoted",
    score: 91, days: 1, phone: "+91 98•• ••90", ref: "Sharma Family", hall: "Rubicon Hall", guests: 300, value: 1650000,
    commitment: { text: "Nudge on the Rubicon quote — opened twice, no reply", due: "Tomorrow" },
    aiProfile: {
      persona: "Referral-Trusted Fast Mover",
      signals: [
        "Came in via a family that already booked — trust is pre-established, not earned cold",
        "Requested a specific hall by name on the first call, no comparison-shopping language",
      ],
      tip: "Referral trust is doing the selling here — a warm human follow-up will close this, not another nudge.",
    },
    thread: [
      { t: "Day 0", type: "call", e: "Referred by Sharma Family (booked Apr '26). Called directly, asked for Rubicon hall." },
      { t: "Day 0", type: "visit", e: "Same-day walkthrough — Naveen personally hosted (referral courtesy)." },
      { t: "Day 1", type: "quote", e: "Quote sent — Rubicon, 300 pax, full catering. Opened twice, no reply since." },
    ],
  },
  {
    id: 3, name: "The Bhatia–Singh Function", initials: "BH", source: "eventco", stage: "visited",
    score: 58, days: 4, phone: "+91 98•• ••12", ref: "Aarambh Events", hall: "Pearl Hall", guests: 200, value: 950000,
    aiProfile: {
      persona: "Planner-Mediated, Low Direct Signal",
      signals: [
        "All contact routed through Aarambh Events — no direct social footprint to read",
        "Client was quiet on-site; intent is genuinely hard to gauge without a direct channel",
      ],
      tip: "Ask the planner for a temperature check directly before investing more follow-up here.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Inbound via Aarambh Events (planner) — corporate anniversary, 200 pax." },
      { t: "Day 3", type: "visit", e: "Site round done. Planner present, client quiet — hard to read." },
      { t: "Day 4", type: "alert", e: "No quote sent yet — awaiting planner's brief." },
    ],
  },
  {
    id: 4, name: "Ishaan & Priya", initials: "IP", source: "meta_ads", stage: "visited",
    score: 74, days: 1, phone: "+91 98•• ••83", ref: null, hall: "Solitaire Hall", guests: 380, value: 1940000,
    firstResponseSeconds: 64, nurtureStep: 1,
    commitment: { text: "Tasting date — confirm and prep", due: "This week" },
    aiProfile: {
      persona: "Fast-Decision Booker",
      signals: [
        "DMed and visited the same day — low deliberation, high urgency",
        "Asked about vegetarian menu early — practical and detail-oriented, not just browsing",
      ],
      tip: "Strike while hot — offering a same-week tasting date will likely close this.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Ad click → WhatsApp. Asked about Solitaire hall + vegetarian menu." },
      { t: "Day 0", type: "visit", e: "Site visit same evening — loved the glasshouse." },
      { t: "Day 1", type: "note", e: "Tasting scheduled for next week." },
    ],
  },
  {
    id: 5, name: "Kavya Malhotra", initials: "KM", source: "walkin", stage: "booked", rootFamily: true, milestone: "Booked · Feb '27",
    score: 100, days: 0, phone: "+91 98•• ••21", ref: null, hall: "Emerald Hall", guests: 500, value: 3200000,
    aiProfile: {
      persona: "Legacy Client",
      signals: [
        "Walked in cold, no ad or aggregator — became a root referral family in her own right",
        "Booked the flagship hall at max guest count with no hesitation in-thread",
      ],
      tip: "Already converted — nurture for repeat business and referral value from here.",
    },
    thread: [
      { t: "Day -40", type: "dm", e: "Walked in cold two months ago — no ad, no aggregator. Wanted Emerald for a 500-pax winter wedding." },
      { t: "Day 0", type: "quote", e: "Booked — Emerald, Feb '27, 500 pax. Deposit confirmed." },
    ],
  },
  {
    id: 6, name: "The Chopra Wedding", initials: "CW", source: "walkin", stage: "followup",
    score: 66, days: 6, phone: "+91 98•• ••90", ref: "Kavya Malhotra", hall: "Rubicon Hall", guests: 340, value: 1630000,
    followupStep: 3,
    commitment: { text: "Overdue human call — quote gone quiet 6 days", due: "Today" },
    aiProfile: {
      persona: "Cooling Referral Lead",
      signals: [
        "Referred by a booked family but has gone quiet since the quote",
        "No digital engagement (opens, saves) logged since the site visit",
      ],
      tip: "This is exactly what Objection Radar is for — a human call is overdue, not another WhatsApp nudge.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Referred by Kavya Malhotra. Visited Rubicon + Solitaire." },
      { t: "Day 5", type: "alert", e: "Quote sent. Went quiet — 6 days, no reply. F3 due." },
    ],
  },
  {
    id: 7, name: "Rhea & Arjun", initials: "RA", source: "wedmegood", stage: "query",
    score: 40, days: 0, phone: "+91 98•• ••50", ref: null, hall: "—", guests: 0, value: 0,
    firstResponseSeconds: 41,
    aiProfile: {
      persona: "Early-Stage Researcher",
      signals: [
        "First-ever touch, no saves or comments on record yet",
        "Asked a narrow, specific question (one weekend date) rather than browsing broadly",
      ],
      tip: "Too early to push a visit — nurture with content and let intent build over the next few DMs.",
    },
    thread: [{ t: "Just now", type: "ai", e: "Enquired via WedMeGood asking about Feb weekend availability. System sent an instant acknowledgment, awaiting her reply." }],
  },
  {
    id: 8, name: "Verma Family", initials: "VF", source: "walkin", stage: "visited",
    score: 70, days: 2, phone: "+91 98•• ••47", ref: "Sharma Family", hall: "Pearl Hall", guests: 150, value: 700000,
    aiProfile: {
      persona: "Referral-Trusted Warm Lead",
      signals: [
        "Referred by a booked family for a smaller function — low-friction decision expected",
        "Visited quickly after the referral with no back-and-forth",
      ],
      tip: "Small-function referral leads convert fast on trust alone — don't over-sell the package.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Referred by Sharma Family." },
      { t: "Day 2", type: "visit", e: "Visited Pearl hall, small engagement fn." },
    ],
  },
  {
    id: 9, name: "The Corporate Gala — Nexlabs", initials: "NX", source: "eventco", stage: "quoted",
    score: 61, days: 3, phone: "+91 98•• ••04", ref: "Aarambh Events", hall: "Solitaire Hall", guests: 150, value: 780000,
    aiProfile: {
      persona: "Corporate / Planner-Mediated",
      signals: [
        "B2B decision routed via a planner — approval cycle is procedural, not emotional",
      ],
      tip: "Follow up on their internal approval timeline, not a wedding-style urgency cadence.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Via Aarambh Events — 150 pax corporate." },
      { t: "Day 3", type: "quote", e: "Quoted, awaiting internal approval on their end." },
    ],
  },
  {
    id: 10, name: "Simran Oberoi", initials: "SO", source: "meta_ads", stage: "query",
    score: 35, days: 0, phone: "+91 98•• ••29", ref: null, hall: "—", guests: 0, value: 0,
    firstResponseSeconds: 52,
    aiProfile: {
      persona: "Passive Browser",
      signals: [
        "Commented on a reel rather than DMing directly — a lower-intent entry point",
        "Guest count and budget still unclear after first contact",
      ],
      tip: "Qualify guest count and budget before investing more follow-up time here.",
    },
    thread: [{ t: "Just now", type: "ai", e: "Commented on a reel; system opened the DM thread automatically, guest count still unclear." }],
  },
  {
    id: 11, name: "The Bansal Sangeet", initials: "BN", source: "eventco", stage: "followup",
    score: 30, days: 9, phone: "+91 98•• ••01", ref: "Rang Decor Co.", hall: "Pearl Hall", guests: 220, value: 990000,
    followupStep: 4,
    aiProfile: {
      persona: "Cold Planner Lead",
      signals: [
        "Via a smaller decor partner, not a top-volume planner",
        "9 days silent, no call logged — F4 unanswered, likely already lost to a competitor",
      ],
      tip: "F4 has gone unanswered — this needs a human decision (retry once, park, or close), not a silent drop.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Via Rang Decor. Visited, quoted." },
      { t: "Day 9", type: "alert", e: "F4 unanswered — flagged for a human decision, not auto-closed." },
    ],
  },
  {
    id: 12, name: "Diya & Kabir", initials: "DK", source: "google_ads", stage: "quoted",
    score: 85, days: 1, phone: "+91 98•• ••65", ref: null, hall: "Emerald Hall", guests: 400, value: 2100000,
    firstResponseSeconds: 29, nurtureStep: 3,
    commitment: { text: "Lock a tasting date — hottest lead in the pipeline", due: "Today" },
    aiProfile: {
      persona: "Impulse Fast-Mover",
      signals: [
        "Replied to a search ad and booked a visit the same day — near-zero deliberation window",
        "Asked for a tasting date immediately after the quote — high urgency, high intent",
      ],
      tip: "Hottest lead in the pipeline right now — get a tasting date on the calendar today, not this week.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Search ad click → instant acknowledgment → same-day visit booked." },
      { t: "Day 1", type: "quote", e: "Quoted Emerald, 400 pax. Replied asking for tasting date — hot." },
    ],
  },
  {
    id: 13, name: "Sharma Family", initials: "SF", source: "walkin", stage: "booked", rootFamily: true, milestone: "Booked · Apr '26",
    score: 100, days: 0, phone: "+91 98•• ••18", ref: null, hall: "Rubicon Hall", guests: 1200, value: 6000000,
    aiProfile: {
      persona: "Legacy Anchor Family",
      signals: [
        "No ad or aggregator at all — organic walk-in, not from any paid channel Cherish tracks today",
        "Toured all 5 halls before deciding — values scale and options over speed",
      ],
      tip: "Your highest-value word-of-mouth source going forward — worth a personal relationship, not a funnel.",
    },
    thread: [
      { t: "Day -95", type: "dm", e: "Came in through the front door two seasons ago — no ad, no aggregator, just walked past on Sainik Farms road." },
      { t: "Day -60", type: "visit", e: "Toured all 5 halls before settling on Rubicon for scale — 1,200 guests, three-day function." },
      { t: "Day 0", type: "quote", e: "Booked — Rubicon, Apr '26, 1,200 pax. Full property buyout for the sangeet night." },
    ],
  },
  {
    id: 14, name: "Gill Family", initials: "GF", source: "walkin", stage: "booked", rootFamily: true, milestone: "Booked · Jan '26",
    score: 100, days: 0, phone: "+91 98•• ••63", ref: null, hall: "Pearl Hall", guests: 250, value: 1150000,
    anniversary: { label: "3rd anniversary of their first Cherish event", when: "Next month" },
    aiProfile: {
      persona: "Repeat Loyalist",
      signals: [
        "Second booking with Cherish in three years — no hesitation in-thread",
      ],
      tip: "A reconnection note around their anniversary is low-effort warmth, not a sales pitch — worth a personal line from Naveen.",
    },
    thread: [{ t: "Day 0", type: "quote", e: "Booked — Pearl, Jan '26, 250 pax. Second booking with us in three years." }],
  },
  {
    id: 15, name: "Raina Cousins", initials: "RC", source: "walkin", stage: "booked", milestone: "Booked · Nov '26",
    score: 95, days: 0, phone: "+91 98•• ••37", ref: "Kavya Malhotra", hall: "Sapphire Hall", guests: 220, value: 1200000,
    aiProfile: {
      persona: "Referral-Trusted Fast Mover",
      signals: [
        "Referred by a root family, booked the newly-opened hall on the spot",
        "Explicitly wanted something more intimate than the referrer's own event — knows her own taste",
      ],
      tip: "First booking in the new Sapphire Hall — a great case study to feature in future marketing.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Referred by Kavya Malhotra — her cousin's engagement, asked for something more intimate." },
      { t: "Day 2", type: "visit", e: "First to see the newly-opened Sapphire Hall. Booked on the spot." },
      { t: "Day 3", type: "quote", e: "Booked — Sapphire, Nov '26, 220 pax." },
    ],
  },
  {
    id: 16, name: "Sethi Family", initials: "SE", source: "walkin", stage: "query",
    score: 25, days: 0, phone: "+91 98•• ••82", ref: "Gill Family", hall: "—", guests: 0, value: 0,
    aiProfile: {
      persona: "Early-Stage Referral",
      signals: [
        "Just referred, very early — only asked about date availability so far",
      ],
      tip: "Nurture gently — referral trust means there's no rush to close.",
    },
    thread: [{ t: "Just now", type: "dm", e: "Referred by Gill Family — early days, just asked what dates are open next winter." }],
  },
  {
    id: 17, name: "Naina Chawla", initials: "NC", source: "meta_ads", stage: "query",
    score: 38, days: 0, phone: "+91 98•• ••56", ref: null, hall: "—", guests: 0, value: 0,
    firstResponseSeconds: 35,
    aiProfile: {
      persona: "Aesthetic-First Silent Browser",
      signals: [
        "Saved 4 reels this week before ever sending a DM — classic Gen-Z silent-touchpoint behavior",
        "This is the half-closed-deal pattern: she'd already decided she liked Cherish before saying a word",
      ],
      tip: "Treat this as warm, not cold — she's done her homework. Don't restart the conversation from zero.",
    },
    thread: [{ t: "Just now", type: "ai", e: "Saved 4 reels this week before DMing today. System flagged as a warm silent-browser, not a cold query." }],
  },
];

export const WEEKLY_LEAD_TREND = [
  { label: "Mon", value: 3 }, { label: "Tue", value: 5 }, { label: "Wed", value: 4 },
  { label: "Thu", value: 7 }, { label: "Fri", value: 6 }, { label: "Sat", value: 9 }, { label: "Sun", value: 8 },
];

export const BOOKINGS_TREND = [
  { label: "Feb", value: 2 }, { label: "Mar", value: 3 }, { label: "Apr", value: 2 },
  { label: "May", value: 4 }, { label: "Jun", value: 3 }, { label: "Jul", value: 4 },
];

export const MONTHLY_BOOKING_GOAL = 15000000;

export const REVIEWS = [
  { id: 1, platform: "WedMeGood", author: "Priyanka S.", rating: 5, sentiment: "positive", text: "The Emerald hall + food tasting sealed the deal for us. Naveen ji personally checked in twice.", flagged: false },
  { id: 2, platform: "Google", author: "Rohan M.", rating: 5, sentiment: "positive", text: "Best banquet in Vasant Kunj, hands down. Valet + guest rooms made it effortless for our 400 guests.", flagged: false },
  { id: 3, platform: "Instagram", author: "@wedding.diaries.del", rating: 2, sentiment: "negative", text: "Asked about weekend availability twice in DMs, no response for 3 days. Went with another venue.", flagged: true },
  { id: 4, platform: "WedMeGood", author: "Ankita & Dev", rating: 4, sentiment: "positive", text: "Gorgeous venue, slightly slow on quote turnaround but worth the wait.", flagged: false },
];

export const SAVED_REPORTS = [
  { name: "Wedding Season Report", author: "Kritika Gupta", type: "YTD" },
  { name: "Referral ROI Report", author: "Naveen Sachdeva", type: "Channel" },
  { name: "Event Co. Margin Report", author: "Kritika Gupta", type: "Partner" },
  { name: "Spring '26 Pipeline", author: "Kritika Gupta", type: "Season" },
];

export const CAMPAIGNS = [
  { name: "Winter Wedding Reel Series", platform: "Meta / Instagram", spend: 45000, leads: 18, booked: 3 },
  { name: "Diwali Sangeet Push", platform: "Meta / Instagram", spend: 30000, leads: 9, booked: 1 },
  { name: "Banquet Delhi — Search", platform: "Google Ads", spend: 60000, leads: 12, booked: 2 },
];

export const CONTENT_TRENDS = [
  { type: "post", title: "Behind-the-scenes kitchen & tasting reels", reason: "Venues showing food prep are seeing 2-3x the saves of static hall photos this quarter — plays directly to Cherish's own USP." },
  { type: "post", title: "Real couple walkthroughs, phone-shot", reason: "Gen-Z engagement skews toward authentic, unpolished clips — raw reels are out-saving produced videography right now." },
  { type: "avoid", title: "\"Limited dates available\" urgency posts", reason: "Comment sentiment on this format skews skeptical (\"pushy\") among Delhi wedding accounts this month." },
  { type: "avoid", title: "Price-first captions", reason: "Leads where price is mentioned upfront show a 40% lower visit-to-quote rate — let the tasting sell first." },
];

// From the competitive audit: every premium Delhi peer checked (Foodlink Luxury,
// Kwality Catering, and others) runs on personal WhatsApp + manual forms —
// none of the five below were found anywhere in the set.
export const COMPETITIVE_CHECKLIST = [
  "WhatsApp Business API chatbot",
  "Instant first-reply drafting",
  "AI lead tracking & scoring",
  "AI voice follow-up calls",
  "Virtual kitchen tour",
];

// Number ownership, resolved: a dedicated Cherish-branded number carries every
// AI-originated touch, voice-cloned to whichever of Aman/Harman the lead's channel
// belongs to. The guest hears "this is Aman calling from Cherish" — the voice stays
// personal, but Aman's actual personal number never touches a cold lead. Handoff to
// a human can stay on the Cherish number or move to a direct line, by their choice,
// once the lead is already warm.
export const AI_CALLER_NUMBER = "+91 11 4900 0100";

// Today, an aggregator drops an Excel/Google Sheet into a WhatsApp group and
// someone retypes it into the team's own F1-F4 working sheet by hand before a
// single lead can be called. This is the one line in the product that names
// that gap — the actual live-sheet ingestion is being designed separately,
// this just states what it replaces.
export const DATA_INTAKE_TODAY = {
  today: "Aggregator sheets land as a WhatsApp export, then get retyped by hand into your F1-F4 sheet before anyone can call.",
  proposed: "A live link to the same sheet — leads land already split by source and call-ready, no retyping.",
};

// "If 5 queries come in, AI filters it to the 3 that are actually yours to
// work" — Aman's own framing for the qualification-screen pain point. This is
// illustrative demo data, same spirit as AI_CALL_LOG below — not a live feed.
export const QUALIFICATION_TODAY = {
  received: 5,
  routedToHuman: 3,
  screenedOut: [
    { note: "Function date already past — auto-replied with next availability, no call queued." },
    { note: "Enquiry was for a different city's banquet — auto-declined with a referral note." },
  ],
};

// A lead becomes eligible for the AI voice follow-up once the walkthrough has
// happened — matching the real 24-48h-after-visit trigger described in the
// discovery call, not before.
const AI_CALL_ELIGIBLE_STAGES = ["visited", "quoted", "followup"];

export function queuedForAICall() {
  const called = new Set(AI_CALL_LOG.map((e) => e.leadName));
  return LEADS.filter((l) => AI_CALL_ELIGIBLE_STAGES.includes(l.stage) && !called.has(l.name));
}

export const AI_CALL_LOG = [
  {
    leadName: "Ishaan & Priya",
    outcomeLabel: "Hesitation on budget → routed to Kritika",
    tone: "warm",
    script: [
      { from: "ai", text: "Namaste! Main Cherish Ballrooms ki taraf se bol rahi hoon. Kal aapne Solitaire Hall dekha tha — kaisa laga?" },
      { from: "lead", text: "Bahut achha tha, hall toh perfect hai." },
      { from: "ai", text: "Wonderful! Kya aap is week tasting date finalize karna chahenge?" },
      { from: "lead", text: "Haan, mujhe interest hai but abhi budget thoda tight hai." },
      { from: "ai", text: "Samajh sakti hoon. Main Kritika ko is call ka summary bhej rahi hoon — woh aapko best package options ke saath khud call karengi." },
    ],
    outcomeDetail: "Hesitation on budget detected — routed to Kritika directly instead of firing another nudge.",
  },
  {
    leadName: "The Chopra Wedding",
    outcomeLabel: "Comparison-shopping → routed to Kritika",
    tone: "warm",
    script: [
      { from: "ai", text: "Namaste! Main Cherish Ballrooms ki taraf se bol rahi hoon. Aapka Rubicon Hall ka quote kaisa laga?" },
      { from: "lead", text: "Actually hum kuch aur venues bhi dekh rahe hain, thoda confuse hain abhi." },
      { from: "ai", text: "Bilkul samajh sakti hoon, bade decisions mein time lagta hai. Main Kritika ko bata rahi hoon — woh khud aapse baat karke koi bhi doubt clear kar dengi." },
    ],
    outcomeDetail: "Comparison-shopping signal detected — routed to Kritika for a personal close, not a discount nudge.",
  },
  {
    leadName: "Verma Family",
    outcomeLabel: "Ready to proceed → tasting auto-scheduled",
    tone: "positive",
    script: [
      { from: "ai", text: "Namaste! Aapne Pearl Hall dekha tha apni engagement function ke liye — kaisa laga?" },
      { from: "lead", text: "Bahut sundar tha, hum aage badhne ke liye ready hain." },
      { from: "ai", text: "Wonderful! Main aapke liye agle Saturday tasting date book kar rahi hoon — confirmation WhatsApp par bhej rahi hoon." },
    ],
    outcomeDetail: "Positive signal — tasting date scheduled, no human follow-up needed. Kritika notified for awareness only.",
  },
];

export const NURTURE_STEPS = [
  { id: "thank_you", label: "Thank-you + visit recap", channel: "WhatsApp" },
  { id: "menu_nudge", label: "Menu & tasting nudge", channel: "WhatsApp" },
  { id: "date_reminder", label: "Limited-date reminder", channel: "WhatsApp" },
  { id: "social_proof", label: "Testimonial / social proof", channel: "WhatsApp" },
  { id: "voice_call", label: "AI voice follow-up call", channel: "Voice" },
];

export const EVENTCO_COMMISSION_RATE = 0.5;

export function medianResponseSeconds() {
  const values = LEADS.map((l) => l.firstResponseSeconds).filter(Boolean).sort((a, b) => a - b);
  if (!values.length) return 0;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : Math.round((values[mid - 1] + values[mid]) / 2);
}

export function partnerMarginSummary() {
  const eventco = LEADS.filter((l) => l.source === "eventco" && l.value > 0);
  const direct = LEADS.filter((l) => l.source !== "eventco" && l.value > 0);
  const eventcoGross = eventco.reduce((s, l) => s + l.value, 0);
  const eventcoNet = eventcoGross * (1 - EVENTCO_COMMISSION_RATE);
  const directGross = direct.reduce((s, l) => s + l.value, 0);
  return {
    eventcoGross,
    eventcoNet,
    eventcoNetPerLead: eventco.length ? eventcoNet / eventco.length : 0,
    directNetPerLead: direct.length ? directGross / direct.length : 0,
    eventcoCount: eventco.length,
    directCount: direct.length,
  };
}

// Live channel-type split from the current pipeline sample — a distinct claim from
// CONFIRMED_CHANNEL_SPLIT above. This is "what this dashboard's leads show," not
// "the business-wide number" — the two are allowed to differ without contradicting
// each other, since one is a live 17-lead sample and the other is Naveen's own
// stated aggregate.
export function liveChannelSplit() {
  const indirect = LEADS.filter((l) => SOURCE_META[l.source]?.channelType === "indirect").length;
  const direct = LEADS.length - indirect;
  return {
    indirectCount: indirect,
    directCount: direct,
    indirectPct: Math.round((indirect / LEADS.length) * 100),
    directPct: Math.round((direct / LEADS.length) * 100),
  };
}

// Commitments extracted from thread notes ("call me Tuesday") — the single most
// concretely requested feature in the discovery calls. Surfaced as reminders rather
// than silently auto-actioned; every entry is visible and editable.
// "Call transcript is parsed for commitments... auto-populates the calendar,
// no manual writing" — the real gain point this feature answers. Where a
// commitment's lead has an AI_CALL_LOG entry, it was lifted straight from
// that transcript; otherwise it's a human note, same as today.
export function commitmentSource(leadName) {
  return AI_CALL_LOG.some((e) => e.leadName === leadName) ? "Parsed from the AI call transcript" : "Logged by hand, same as today";
}

export function pendingCommitments() {
  return LEADS.filter((l) => l.commitment && l.stage !== "booked").map((l) => ({ lead: l, ...l.commitment }));
}

// Rough BEO-style cost breakdown derived from the lead's own estimate — mirrors
// a Tripleseat proposal without needing a second, hand-maintained price sheet.
export function buildProposal(lead) {
  if (!lead.value) return null;
  const venue = Math.round(lead.value * 0.35);
  const catering = Math.round(lead.value * 0.45);
  const decor = Math.round(lead.value * 0.12);
  const service = lead.value - venue - catering - decor;
  const deposit = Math.round(lead.value * 0.25);
  return {
    lineItems: [
      { label: "Venue rental", sub: lead.hall, amount: venue },
      { label: "In-house catering", sub: `${lead.guests} pax`, amount: catering },
      { label: "Décor & lighting", sub: "Standard package", amount: decor },
      { label: "Staff & service", sub: "Full event day", amount: service },
    ],
    total: lead.value,
    deposit,
    balance: lead.value - deposit,
  };
}

// Referral Web is derived, not hand-maintained: any lead with a `ref` pointing
// at another lead's exact `name` becomes a child node of that lead.
export function buildReferralGraph() {
  const byName = Object.fromEntries(LEADS.map((l) => [l.name, l]));
  const roots = LEADS.filter((l) => l.rootFamily);
  const children = LEADS.filter((l) => l.ref && byName[l.ref]);
  return { roots, children, byName };
}

export function scoreTone(score) {
  if (score >= 75) return { tone: "hot", label: "Hot" };
  if (score >= 50) return { tone: "warm", label: "Warm" };
  return { tone: "cold", label: "Cold" };
}

export function formatINR(n) {
  if (!n) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/0$/, "").replace(/\.$/, "")}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
