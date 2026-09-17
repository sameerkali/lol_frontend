# LOL by Expendifii — Design System

**Product:** `lol.expendifii.com` — a web-based digital stamp card for restaurants and cafés.
Customers tap an NFC tag or scan a QR at the counter, enter a phone number, and track visits
toward milestone rewards. Three surfaces: **customer page** (mobile web, no app, no login),
**business panel**, **admin panel**.

## Sources
- `uploads/loyalty-system-brd.md` — the Business Requirements Document. This is the **only**
  source provided. No codebase, no Figma file, no logo, no existing screens, no brand fonts.
- Everything visual in this system was therefore authored from scratch against the brief
  "quirky, colorful, interactive, fun". It is a **proposal**, not a recreation. Treat every
  value here as a starting point that the Expendifii team can overrule.

### Known gaps (please fill these)
- **No logo.** Wherever a mark belongs, the system renders the wordmark `lol` in Darker
  Grotesque 900 with a coral dot. Nothing has been drawn or reconstructed. Send the real mark.
- **No licensed brand fonts.** Darker Grotesque, Outfit and Space Mono are Google Fonts
  substitutions chosen for this brief. Send real font files if they exist.
- **No product photography or illustration.** Image areas are striped placeholders labelled
  with what belongs there.
- **Icons** are Lucide (CDN), stroke 2.25px to match the chunky outline motif. Flagged as a
  substitution — no icon set was provided.

---

## 1. The idea behind the look

A paper stamp card is a small, tactile, slightly silly object. It lives in a wallet, gets bent,
gets stamped with a rubber stamp that never lands straight. The system leans into that: everything
is a **sticker** — a filled shape with a hard black outline and a hard offset shadow, no blur,
no gradient mesh, no glass. Colour does the talking; there are five brand colours and they are
used at full strength, not tinted into pastel mush.

The counter context matters more than it sounds. The customer is standing at a till with a queue
behind them, holding a phone one-handed, probably in bad light. So: huge type, 48px minimum tap
targets, one primary action per screen, and a reward moment that is unmissable.

## 2. Content fundamentals

**Voice:** a friendly café owner, not a loyalty platform. Warm, short, a bit cheeky, never cute
for its own sake and never corporate.

- **Person:** speak to the customer as **you**; the customer's own things are **my/your** —
  `Mark my visit`, `Your rewards`. The business is **you** in the business panel.
- **Casing:** Sentence case everywhere except eyebrow labels, which are `UPPERCASE` with
  `--tracking-label`. Never Title Case A Whole Sentence.
- **Length:** buttons 1–3 words. Headings under 6 words. Body under 20 words per line of thought.
- **Numbers:** always a numeral, never spelled out. Currency is `₹` with no space: `₹450`.
- **Emoji:** not in product UI. The celebration moment uses coloured confetti shapes, not 🎉.
  Emoji are acceptable in nothing shipped; if a business types one into a reward label, render it.
- **Exclamation marks:** at most one per screen, reserved for the celebration.
- **Never say:** "loyalty programme", "engagement", "leverage", "seamless", "delight".
  Say "stamp card", "visits", "rewards", "regulars".

### Examples

| Situation | Write | Not |
|---|---|---|
| Check-in button | `Mark my visit` | `Check In Now` |
| Returning customer | `Welcome back, Priya` | `Hello again, valued member!` |
| Progress | `2 more visits to a free coffee` | `You are 40% of the way to your reward` |
| Milestone hit | `Free coffee unlocked!` | `Congratulations! You have earned a reward!` |
| PIN prompt | `Hand the phone to staff` | `Merchant authorisation required` |
| Empty customer list | `No customers yet. Put the tag on the counter.` | `No data available` |
| Error | `That PIN didn't match. Try again.` | `Invalid credentials` |
| Lapsed | `Hasn't been in for 6 weeks` | `Churn risk: high` |

