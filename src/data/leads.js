export const SOURCE_META = {
  instagram: { label: "Instagram", key: "instagram" },
  reference: { label: "Reference", key: "reference" },
  eventco: { label: "Event Co.", key: "eventco" },
};

export const STAGES = [
  { id: "query", label: "Query" },
  { id: "visit_scheduled", label: "Visit Scheduled" },
  { id: "visited", label: "Visited" },
  { id: "quoted", label: "Quoted" },
  { id: "followup", label: "Follow-Up" },
  { id: "booked", label: "Booked" },
];

export const TONE_COLOR = {
  hot: "var(--color-gold-deep)",
  warm: "var(--color-emerald)",
  cold: "var(--color-stone)",
};

// Every lead lives in exactly one place. Referred leads point back at the
// referrer's `name` via `ref` — the Referral Web is derived from this, not
// a separate dataset, so there is never a second identity for the same family.
export const LEADS = [
  {
    id: 1, name: "Ananya & Rohit", initials: "AR", source: "instagram", stage: "followup",
    score: 82, days: 2, phone: "+91 98•• ••71", ref: null, hall: "Emerald Hall", guests: 450, value: 1900000,
    firstResponseSeconds: 118, nurtureStep: 2,
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
      { t: "Day 2, 8:10 PM", type: "note", e: "Auto thank-you + kitchen reel sent. Menu PDF opened 3 times." },
      { t: "Day 4", type: "alert", e: "No reply yet — follow-up nudge scheduled tomorrow AM." },
    ],
  },
  {
    id: 2, name: "Meera Kapoor", initials: "MK", source: "reference", stage: "quoted",
    score: 91, days: 1, phone: "+91 98•• ••90", ref: "Sharma Family", hall: "Rubicon Hall", guests: 300, value: 1650000,
    aiProfile: {
      persona: "Referral-Trusted Fast Mover",
      signals: [
        "Came in via a family that already booked — trust is pre-established, not earned cold",
        "Requested a specific hall by name on the first call, no comparison-shopping language",
      ],
      tip: "Referral trust is doing the selling here — a warm human follow-up will close this, not another automated nudge.",
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
    id: 4, name: "Ishaan & Priya", initials: "IP", source: "instagram", stage: "visited",
    score: 74, days: 1, phone: "+91 98•• ••83", ref: null, hall: "Solitaire Hall", guests: 380, value: 1940000,
    firstResponseSeconds: 64, nurtureStep: 1,
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
    id: 5, name: "Kavya Malhotra", initials: "KM", source: "reference", stage: "booked", rootFamily: true, milestone: "Booked · Feb '27",
    score: 100, days: 0, phone: "+91 98•• ••21", ref: null, hall: "Emerald Hall", guests: 500, value: 3200000,
    aiProfile: {
      persona: "Legacy Client",
      signals: [
        "Walked in cold, no referral or ad — became a root family in her own right",
        "Booked the flagship hall at max guest count with no hesitation in-thread",
      ],
      tip: "Already converted — nurture for repeat business and referral value from here.",
    },
    thread: [
      { t: "Day -40", type: "dm", e: "Walked in cold two months ago — no referral, no ad. Wanted Emerald for a 500-pax winter wedding." },
      { t: "Day 0", type: "quote", e: "Booked — Emerald, Feb '27, 500 pax. Deposit confirmed." },
    ],
  },
  {
    id: 6, name: "The Chopra Wedding", initials: "CW", source: "reference", stage: "followup",
    score: 66, days: 6, phone: "+91 98•• ••90", ref: "Kavya Malhotra", hall: "Rubicon Hall", guests: 340, value: 1630000,
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
      { t: "Day 5", type: "alert", e: "Quote sent. Went quiet — 6 days, no reply." },
    ],
  },
  {
    id: 7, name: "Rhea & Arjun", initials: "RA", source: "instagram", stage: "query",
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
    thread: [{ t: "Just now", type: "ai", e: "DM'd asking about Feb weekend availability. System sent an instant acknowledgment, awaiting her reply." }],
  },
  {
    id: 8, name: "Verma Family", initials: "VF", source: "reference", stage: "visited",
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
    id: 10, name: "Simran Oberoi", initials: "SO", source: "instagram", stage: "query",
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
    aiProfile: {
      persona: "Cold Planner Lead",
      signals: [
        "Via a smaller decor partner, not a top-volume planner",
        "9 days silent, no call logged — likely already lost to a competitor",
      ],
      tip: "Deprioritize this lead unless the Rang Decor partnership itself is worth nurturing separately.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Via Rang Decor. Visited, quoted." },
      { t: "Day 9", type: "alert", e: "Cold — 9 days no response, no call logged." },
    ],
  },
  {
    id: 12, name: "Diya & Kabir", initials: "DK", source: "instagram", stage: "quoted",
    score: 85, days: 1, phone: "+91 98•• ••65", ref: null, hall: "Emerald Hall", guests: 400, value: 2100000,
    firstResponseSeconds: 29, nurtureStep: 3,
    aiProfile: {
      persona: "Impulse Fast-Mover",
      signals: [
        "Replied to an ad and booked a visit the same day — near-zero deliberation window",
        "Asked for a tasting date immediately after the quote — high urgency, high intent",
      ],
      tip: "Hottest lead in the pipeline right now — get a tasting date on the calendar today, not this week.",
    },
    thread: [
      { t: "Day 0", type: "dm", e: "Ad click → instant system acknowledgment → same-day visit booked." },
      { t: "Day 1", type: "quote", e: "Quoted Emerald, 400 pax. Replied asking for tasting date — hot." },
    ],
  },
  {
    id: 13, name: "Sharma Family", initials: "SF", source: "reference", stage: "booked", rootFamily: true, milestone: "Booked · Apr '26",
    score: 100, days: 0, phone: "+91 98•• ••18", ref: null, hall: "Rubicon Hall", guests: 1200, value: 6000000,
    aiProfile: {
      persona: "Legacy Anchor Family",
      signals: [
        "No source at all — organic walk-in, not from any channel Cherish tracks today",
        "Toured all 5 halls before deciding — values scale and options over speed",
      ],
      tip: "Your highest-value referral source going forward — worth formalizing the relationship with the referral program.",
    },
    thread: [
      { t: "Day -95", type: "dm", e: "Came in through the front door two seasons ago — no source at all, just walked past on Sainik Farms road." },
      { t: "Day -60", type: "visit", e: "Toured all 5 halls before settling on Rubicon for scale — 1,200 guests, three-day function." },
      { t: "Day 0", type: "quote", e: "Booked — Rubicon, Apr '26, 1,200 pax. Full property buyout for the sangeet night." },
    ],
  },
  {
    id: 14, name: "Gill Family", initials: "GF", source: "reference", stage: "booked", rootFamily: true, milestone: "Booked · Jan '26",
    score: 100, days: 0, phone: "+91 98•• ••63", ref: null, hall: "Pearl Hall", guests: 250, value: 1150000,
    aiProfile: {
      persona: "Repeat Loyalist",
      signals: [
        "Second booking with Cherish in three years — no hesitation in-thread",
      ],
      tip: "A loyalty gesture here could turn into a standing referral relationship — worth a personal note from Naveen.",
    },
    thread: [{ t: "Day 0", type: "quote", e: "Booked — Pearl, Jan '26, 250 pax. Second booking with us in three years." }],
  },
  {
    id: 15, name: "Raina Cousins", initials: "RC", source: "reference", stage: "booked", milestone: "Booked · Nov '26",
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
    id: 16, name: "Sethi Family", initials: "SE", source: "reference", stage: "query",
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
    id: 17, name: "Naina Chawla", initials: "NC", source: "instagram", stage: "query",
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
  { name: "Winter Wedding Reel Series", platform: "Instagram", spend: 45000, leads: 18, booked: 3 },
  { name: "Diwali Sangeet Push", platform: "Instagram", spend: 30000, leads: 9, booked: 1 },
  { name: "Banquet Delhi — Search", platform: "Google Ads", spend: 60000, leads: 12, booked: 2 },
];

