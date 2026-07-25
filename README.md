# Cherish Ballrooms — Lead Command Center

A frontend-only pitch prototype for Cherish Ballrooms (Imperial Club of India, Vasant Kunj) — a single dashboard that unifies leads arriving from Instagram, referrals, and event-management companies into one tracked pipeline.

No backend, no real data — everything is mocked in `src/data/leads.js`. Built to demo three ideas:

- **Live Funnel** — every lead as a card moving through Query → Visit Scheduled → Visited → Quoted → Follow-Up → Booked, color-coded by source.
- **Priority Queue** — leads ranked by conversion-likelihood score, with staleness flagged so nothing goes cold silently.
- **Referral Web** — a node graph of which families referred which weddings, the channel that was never tracked before.

Clicking a lead opens **"One Thread, Every Touchpoint"** — every interaction across every channel merged into a single timeline.

## Design system

- Palette: ink `#14110F`, ivory `#F6F1E7`, paper `#FBF8F1`, gold `#C9A227`, emerald `#1F4D3D` (reference channel), rose `#B23A48` (event-co channel), stone `#8B8578`.
- Type: Fraunces (display/headings), Inter (body/UI), JetBrains Mono (data/scores/timestamps).
- Signature motif: a gold "thread" connecting nodes in the referral web and running down the lead detail timeline.

## Run it

```bash
npm install
npm run dev
```