### Copy for the three audiences
- **Customer page:** playful, 5-word sentences, zero jargon, no mention of "data".
- **Business panel:** plain and instructional. Every setting has a one-line consequence
  underneath it — `Bill amount field · Off · Staff won't be asked to type a bill total.`
- **Admin panel:** terse and factual. Table-first, no personality, no encouragement.

---

## 3. Visual foundations

### Colour
Five brand hues at full chroma — **grape** (primary), **mint** (success/progress),
**coral** (destructive + energy), **sun** (rewards + celebration), **sky** (informational) —
over a warm paper background (`--paper-100`, #FDF3E3) with near-black warm ink (`--ink-900`, #1B1526).

Rules:
- **Grape is the only colour a primary button is ever painted.** Sun is for rewards, mint for
  earned progress, coral for destructive and for accent bursts, sky for neutral info.
- Maximum **three** brand colours visible in one viewport, plus paper and ink.
- Never tint text. Body copy is `--text-body`; muted copy is `--text-muted`; on coloured
  fills, text is full-opacity ink or full-opacity white — never `opacity: 0.7`.
- No gradients as backgrounds. The only gradient in the system is the `lol-shine` sweep
  that crosses a newly unlocked reward once.
- Businesses can brand the customer page with a logo and one accent colour. That colour
  replaces `--brand` only; ink, paper, borders and the reward yellow stay fixed so the
  product still reads as LOL.

### Type
- **Darker Grotesque** 800/900 for display. It is condensed and optically small — set it big
  (34px+), tight (`line-height: 0.82–0.95`), and with `letter-spacing: -0.02em`. Never below 24px.
- **Outfit** 400–700 for everything readable: body, labels, buttons, table cells.
- **Space Mono** for numerals that behave like data — PINs, phone numbers, stamp counts,
  QR payloads, dashboard figures. This is what stops the dashboard feeling like a poster.
- Eyebrow labels: Outfit 700, 12px, uppercase, `letter-spacing: 0.12em`, `--text-muted`.

### Shape & structure
- **Corner radii:** 6 / 10 / 16 / 24 / 32 / pill. Buttons and chips are pills. Cards are 24px.
  Modals and phone-shaped containers are 32px. Inputs are 16px. Nothing is square-cornered.
- **Borders:** 3px solid `--ink-900` on anything interactive or card-like; 2px hairline for
  dense table and list rows. Borders are ink, never grey, never coloured — the colour is the fill.
- **Shadows:** hard offset only, `Npx Npx 0 var(--line)`, at 3 / 5 / 8px. No blur anywhere in
  the flat UI. The one exception is `--scrim` behind modals and the celebration overlay.
- **Cards:** white fill, 3px ink border, 24px radius, 5px hard shadow, 24px padding.
  A "sunk" variant drops the shadow and fills `--surface-sunk`.

### Backgrounds
Flat `--paper-100`. Optional decoration, used sparingly: a repeating 24px dot grid at 8% ink,
and rotated confetti shapes (circle, pill, 3-pointed spark) scattered behind hero moments only.
No photography in chrome; photography only appears as business logos and reward-item images,
both of which the business uploads.

### Motion & interaction
This is where "interactive" lives — every state change has a physical read.

- **Hover** (pointer only): translate `-2px, -2px`, shadow grows one step. 120ms `--ease-out`.
- **Press:** translate `+3px, +3px`, shadow shrinks to `--pop-pressed`. The element visibly
  lands on the page. This is the single most important interaction in the system.
- **Focus:** `--focus-ring` — 3px paper gap then 3px grape. Never removed.
- **Enter:** `lol-rise` (10px up, fade) at 220ms for lists and panels.
- **Stamp lands:** `lol-pop-in` — scale 0.4 → 1.12 → 1 with a −12deg → 0 rotation, 420ms on
  `--ease-pop`. The overshoot is deliberate; it should feel like a rubber stamp.
- **Celebration:** full-screen ink scrim, reward card pops in, confetti shapes fall, the
  reward card runs `lol-shine` once. 900ms, then it waits for the customer to dismiss.
- **Idle attention:** `lol-wobble` ±2deg, 2.5s loop, only ever on ONE element per screen
  (the primary CTA when the page has been idle 8s).
- `prefers-reduced-motion`: keep opacity fades, drop every transform, drop confetti.

### Layout
- Customer page: single column, `--width-mobile` 420px max, 24px gutters, one primary action
  fixed to the bottom above the safe area.
- Business panel: 240px left nav + fluid content, `--width-panel` 1280px max, 32px gutters.
- Admin panel: same shell, table-dominant, denser rows (2px hairlines, 44px row height).
- Spacing is the 4px scale; 16px is the default gap, 24px between groups, 32px between sections.

### Transparency & blur
Almost none. Blur is used exactly once — behind the celebration overlay (`backdrop-filter:
blur(3px)`). Transparency is used for the scrim and the dot-grid decoration. Never for text,
never for borders, never for disabled states (disabled uses `--ink-300` fills, not alpha).

---

## 4. Iconography

- **Set:** [Lucide](https://lucide.dev) via CDN, `stroke-width: 2.25`, `stroke-linecap: round`,
  24px default / 20px in dense rows / 32px in the mobile bottom bar. **Flagged substitution** —
  no icon set was supplied; Lucide was chosen because its round caps and even weight sit next to
  the 3px ink borders without looking thin.
- Icons are **ink**, not brand-coloured, except inside a coloured pill where they take the
  pill's contrast colour.
- Icons never appear alone in the customer page except in the bottom bar, where they always
  carry a label.
- **No emoji** in product UI. **No unicode glyphs as icons** (no ✓, ★, →) — use the Lucide
  equivalent so weight stays consistent.
- The **stamp** itself is not an icon: it is a filled circle with a 3px ink ring, and its
  "filled" state carries the business's chosen glyph or the default Lucide `coffee`.
- No custom SVG illustration has been drawn. Illustration slots are striped placeholders with
  a mono caption saying what belongs there.

---

## 5. Index

| Path | What |
|---|---|
| `styles.css` | Entry point. Imports everything below. |
| `tokens/fonts.css` | Google Fonts import (substituted fonts). |
| `tokens/colors.css` | Base palette + semantic aliases + stamp/tier colours. |
| `tokens/typography.css` | Font stacks, `--type-*` shorthands, tracking. |
| `tokens/spacing.css` | 4px scale, gutters, tap target, layout widths. |
| `tokens/effects.css` | Borders, radii, hard-offset shadows, focus ring. |
| `tokens/motion.css` | Easings, durations, keyframes. |
| `guidelines/*.html` | Foundation specimen cards (Type, Colors, Spacing, Motion, Brand). |
| `components/core/` | Button, IconButton, Card, Badge, Tag, Sticker. |
| `components/forms/` | Input, PhoneInput, Select, Checkbox, Switch, PinPad. |
| `components/feedback/` | Dialog, Toast, Tooltip, Celebration, EmptyState. |
| `components/navigation/` | Tabs, SideNav, BottomBar, TopBar. |
| `components/loyalty/` | StampGrid, ProgressBar, MilestoneLadder, RewardCard, TierBadge, StatTile. |
| `ui_kits/customer/` | Mobile customer page, click-through. |
| `ui_kits/business/` | Business panel: dashboard, milestones, customers, settings. |
| `ui_kits/admin/` | Admin panel: business list, create business. |
| `SKILL.md` | Agent-Skills wrapper for use in Claude Code. |

### Intentional additions
The BRD defines no component inventory, so the standard primitive set was authored, plus six
loyalty-specific components the product cannot be built without:
**StampGrid** (the card itself), **MilestoneLadder** (the reward ladder in the BRD),
**RewardCard** (unlocked/redeemed reward), **TierBadge** (Silver/Gold tiers),
**PinPad** (business PIN confirmation, used on every redemption), **StatTile** (dashboard figures).