export const CONTENT_TRENDS = [
  { type: "post", title: "Behind-the-scenes kitchen & tasting reels", reason: "Venues showing food prep are seeing 2-3x the saves of static hall photos this quarter — plays directly to Cherish's own USP." },
  { type: "post", title: "Real couple walkthroughs, phone-shot", reason: "Gen-Z engagement skews toward authentic, unpolished clips — raw reels are out-saving produced videography right now." },
  { type: "avoid", title: "\"Limited dates available\" urgency posts", reason: "Comment sentiment on this format skews skeptical (\"pushy\") among Delhi wedding accounts this month." },
  { type: "avoid", title: "Price-first captions", reason: "Leads where price is mentioned upfront show a 40% lower visit-to-quote rate — let the tasting sell first." },
];

export const AI_CALL_LOG = [
  {
    leadName: "Ishaan & Priya",
    outcomeLabel: "Hesitation on budget → routed to Kritika",
    tone: "warm",
    script: [
      { from: "ai", text: "Namaste! Main Cherish Ballrooms ki AI assistant bol rahi hoon. Kal aapne Solitaire Hall dekha tha — kaisa laga?" },
      { from: "lead", text: "Bahut achha tha, hall toh perfect hai." },
      { from: "ai", text: "Wonderful! Kya aap is week tasting date finalize karna chahenge?" },
      { from: "lead", text: "Haan, mujhe interest hai but abhi budget thoda tight hai." },
      { from: "ai", text: "Samajh sakti hoon. Main Kritika ko is call ka summary bhej rahi hoon — woh aapko best package options ke saath khud call karengi." },
    ],
    outcomeDetail: "Hesitation on budget detected — routed to Kritika directly instead of firing another automated nudge.",
  },
  {
    leadName: "The Chopra Wedding",
    outcomeLabel: "Comparison-shopping → routed to Kritika",
    tone: "warm",
    script: [
      { from: "ai", text: "Namaste! Main Cherish Ballrooms ki AI assistant bol rahi hoon. Aapka Rubicon Hall ka quote kaisa laga?" },
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
    outcomeDetail: "Positive signal — tasting date auto-scheduled, no human follow-up needed. Kritika notified for awareness only.",
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
