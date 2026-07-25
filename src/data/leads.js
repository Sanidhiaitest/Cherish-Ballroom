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

export const LEADS = [
  {
    id: 1, name: "Ananya & Rohit", initials: "AR", source: "instagram", stage: "followup",
    score: 82, days: 2, phone: "+91 98•• ••71", ref: null, hall: "Emerald Hall", guests: 450, value: 1900000,
    thread: [
      { t: "Day 0, 11:42 PM", type: "dm", e: "DM'd @cherish.ballrooms reel — asked about Emerald hall availability, Dec dates." },
      { t: "Day 0, 11:44 PM", type: "ai", e: "AI reply logged guest count (450), qualified, booked site visit for Day 2." },
      { t: "Day 2, 4:30 PM", type: "visit", e: "Property round with Vikram (banquet mgr). Liked Emerald + crystal lighting. Budget hint: ₹18–20L." },
      { t: "Day 2, 8:10 PM", type: "note", e: "Auto thank-you + kitchen reel sent. Menu PDF opened 3 times." },
      { t: "Day 4", type: "alert", e: "No reply yet — follow-up nudge scheduled tomorrow AM." },
    ],
  },
  {
    id: 2, name: "Meera Kapoor", initials: "MK", source: "reference", stage: "quoted",
    score: 91, days: 1, phone: "+91 98•• ••90", ref: "Sharma Family", hall: "Rubicon Hall", guests: 300, value: 2400000,
    thread: [
      { t: "Day 0", type: "call", e: "Referred by Sharma Family (booked May '26). Called directly, asked for Rubicon hall." },
      { t: "Day 0", type: "visit", e: "Same-day walkthrough — Naveen personally hosted (referral courtesy)." },
      { t: "Day 1", type: "quote", e: "Quote sent — Rubicon, 300 pax, full catering. Opened twice, no reply since." },
    ],
  },
  {
    id: 3, name: "The Bhatia–Singh Function", initials: "BS", source: "eventco", stage: "visited",
    score: 58, days: 4, phone: "+91 98•• ••12", ref: "Aarambh Events", hall: "Pearl Hall", guests: 200, value: 950000,
    thread: [
      { t: "Day 0", type: "dm", e: "Inbound via Aarambh Events (planner) — corporate anniversary, 200 pax." },
      { t: "Day 3", type: "visit", e: "Site round done. Planner present, client quiet — hard to read." },
      { t: "Day 4", type: "alert", e: "No quote sent yet — awaiting planner's brief." },
    ],
  },
  {
    id: 4, name: "Ishaan & Priya", initials: "IP", source: "instagram", stage: "visited",
    score: 74, days: 1, phone: "+91 98•• ••83", ref: null, hall: "Solitaire Hall", guests: 380, value: 1650000,
    thread: [
      { t: "Day 0", type: "dm", e: "Ad click → WhatsApp. Asked about Solitaire hall + vegetarian menu." },
      { t: "Day 0", type: "visit", e: "Site visit same evening — loved the glasshouse." },
      { t: "Day 1", type: "note", e: "Tasting scheduled for next week." },
    ],
  },
  {
    id: 5, name: "Kavya Malhotra", initials: "KM", source: "reference", stage: "booked",
    score: 100, days: 0, phone: "+91 98•• ••21", ref: "Malhotra Family (self)", hall: "Emerald Hall", guests: 500, value: 3200000,
    thread: [{ t: "Day 0", type: "quote", e: "Booked — Emerald, Feb '27, 500 pax. Deposit confirmed." }],
  },
  {
    id: 6, name: "The Chopra Wedding", initials: "CW", source: "reference", stage: "followup",
    score: 66, days: 6, phone: "+91 98•• ••90", ref: "Malhotra Family", hall: "Rubicon Hall", guests: 340, value: 1450000,
    thread: [
      { t: "Day 0", type: "dm", e: "Referred by Malhotra Family. Visited Rubicon + Solitaire." },
      { t: "Day 5", type: "alert", e: "Quote sent. Went quiet — 6 days, no reply." },
    ],
  },
  {
    id: 7, name: "Rhea & Arjun", initials: "RA", source: "instagram", stage: "query",
    score: 40, days: 0, phone: "+91 98•• ••50", ref: null, hall: "—", guests: 0, value: 0,
    thread: [{ t: "Just now", type: "ai", e: "DM'd asking about Feb weekend availability. AI reply sent, awaiting reply." }],
  },
  {
    id: 8, name: "Verma Family", initials: "VF", source: "reference", stage: "visited",
    score: 70, days: 2, phone: "+91 98•• ••47", ref: "Sharma Family", hall: "Pearl Hall", guests: 150, value: 620000,
    thread: [
      { t: "Day 0", type: "dm", e: "Referred by Sharma Family." },
      { t: "Day 2", type: "visit", e: "Visited Pearl hall, small engagement fn." },
    ],
  },
  {
    id: 9, name: "The Corporate Gala — Nexlabs", initials: "NX", source: "eventco", stage: "quoted",
    score: 61, days: 3, phone: "+91 98•• ••04", ref: "Aarambh Events", hall: "Solitaire Hall", guests: 150, value: 780000,
    thread: [
      { t: "Day 0", type: "dm", e: "Via Aarambh Events — 150 pax corporate." },
      { t: "Day 3", type: "quote", e: "Quoted, awaiting internal approval on their end." },
    ],
  },
  {
    id: 10, name: "Simran Oberoi", initials: "SO", source: "instagram", stage: "query",
    score: 35, days: 0, phone: "+91 98•• ••29", ref: null, hall: "—", guests: 0, value: 0,
    thread: [{ t: "Just now", type: "ai", e: "Commented on a reel, DM opened by AI, guest count unclear yet." }],
  },
  {
    id: 11, name: "The Bansal Sangeet", initials: "BS", source: "eventco", stage: "followup",
    score: 30, days: 9, phone: "+91 98•• ••01", ref: "Rang Decor Co.", hall: "Pearl Hall", guests: 220, value: 540000,
    thread: [
      { t: "Day 0", type: "dm", e: "Via Rang Decor. Visited, quoted." },
      { t: "Day 9", type: "alert", e: "Cold — 9 days no response, no call logged." },
    ],
  },
  {
    id: 12, name: "Diya & Kabir", initials: "DK", source: "instagram", stage: "quoted",
    score: 85, days: 1, phone: "+91 98•• ••65", ref: null, hall: "Emerald Hall", guests: 400, value: 2100000,
    thread: [
      { t: "Day 0", type: "dm", e: "Ad → instant AI reply → same-day visit." },
      { t: "Day 1", type: "quote", e: "Quoted Emerald, 400 pax. Replied asking for tasting date — hot." },
    ],
  },
];

export const REF_TREE = [
  { id: "sharma", name: "Sharma Family", x: 110, y: 60, root: true, status: "Booked · Apr '26" },
  { id: "verma", name: "Verma Family", x: 560, y: 25, parent: "sharma", status: "Visited" },
  { id: "kapoor", name: "Meera Kapoor", x: 590, y: 110, parent: "sharma", status: "Quoted" },
  { id: "malhotra", name: "Malhotra Family", x: 110, y: 190, root: true, status: "Booked · Feb '27" },
  { id: "chopra", name: "Chopra Wedding", x: 560, y: 170, parent: "malhotra", status: "Follow-up" },
  { id: "raina", name: "Raina Cousins", x: 590, y: 250, parent: "malhotra", status: "Booked · Nov '26" },
  { id: "gill", name: "Gill Family", x: 110, y: 330, root: true, status: "Booked · Jan '26" },
  { id: "sethi", name: "Sethi Family", x: 560, y: 330, parent: "gill", status: "Query" },
];

export function scoreTone(score) {
  if (score >= 75) return { tone: "hot", label: "Hot" };
  if (score >= 50) return { tone: "warm", label: "Warm" };
  return { tone: "cold", label: "Cold" };
}

export function formatINR(n) {
  if (!n) return "—";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
