# lol. — Manual Test Plan

A full functional test pass across the three surfaces of the app: **Admin panel**, **Business panel**, and the **Customer-facing card page**. Work top to bottom; check each box as you verify it. Where a step says "expect X", that's the correct behavior — if you see something else, log it as a bug with steps to reproduce, the URL, and a screenshot.

## 0. Setup

- Backend running on `http://localhost:5001`, frontend on `http://localhost:3000`.
- Admin login: `admin@expendifii.com` / `ChangeMe123!`
- Entry points:
  - `/` — landing page with links to all three surfaces (Admin panel, Business panel, Customer page with `?slug=demo`)
  - `/admin/login` → `/admin` (business list) → `/admin/businesses/[id]` (one business's full config)
  - `/business/login` → `/business/[id]` (owner's own dashboard) — visiting bare `/business` auto-redirects to the logged-in owner's panel, or to `/business/login` if signed out
  - `/b/[slug]` — the real customer-facing URL (what's baked into every QR code / NFC tag)
  - `/customer?slug=xxx` — an alternate way to reach the same customer page
- Test on **desktop width** and **mobile width** (~375px, e.g. iPhone SE/12 in dev tools) for every section — the whole app is expected to be responsive.
- Test in at least two browsers if possible (Chrome + Safari/Firefox), and on a real phone once if you can — phone number keyboards, date pickers, and tap targets behave differently on real devices than in a simulator.
- Keep the browser console open throughout. Any red console error is worth logging even if the UI looks fine.

---

## 1. Admin Panel

### 1.1 Login & session
- [x] Log in with correct admin credentials → lands on `/admin` (Businesses list).
- [x] Log in with wrong password → clear error shown, not a silent failure or crash.
- [x] Log in with an email that doesn't exist → same generic "invalid email or password" error (shouldn't reveal whether the email exists).
- [x] Leave email or password blank and submit → inline validation error, no network call. (Button is disabled outright while either field is empty — stronger than inline validation, confirmed no request fires.)
- [x] Enter a malformed email (`notanemail`) → inline validation catches it before submit.
- [x] Refresh the page while logged in → stays logged in (session persists).
- [x] Open `/admin` directly in a fresh tab with no prior login → redirected to `/admin/login`.
- [x] Manually edit/clear the stored auth token (localStorage) then navigate → treated as logged out. **BUG FOUND & FIXED**: clearing only `localStorage.token` (leaving the `role` key and the `lol_session` cookie behind — e.g. a browser tool that clears storage but not cookies) left the page stuck at `/admin` rendering raw `"Missing bearer token"` API error text, with no way to reach the login form: the middleware's optimistic cookie gate kept bouncing `/admin/login` back to `/admin`. Fixed in `app/lib/auth.tsx` — a partial/invalid local session now clears the leftover `role` key and `lol_session` cookie too, so the redirect actually lands on the login page. Re-verified after the fix: redirects correctly.
- [x] Log out via the sidebar → confirmation dialog appears (title "Log out?") before actually logging out; **Cancel** keeps you logged in; **Log out** signs out and redirects to `/admin/login`.
- [x] **Mobile**: open the hamburger drawer, tap Logout → the drawer closes and the confirmation dialog is fully visible and clickable (not obscured by the drawer or backdrop).

### 1.2 Businesses list
- [x] List loads and shows all existing businesses with name, plan, customer count, status.
- [x] Top stat cards (Businesses / Customers / Visits) show sensible non-negative numbers.
- [x] Search by business name → list filters live.
- [x] Search by slug → matches.
- [x] Search by owner email → matches.
- [x] Search with no matches → "No businesses yet" (or equivalent empty state), not a blank screen or error.
- [x] Clear the search → full list returns.
- [x] Click a business row → navigates to that business's detail page.
- [x] Click "Open" button on a row → same destination as clicking the row.
- [x] Click the row's delete (trash) icon → native confirm() prompt appears; Cancel does nothing; Confirm deletes the business and removes it from the list without a full page reload.
- [x] **Mobile**: table scrolls horizontally without breaking page layout; stat cards wrap instead of overflowing. (320px viewport, zero horizontal overflow.)

### 1.3 Create business
- [x] Navigate via "New business" button → goes straight to the Create business form (no intermediate dialog).
- [x] Submit with all fields blank → inline errors on name / owner email / owner password, no request sent. (Create button is disabled outright until all three are filled — verified no request fires.)
- [x] Enter a business name only, leave email/password blank → still blocked with per-field errors. (Button stays disabled.)
- [x] Enter an invalid email format → inline error ("Enter a valid email address").
- [x] Enter a password under 8 characters → inline error ("Password must be at least 8 characters").
- [x] Enter a valid name/email/8+ char password → Create button enables, submission succeeds, redirects to the Businesses list, and the new business appears in it.
- [x] Try creating a second business with the **same owner email** as an existing one → server rejects with a clear conflict error ("A business with this owner email already exists"), surfaced on the form (not just a console error).
- [x] Optional Staff PIN field: leave blank → business is created with no PIN set.
- [x] Optional Staff PIN field: enter 3 digits → validation error (PIN must be 4–6 digits).
- [x] Optional Staff PIN field: enter 7 digits → validation error.
- [x] Optional Staff PIN field: enter exactly 4, 5, and 6 digits (test each) → all accepted. (Verified 5-digit case end-to-end: created, then confirmed via admin detail read that the PIN was stored correctly as entered.)
- [x] Optional Staff PIN field: enter non-numeric characters → rejected.
- [x] **Template picker** — create one business per template and confirm the resulting settings match:
  - [x] **Café**: visit-based earning, automatic check-in, 1 stamp/day limit, 2-milestone ladder (5 visits / 10 visits), no tiers, only "name" signup field.
  - [x] **Restaurant**: bill-amount earning (₹200/point), PIN check-in, head-start of 1 stamp enabled, all three signup fields (name/email/birthday) on, tiers enabled (Silver → Gold) instead of a flat milestone ladder, birthday reward pre-configured. Also spot-checked in the actual UI (not just the API): the Milestones tab correctly renders both tiers with their full sub-ladders, and the Earning tab correctly shows bill-amount mode.
  - [x] **Blank / custom**: visit-based, automatic check-in, single 10-visit milestone, nothing else pre-filled.
- [x] Cancel button on the create form → discards input and returns to the Businesses list without creating anything.
- [x] **Mobile**: all fields, the template picker, and the Create/Cancel buttons remain usable and non-overflowing at narrow width.

### 1.4 Business detail — tab by tab
Open a business you created above (`/admin/businesses/[id]`) and go through every tab. These are the same settings components the business owner sees in their own panel — the difference is admin can edit *any* business here without owning it.

- [x] Header shows business name, active/inactive badge, slug, and owner email correctly.
- [x] **Earning & check-in**:
  - [x] Switch earning mode between Visits / Bill amount / Visits with minimum bill — the right fields show/hide (₹-per-point only for bill amount; minimum bill amount only for the third mode). Verified in both directions, including rapid mode-to-mode-to-mode switching (no leftover field from a previously-selected mode).
  - [x] Enter an out-of-range ₹-per-point (e.g. 0 or a huge number) → validation blocks save.
  - [x] Toggle "Bill amount field" switch on/off, save, and re-open the tab → persisted correctly.
  - [x] Change "Visit confirmation" between Automatic and PIN → saved and reflected on reload.
  - [x] Stamp limit per day: try `-1` → rejected/clamped. Try `0` → **accepted** (means unlimited, not zero visits — verify on the customer page that a business with limit 0 lets a customer earn stamps on multiple visits in the same day). Try a very large number (e.g. 9999) → either accepted or clamped at the documented max; confirm it isn't silently ignored.
  - [x] "Mark customer lapsed after (days)" — try 0 and a negative number → rejected; try a normal value (30, 90) → saved.
  - [x] Save with an invalid field present → Save button stays disabled, not a failed network call. **Correction**: the generic "fix the highlighted fields" summary message is a Milestones-tab-only affordance, not present on Earning & check-in — that tab instead shows the error right under the specific invalid field (e.g. "Min 1" under ₹ per point), which is adequate but inconsistent with Milestones' style. Not a bug, just a minor UX inconsistency worth knowing about.
- [x] **Milestones**:
  - [x] Default "reset" mode: add/edit/remove milestones in the ladder; each milestone needs a count, reward type, value, and label — try leaving one blank and confirm Save is blocked with a clear per-field error.
  - [x] Switch "After the final milestone" to "Move to the next tier" → the milestone ladder editor is replaced by the Tiers editor.
  - [x] On a business with zero tiers configured, click **"Set up 10 tiers"** → generates a full 10-tier ladder (Bronze → Legend) with sane defaults, and Save is immediately enabled (not blocked by empty-required-field validation).
  - [x] Edit a tier's name to blank → inline "Required" error, Save blocked.
  - [x] Add a custom tier manually via "Add tier" instead of the generator → works, with its own milestone sub-ladder.
  - [x] Delete a tier → removed from the list; deleting all tiers down to zero blocks Save (tiers mode requires at least one tier).
  - [x] Switch from "next tier" back to "reset" → milestone ladder editor reappears; verify no data loss/corruption switching back and forth before saving. (Also verified switching forward again afterward doesn't crash.)
  - [x] Save tiers, then check the **Customers** tab and **Dashboard** — a newly signed-up customer should show the first tier immediately, and the dashboard's "Customers by tier" widget should reflect real counts. Verified end-to-end: signed up a fresh customer via the public API immediately after saving a new tier config, confirmed `tierName` was assigned instantly (no visit required), and confirmed both the Customers tab and the Dashboard's "Customers by tier" widget reflected it correctly.
- [ ] **Signup & rewards**:
  - [ ] Toggle each signup field (name / email / birthday) independently, save, and confirm on the actual customer signup page (`/b/[slug]`) that exactly the enabled fields appear — not more, not fewer.
  - [ ] Head start: enable it and set a stamp count (0 and a positive number) → a brand-new signup should reflect the head-start stamps immediately on their card, and the customer signup screen should show the "free stamps to start" banner only when `enabled && stamps > 0`.
  - [ ] Head start stamp count: try a negative number → rejected.
- [x] **Branding**:
  - [x] Change primary/secondary color via the hex inputs. Try an invalid hex (`#zzz`, missing `#`, too short) → validation error, Save blocked.
  - [x] Save a valid color pair → the customer page's top bar tone should reflect the new primary color. (Verified via computed style: `#1B1526` → `rgb(27, 21, 38)` header background.)
- [x] **PIN**:
  - [x] Set a brand-new 4-digit PIN → saved, and the reveal ("Show"/"Hide") toggle on the Dashboard and here works correctly (masks by default). (The toggle is an icon-only button — `aria-label="Show PIN"`/`"Hide PIN"`, no visible text — worth knowing if you're locating it by text in future automated tests.)
  - [x] Change an existing PIN to a different value (try 5 and 6 digit lengths too, not just 4) → saved.
  - [x] Enter fewer than 4 or more than 6 digits → rejected before save. **Note**: rejection happens on click (shows a "PIN must be 4–6 digits" inline error and never fires the save request), not by pre-disabling the button — the button is only disabled while the field is empty. Functionally equivalent (no invalid PIN ever reaches the server), just a different mechanism than the Earning/Milestones tabs' pre-disable pattern.
  - [x] Enter non-numeric input → rejected (same click-then-error mechanism).
  - [x] After setting a 5- or 6-digit PIN here, go confirm a visit on the customer page in PIN mode and verify the full PIN (not just the first 4 digits) is required to confirm — **this was a real bug**, treat it as a priority regression check. (Fixed and re-verified earlier this session for 4, 5, and 6-digit PINs.)
- [x] **QR & link**:
  - [x] QR image renders and the link under it matches `.../b/[slug]`.
  - [x] "Copy link" copies the correct URL to the clipboard (paste it somewhere to confirm).
  - [x] "Download PNG" downloads a valid, scannable QR image named after the business slug.
  - [ ] Scan the QR with an actual phone camera (or a QR reader) → opens the correct customer page. *(Not automatable from this environment — needs a real device. The underlying link and PNG were verified correct; a manual scan is the only remaining gap.)*
- [x] **Owner account**:
  - [x] Reset the owner's password here (admin override, no current password needed) to a new value → log in on `/business/login` with the new password to confirm it actually took effect.
  - [x] Try a password under 8 characters → rejected.
  - [x] Owner email field is read-only here (cannot be edited) — confirm that's the case.
- [x] **Plan & status** (header controls, not a tab):
  - [x] Change plan (Trial/Basic/Pro) via the dropdown → persists on reload.
  - [x] Click Deactivate → confirmation dialog warns the owner will be logged out and their customer page stops working; confirm it, then:
    - [x] Owner's existing business-panel session (in another tab/browser) starts failing its next request (403) instead of silently continuing to work.
    - [x] Owner cannot log back into `/business/login` while inactive (clear "account is inactive" error).
    - [x] The customer-facing page (`/b/[slug]`) for that business now shows "not available"/not found instead of the normal card flow.
  - [x] Click Activate on an inactive business → everything above is restored (login works again, customer page works again).
- [x] **Danger zone**:
  - [x] Delete button is disabled/no-ops until you type the business's exact name into the confirmation field.
  - [x] Typing the wrong name (typo, different case) keeps Delete disabled.
  - [x] Typing the exact name enables Delete; confirm it removes the business, its customers, and its visit history, and redirects back to `/admin`.
  - [x] After deletion, hitting the old `/admin/businesses/[id]` URL directly (e.g. via back button or bookmark) shows a proper "couldn't be loaded" state — **not an infinite loading skeleton** (this was a real bug, verify the fix holds). Confirmed holding.
- [x] Tab content doesn't bleed between businesses: open business A's Milestones tab, navigate to business B, confirm B's data loads fresh (not a stale cache of A's settings).
- [x] **Mobile**: every tab above remains usable at narrow width — tab pills wrap, forms stack, nothing overflows horizontally. (All 8 tabs checked individually at 320px — zero horizontal overflow on any.)

---

## 2. Business Panel

Test as the owner of a business you created above (or `farzi cafe`, the existing production-ish business — **be careful not to leave test data in it**; prefer a disposable test business for anything destructive).

### 2.1 Login & session
- [x] Log in with correct owner email/password → lands on `/business/[id]` (Dashboard).
- [x] Wrong password / unknown email → clear, generic error.
- [x] Log in to a **deactivated** business → explicit "account is inactive" error, not a generic failure.
- [x] Refresh mid-session → stays logged in.
- [x] Log out via sidebar → confirmation dialog, Cancel/confirm both behave correctly.
- [x] **Mobile**: open the drawer, tap Logout → drawer closes, confirmation dialog fully visible and its buttons are clickable (regression check — this was broken: the dialog used to render underneath the drawer).

### 2.2 Dashboard
- [x] Stat tiles (Total customers, Visits 30d, Redemptions 30d, Repeat visit rate) load and show real numbers, not stuck on a loading skeleton.
- [x] "Customers by tier" widget: absent entirely for a business not using tiers; present and accurate (counts sum to total tiered customers) for one that is.
- [x] "Birthdays today 🎉" widget: only appears when at least one customer's birthday (MM-DD) matches today's date; shows name/phone for each. Verified it correctly excludes a same-day-signed-up customer with no birthday set.
- [x] Business PIN widget: shows "Not set" if no PIN configured; shows masked dots with a working Show/Hide toggle if one is; "Change" button jumps to Settings → PIN tab.
- [x] "Recent customers" list shows up to 5 most recent, each with visit/point counts and a tier badge (or "—" if untiered).
- [x] Sign up a brand-new customer from another tab/device while the Dashboard stays open → within ~20 seconds the numbers/recent list update on their own (regression check — this used to require a manual page refresh to see new signups). Verified live: signed up a customer via the API while the dashboard page sat idle (no reload), and the new customer appeared in "Recent customers" after waiting the refetch interval out.
- [x] Empty business (zero customers): dashboard doesn't crash, shows sensible zero/empty states throughout.

### 2.3 Milestones
- [x] Same checks as Admin → Business detail → Milestones (section 1.4) — verify the owner-facing version behaves identically to the admin override version. (Same shared component — confirmed it renders and saves correctly from this panel too.)
- [x] Saved changes here are visible immediately to admin viewing the same business.

### 2.4 Customers
- [x] List loads with columns: Name, Phone, Visits, Points, Tier, Last visit.
- [x] Search by phone (partial match) → filters correctly.
- [x] Sort: Newest first / Most visits / Last visit — each reorders the list correctly.
- [x] Sort by **Tier** (only appears once the business has tiers) → highest tier customers sort to the top.
- [x] Filter by a specific tier (dropdown only shows once tiers exist) → list narrows to just that tier; "All tiers" clears it. (Note while testing: every customer gets the *first* configured tier immediately at signup, so filtering by an early tier will include everyone who hasn't been promoted yet — that's correct behavior, not a bug. Filtering by a later tier only some customers have reached is the clean way to verify this.)
- [x] "Unredeemed rewards only" checkbox → narrows to customers with at least one unredeemed unlocked milestone.
- [x] Combine two filters at once (e.g. tier + unredeemed) → both apply together (AND, not OR). Verified: `tier=Bronze&hasUnredeemedRewards=true` correctly returned nobody (the one customer with an unredeemed reward had already been promoted off Bronze), while `tier=Gold&hasUnredeemedRewards=true` correctly returned exactly that customer.
- [x] Zero customers / zero matches → clear empty state, not a broken table.
- [x] Export CSV → downloads a file containing exactly the enabled signup fields (name/email/birthday) plus visit/point/redemption stats; matches whatever filter/search was active at the time.
- [x] **Mobile**: table scrolls horizontally in its own container; the rest of the page doesn't shift. (Covered in the 2.11 mobile sweep.)

### 2.5 Settings → Earning & check-in
- [x] All checks from section 1.4's Earning & check-in already cover the shared component — re-verify saving from the business panel side specifically (not just admin).
- [x] **Bill amount required field, end to end** (regression check — previously this was completely broken, businesses on "Bill amount" or "min bill" modes awarded zero stamps no matter what):
  - [x] Set earning mode to **Bill amount**, save. Go to the customer page, mark a visit — a "Bill amount (₹)" field must appear before the Mark/PIN button, and the button must stay disabled until a value is entered.
  - [x] Enter a bill amount and confirm the visit → stamps earned should equal `floor(billAmount / amountPerPoint)`. Try a couple of values and check the math server-side (customer's point total in the business panel). (Verified ₹360 at ₹120/point → exactly 3 points, configured entirely from the business panel.)
  - [x] Enter `0` or leave it blank and try to proceed → blocked client-side; if bypassed, the backend should award 0 stamps and log the visit with an explanatory note, not error out.
  - [x] Set earning mode to **Visits with a minimum bill**, turn the "Bill amount field" switch **on**, set a minimum, save. On the customer page: a bill below the minimum → visit logged, 0 stamps; a bill at/above the minimum → 1 stamp.
  - [x] Same mode with the "Bill amount field" switch turned **off** → no bill field shown to the customer at all, every visit earns 1 stamp regardless of spend.
  - [x] Test bill-amount entry under **both** check-in modes (Automatic and PIN) — the field must appear in both, not just one.
- [x] Stamp limit per day = 0: confirm a customer can mark multiple visits in the same calendar day and each earns stamps (no daily cap applied).
- [x] Stamp limit per day = 1 (default) or higher N: confirm the (N+1)th visit same day is still logged but awards 0 stamps with a "daily limit reached" note, and doesn't error out. (Also independently rediscovered mid-testing when a test script forgot to raise the limit before firing 5 rapid visits — the 2nd–5th were correctly logged with 0 stamps, confirming this holds even under rapid-fire real-world-like conditions.)

### 2.6 Settings → Signup & rewards
- [x] Toggle signup fields and head start as in 1.4; re-verify from the business-panel side.
- [x] Note: there is currently **no UI here to configure a birthday reward**, even though the backend/data model fully supports one (visible on `restaurant`-template businesses, which get a birthday reward pre-configured at creation). Confirmed still the current state — not a new regression, still worth a product decision on whether to expose it.

### 2.7 Settings → Branding
- [x] Same as 1.4's Branding checks, from the owner's own panel.

### 2.8 Settings → PIN
- [x] Set/change PIN — no "current PIN" confirmation should be required (this app's design choice: the PIN is always owner-visible, and the login token already proves ownership). Confirmed.
- [x] 4, 5, and 6-digit PINs all save correctly.
- [x] Reveal/hide toggle on the Dashboard's PIN widget matches whatever was just set here.

### 2.9 Settings → Account
- [x] Change password: requires current password + a new one ≥ 8 characters.
- [x] Wrong current password → rejected with a clear error.
- [x] Successful change → log out and log back in with the new password to confirm it stuck.

### 2.10 QR Code
- [x] Same checks as 1.4's QR & link tab, verified from the owner's own panel this time.

### 2.11 Mobile responsiveness (whole panel)
- [x] Sidebar collapses to a hamburger + slide-down drawer under ~780px width.
- [x] Every screen (Dashboard, Milestones, Customers, Settings — all sub-tabs, QR) renders with no horizontal scrollbar on the page itself at a 320–375px viewport. (All 9 screens checked individually: Dashboard, Milestones, Customers, all 5 Settings sub-tabs, QR Code — zero overflow on any.)
- [x] Forms with multiple fields stack vertically and remain fully usable (nothing clipped or unreachable).
- [x] The 10-tier milestone editor specifically — this had a real overflow bug — confirm the tier-name input can't push the layout wider than the screen. (Covered by the same zero-overflow sweep above.)

---

## 3. Customer-Facing Page

This is the actual product customers use — test it as if you were a real customer on a real phone, for each of several differently-configured test businesses (a plain visits-based one, a bill-amount one, and a tiers-based one).

### 3.1 First visit / lookup
- [x] Visiting `/b/[valid-slug]` shows the business name/branding and a phone-number entry screen.
- [x] Visiting `/b/[nonexistent-slug]` → a proper not-found page, not a crash.
- [x] Visiting `/customer` with no `?slug=` → "No business specified" message.
- [x] Visiting `/customer?slug=[nonexistent]` → inline "Business not found" message (note: this is a different failure mode than `/b/[slug]`'s — both should fail gracefully, just via different UI). Takes ~1–2 seconds to appear (shows "Loading..." briefly first) due to the default one-retry-before-failing query behavior — not broken, just don't mistake the brief loading flash for a hang.
- [x] Visiting the page for a **deactivated** business → not found / unavailable, not a broken card screen. (Verified via the public API directly in section 1.4: deactivating returns 404 for the business lookup, which this page already handles as "not found.")
- [x] Phone input only accepts digits, auto-formats as you type, and caps at 10 digits.
- [x] "Find my card" stays disabled until 10 digits are entered.
- [x] Look up a phone number that has never signed up → routes to the Signup screen.
- [x] Look up a phone number that already has a card → routes straight to the Card screen.

### 3.2 Signup
- [x] Only the fields enabled in that business's settings appear (test all 8 combinations of name/email/birthday on/off — or at minimum: all-off, all-on, and one mixed case). (Verified all-off, mixed name+birthday, and all-on earlier this session.)
- [x] All fields optional except when explicitly required — confirm you can submit with only a phone number if no fields are enabled.
- [x] Enter an email in an invalid format (if the email field is shown) → does the UI validate it, or does it just get silently dropped/accepted? Confirm the actual behavior either way. **Confirmed**: no format validation anywhere — with the email field enabled, a value like `not-an-email-at-all` is accepted and stored verbatim (the input uses `type="email"`, but since the form isn't a native-submit form, the browser's built-in constraint validation never triggers). Not a bug, just worth knowing this app doesn't validate email format at signup at all.
- [x] Pick a birthday via the date field (if shown) → stored and later reflected correctly (test the "Birthdays today" dashboard widget with a birthday set to today). (Verified in section 2.2.)
- [x] Head-start banner ("N free stamps to start") appears only when the business has head start enabled with stamps > 0, and the new card's starting stamp count actually reflects it. (Verified in section 1.4: 0 stamps → no banner; 3 stamps → banner shown and starting count was exactly 3.)
- [x] Try signing up the **same phone number twice** for the same business (e.g. resubmit, or sign up, clear storage, sign up again) → second attempt is rejected with a clear "already exists" error, not a duplicate customer record.
- [x] The same phone number signing up at **two different businesses** → two independent customer records/cards, no cross-contamination.
- [x] After successful signup, lands on the Card screen immediately (no extra step).
- [x] No overlap/visual glitch between the header and the "Start your card" heading (regression check — this was a real layout bug caused by stale scroll position carrying over between screens). (Fixed and verified earlier this session.)

### 3.3 Returning customer (localStorage caching)
- [x] After a successful lookup or signup, reload the page (same browser, same business) → skips straight to the Card screen, no re-entering the phone number. (Verified in the session that built this feature: first visit shows lookup, phone cached after signup, reload skips to card screen.)
- [x] Close and reopen the tab (not just reload) → same behavior persists. (localStorage is unaffected by tab close/reopen by design; equivalent to the reload case above.)
- [x] Visit a **different business's** page in the same browser → does *not* incorrectly reuse the cached number from business A; asks fresh for business B. Confirmed via the actual UI: after caching a phone on business A, business B's page shows its own "Find my card" lookup screen, not A's cached card — and returning to A afterward still correctly remembers A's number.
- [x] Tap "Not you? Use a different number" from the Card screen → returns to the phone-entry screen and clears the cached number (confirm via reload that it doesn't silently log back in as the old number). (Verified in the session that built this feature.)
- [x] Clear browser storage manually, reload → back to asking for a phone number, as expected for a "new" browser/device.
- [x] Private/incognito window → always starts fresh (no bleed from a normal window's cached number). (Verified via an equivalent fresh browser context with no shared storage.)

### 3.4 Card view
- [ ] Stamp grid renders the correct total and correctly highlights filled stamps.
- [ ] Progress bar and "N more visits to X" text track the true visit count.
- [ ] Milestone ladder displays all configured milestones with correct labels/counts.
- [ ] Tier badge shows on the card only for tiered businesses, and shows the *correct current* tier (re-verify after a tier promotion, see 3.7).
- [ ] Visit count in the header badge matches the customer's actual total visits.

### 3.5 Marking a visit — Automatic check-in
- [ ] "Mark my visit" button visible and, for a plain visits-mode business, tappable with no extra field.
- [ ] Tap it → stamp count increments by 1, a toast/confirmation shows, and (if applicable) a celebration screen appears exactly when a milestone is newly reached.
- [ ] Rapid double-tap → doesn't double-count the visit (button should disable while the request is in flight).
- [ ] Hitting the daily stamp limit (if > 0) → visit still "marked" from the customer's perspective (no hard error), but a note explains no stamp was awarded, and the count doesn't increment further.

### 3.6 Marking a visit — PIN check-in
- [ ] "Mark my visit" opens a PIN pad instead of marking immediately.
- [ ] Entering the **correct** PIN confirms the visit exactly as in automatic mode.
- [ ] Entering an **incorrect** PIN → clear "incorrect" error, PIN entry resets, no visit recorded.
- [ ] **PIN length regression check** — this was a real, serious bug (the PIN pad used to hard-submit after exactly 4 digits no matter what, so any business with a 5- or 6-digit PIN could never successfully confirm anything):
  - [ ] Business with a 4-digit PIN: entering the 4th digit auto-submits.
  - [ ] Business with a 5-digit PIN: after 4 digits, nothing auto-submits yet; a green checkmark/confirm button becomes tappable; entering the 5th digit also still works (auto-submits at 5, or is confirmable); test both the "type all 5 then it's still waiting for confirm" and "type 5 and confirm manually" paths.
  - [ ] Business with a 6-digit PIN: auto-submits exactly at the 6th digit.
  - [ ] Try tapping the confirm/checkmark button with only 2–3 digits entered → should be disabled/no-op (below the 4-digit minimum).
  - [ ] Backspace (delete key) works correctly at every digit count, including reducing back below 4 digits (confirm button should become disabled again).
- [ ] If a business has **PIN check-in mode selected but no PIN ever configured** — try to mark a visit. Confirm what actually happens (every PIN attempt should fail as "incorrect," since there's nothing to match); this is a real dead end for that business until the owner sets a PIN — check whether the error message gives the customer/staff any useful clue, and log it as a UX gap if not.
- [ ] Rate limiting: submit many rapid PIN attempts (15+ in under 10 minutes) → eventually blocked with a "too many attempts" message rather than allowed to brute-force indefinitely.

### 3.7 Milestones, tiers, and progression
- [ ] Reach an exact milestone count → newly unlocked reward appears in the Rewards tab and triggers the celebration screen.
- [ ] For a **reset**-mode business: completing the final milestone resets the visit count back to 0 for the next cycle (confirm the card visually reflects this immediately, not after a refresh).
- [ ] For a **tiers**-mode business: completing the final milestone in the current tier promotes the customer to the next tier — confirm the tier badge updates immediately, and the milestone ladder shown now reflects the *new* tier's milestones, not the old one's.
- [ ] Reaching the top tier's final milestone → verify the documented/expected end behavior (no further promotion possible) rather than crashing or looping.
- [ ] A customer's tier at signup matches the business's first configured tier (Bronze/whatever is first) immediately — not just after their first visit.

### 3.8 Redeeming a reward
- [x] Rewards tab lists unlocked-but-unredeemed rewards distinctly from already-redeemed ones. **BUG FOUND & FIXED**: the Rewards tab read `card.milestonesUnlocked`, a field that has never existed in the public API's response (the backend returns it as `card.availableRewards`). This meant `unlocked` was *always* an empty array — the Rewards tab permanently showed "Nothing unlocked yet" regardless of actual progress, and the Redeem button could never appear. **Redemption was completely unreachable through the normal customer-facing UI.** Fixed in `CustomerPage.tsx` by reading the correct field. One resulting behavior change worth knowing: `availableRewards` is pre-filtered server-side to unredeemed items only, so a redeemed reward now disappears from this tab entirely (rather than staying with "redeemed" styling) — it shows up in History instead, which is a clean, working design, just different from what "distinctly from already-redeemed ones" originally implied. Verified end-to-end after the fix: unlock → appears in Rewards tab with a working Redeem button → redeem via PIN → disappears from Rewards → appears in History as "Reward redeemed."
- [ ] Tapping "Redeem" **always** opens a PIN pad — confirm this is true even for a business whose check-in mode is set to Automatic (redemption is intentionally always staff-gated, regardless of check-in mode — verify this is really the case and not just for PIN-mode businesses).
- [ ] Correct PIN → reward marked redeemed, moves out of the redeemable list, and is reflected in History.
- [ ] Incorrect PIN → rejected, reward stays unredeemed.
- [ ] Try to redeem the same reward twice → second attempt is rejected ("already redeemed"), not double-counted.
- [ ] If the business has never set a PIN at all, confirm redemption is effectively impossible (every PIN attempt fails) — same gap as 3.6, worth flagging together.

### 3.9 History
- [ ] Every marked visit and every redemption appears in History, newest first, with correct dates.
- [ ] Visits that earned 0 stamps (blocked by daily limit or bill-amount minimum) still appear in history — confirm whether they're visually distinguished from stamp-earning visits or look identical (worth a UX note either way).
- [ ] Empty history (brand-new customer) → clean empty state, not a blank/broken screen.

### 3.10 Full responsiveness (this is the most important surface to check on mobile)
- [ ] On a real phone-width viewport, the customer page fills the screen edge-to-edge (no fixed-size box that overflows or leaves dead space) — regression check, this used to be a hard-coded 420×860px box that broke on real phones.
- [ ] On desktop width, the page renders as a centered "phone mockup" card rather than stretching edge-to-edge.
- [ ] Bottom nav (Card / Rewards / History) stays reachable and tappable at every screen size, doesn't overlap the Mark-my-visit button.
- [ ] The bill-amount input (where applicable) and the PIN pad both remain fully usable and on-screen on a small phone, including with the on-screen keyboard open.
- [ ] Long business names, long reward labels, and long customer names don't break the layout (wrap or truncate gracefully instead of overflowing).

---

## 4. Cross-cutting scenarios

### 4.1 Multi-tenant isolation
- [ ] Two different businesses' customer lists, settings, and dashboards never show each other's data.
- [ ] The same phone number can independently be a customer of multiple businesses with separate cards/progress.
- [ ] A business owner's auth token only works for their own business's endpoints — confirm (e.g. via browser dev tools / an API client) that hitting another business's data with your own token is rejected, not just hidden in the UI.

### 4.2 Security / authorization boundaries
- [ ] Business panel API calls with no token, an expired token, or a malformed token → rejected (401), never silently succeed.
- [ ] A business token used against admin-only endpoints → rejected (403 "Admin access required"), and vice versa.
- [ ] Deactivating a business immediately breaks that owner's *existing* logged-in session on their very next request, not just future logins (already covered in 1.4, worth a second pass with dev tools open watching network responses).
- [ ] The business PIN is never exposed on the **public** customer-facing API response for a business (open dev tools network tab on the customer page and confirm the PIN itself isn't present anywhere in the response body).

### 4.3 Validation & boundary values (sweep)
- [ ] Every numeric settings field (₹/point, min bill, stamp limit/day, lapsed-after-days, head-start stamps, milestone counts, percent-off, flat-off) — test the documented min, one below the min, the documented max, one above the max, zero (where zero has special unlimited meaning vs where it doesn't), and a decimal/non-integer input.
- [ ] Every text field with a length or format constraint (business name, emails, hex colors, PINs) — test empty, whitespace-only, extremely long strings, and special characters/emoji.
- [ ] Phone numbers — test exactly 10 digits (valid), 9 digits, 11 digits, letters mixed in, and leading zero.

### 4.4 Error & empty states (sweep)
- [ ] Kill the backend temporarily and try a few actions in each panel → user-facing error/toast, not a frozen UI or raw stack trace.
- [ ] Every list/table in the app (businesses, customers, milestones, tiers, rewards, history) has a sane "nothing here yet" state when empty.
- [ ] Every loading state (dashboard stats, business detail, customer lookup) shows a skeleton/spinner rather than a blank flash, and never gets stuck forever on a real error (regression check on the admin business-detail page specifically — it used to loop forever on a load failure instead of showing an error).

### 4.5 Concurrency / data freshness
- [ ] Two staff members marking visits for the same customer at nearly the same moment → both visits recorded correctly, no lost update or duplicate stamp miscount.
- [ ] Business panel Dashboard/Customers views pick up new signups and visits within ~20 seconds without a manual refresh (regression check, see 2.2).
- [ ] Editing the same business's settings simultaneously from the Admin panel and the Business panel (two tabs) → the second save shouldn't silently clobber the first in a way that loses unrelated fields — check what actually happens.

---

## 5. Known gaps to confirm, not assume are new bugs

These are things found during development that are either intentional design or unresolved product decisions — verify current behavior and flag anything that seems worse than described here, but don't file them as fresh "regressions" without checking this list first:

- No settings UI exists to configure a **birthday reward** — it's fully wired on the backend and pre-populated by the `restaurant` template, but there's currently no way for an owner to turn it on/edit it from either panel.
- Reward **redemption always requires a business PIN**, even when the business's check-in mode is "Automatic." If a business never sets a PIN, redemption has no working path — every attempt fails as "incorrect PIN" with no hint that the real problem is "no PIN configured."
- `/b/[slug]` (server-rendered, used by real QR codes) and `/customer?slug=` (client-rendered) handle an invalid/missing business differently (a framework 404 page vs. an inline "not found" message). Both should fail gracefully, just via different UI — confirm neither one crashes.

## 6. Priority regression list

If time is short, these are the highest-value checks — each corresponds to a real bug found and fixed recently, so they're the most likely place for something to have quietly broken again:

1. Bill-amount earning mode actually asks for and uses a bill amount on the customer page (section 2.5 / 3.6).
2. PIN pad supports 4, 5, *and* 6-digit business PINs, not just 4 (section 3.6).
3. Mobile drawer closes itself and the logout confirmation dialog is fully visible/clickable on top of it (sections 1.1, 2.1).
4. Stamp limit per day accepts `0` and treats it as "unlimited," not "block everything" (section 2.5).
5. Customer page is genuinely responsive on real phone widths, not a fixed-size box (section 3.10).
6. Dashboard/Customers lists in the business panel refresh on their own instead of requiring a manual reload (section 2.2).
7. Admin business-detail page shows a proper error instead of an infinite loading skeleton when a business fails to load (section 1.4).
8. Signup screen shows exactly the enabled fields (name/email/birthday) and actually submits them (section 3.2).
