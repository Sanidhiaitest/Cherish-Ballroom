// Pulled from the real Followup Sheet export (Cherish_Ballrooms_Leads_Aug_7.xlsx) —
// the same aggregator/walk-in intake sheet DATA_INTAKE_TODAY (see leads.js) describes
// as "retyped by hand today." These are genuine enquiries; phone numbers are masked
// the same way every other number in this app is (last-2-digits only), full names are
// kept as they're the venue's own leads, not shared outside this tool.
//
// Two source sections exist in the sheet itself — a wedding/reception/anniversary
// block (Event Type, Guest Count, Rooms Requirement?, Event Date) and a separate
// Birthday block (Guest Count, Add. Services, Date) — both normalized to one shape here.

const EVENT_TYPE_LABEL = {
  wedding: "Wedding",
  "reception/engagement": "Reception / Engagement",
  anniversary: "Anniversary",
  birthday: "Birthday",
};

const GUEST_BUCKET = {
  "70_to_100_guests": { label: "70–100 guests", mid: 85 },
  "100_to_200_guests": { label: "100–200 guests", mid: 150 },
  "100_to_300_guests": { label: "100–300 guests", mid: 200 },
  "300_to_500_guests": { label: "300–500 guests", mid: 400 },
};

function initialsOf(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// row shape: [fullName, maskedPhone, eventTypeKey, guestBucketKey, dateLabel, extraLabel]
const RAW_ROWS = [
  ["Shruti Sharma", "+91 62•• ••43", "wedding", "100_to_300_guests", "2 Oct '27", "5–10 rooms needed"],
  ["Richa Rohit Kumar", "+91 97•• ••18", "reception/engagement", "100_to_300_guests", "12 Dec '26", null],
  ["Manya", "+91 87•• ••80", "wedding", "300_to_500_guests", "21 Feb '26", "10–20 rooms needed"],
  ["Piyush", "+91 97•• ••30", "reception/engagement", "100_to_300_guests", "23 Jan '26", null],
  ["Ankit Verma", "+91 88•• ••31", "reception/engagement", "100_to_300_guests", "19–22 Nov", null],
  ["Dhruv Gupta", "+91 70•• ••54", "reception/engagement", "100_to_300_guests", "11 Feb '27", null],
  ["Charanjeet Rawal", "+91 81•• ••80", "wedding", "100_to_300_guests", "14 Dec '26", "10–20 rooms needed"],
  ["Manmeet Hora", "+91 98•• ••43", "anniversary", "100_to_300_guests", "26 Nov", null],
  ["Komal Haldua", "+91 99•• ••39", "birthday", "70_to_100_guests", "30 Aug '26", "Add-ons requested"],
  ["Pooja Choursia Goswami", "+91 83•• ••30", "birthday", "100_to_200_guests", "24 Dec '26", "Add-ons requested"],
  ["Sushil Kumar", "+91 83•• ••41", "birthday", "70_to_100_guests", "2 Oct '26", "Add-ons requested"],
  ["Sonisha Kaushik", "+91 98•• ••57", "birthday", "70_to_100_guests", "15 Sep '26", "Add-ons requested"],
  ["Sumit Kumar Sinha", "+91 98•• ••27", "birthday", "70_to_100_guests", "Nov", "Add-ons requested"],
  ["Puja", "+91 87•• ••96", "birthday", "70_to_100_guests", "24 Aug '26", "Add-ons requested"],
];

const LEAD_REPLIES = [
  "Yes, please! That works for us.",
  "Sure, send karo details please.",
  "Haan bilkul, visit fix kar dijiye.",
  "That sounds good, thank you!",
];

const CONFIRM_REPLIES = ["Haan, yeh sahi hai.", "Ji haan, correct hai.", "Yes, that's right."];

export const SHEET_LEADS = RAW_ROWS.map(([name, phone, eventType, guestKey, dateLabel, extraLabel], i) => {
  const guests = GUEST_BUCKET[guestKey];
  const eventTypeLabel = EVENT_TYPE_LABEL[eventType];
  const owner = i % 2 === 0 ? "Aman" : "Harman";
  const positive = i % 3 !== 1; // most calls land well; roughly every 3rd hits an objection
  const firstName = name.split(" ")[0];

  const whatsapp = {
    ack: `Hi ${firstName}! Thank you for reaching out about your ${eventTypeLabel.toLowerCase()} — noted ${guests.label}, tentatively ${dateLabel}. Sharing our hall options and availability right away. Would you like us to lock in a site visit this week?`,
    reply: LEAD_REPLIES[i % LEAD_REPLIES.length],
  };

  const callScript = [
    { from: "ai", text: `Namaste ${firstName} ji! Main Cherish Ballrooms ki taraf se bol rahi hoon. Aapki ${eventTypeLabel.toLowerCase()} enquiry mili — ${dateLabel} ke around, ${guests.label}. Sahi hai?` },
    { from: "lead", text: CONFIRM_REPLIES[i % CONFIRM_REPLIES.length] },
    positive
      ? { from: "ai", text: `Wonderful! Hamare paas ${dateLabel} ke aas-paas kuch achhi dates open hain. Kya main aapke liye is hafte ek site visit book kar doon?` }
      : { from: "lead", text: "Interested toh hain, lekin hum kuch aur venues bhi dekh rahe hain, thoda confuse hain abhi." },
    positive
      ? { from: "lead", text: "Haan zaroor, that would be great." }
      : { from: "ai", text: `Bilkul samajh sakti hoon, bade decisions mein time lagta hai. Ek second rukiye please, main aapko ${owner} se directly connect kar rahi hoon.` },
  ];
  if (positive) {
    callScript.push({ from: "ai", text: `Perfect! Main aapko WhatsApp par confirmation bhej rahi hoon, aur ${owner} ko bhi notify kar diya hai.` });
  }

  return {
    id: `sheet-${i}`,
    name,
    initials: initialsOf(name),
    phone,
    eventType,
    eventTypeLabel,
    guestsLabel: guests.label,
    guestsMid: guests.mid,
    dateLabel,
    extraLabel,
    owner,
    positive,
    whatsapp,
    callScript,
    outcome: positive
      ? `Site visit auto-scheduled — ${owner} notified, confirmation sent on WhatsApp.`
      : `Hesitation detected on the call — transferred live to ${owner} instead of firing another automated nudge.`,
    transfer: positive ? null : { to: owner, line: `Please hold — connecting you to ${owner} now.` },
  };
});
