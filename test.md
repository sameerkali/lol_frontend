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
- [ ] Log in with correct admin credentials → lands on `/admin` (Businesses list).
- [ ] Log in with wrong password → clear error shown, not a silent failure or crash.
- [ ] Log in with an email that doesn't exist → same generic "invalid email or password" error (shouldn't reveal whether the email exists).
- [ ] Leave email or password blank and submit → inline validation error, no network call.
- [ ] Enter a malformed email (`notanemail`) → inline validation catches it before submit.
- [ ] Refresh the page while logged in → stays logged in (session persists).
- [ ] Open `/admin` directly in a fresh tab with no prior login → redirected to `/admin/login`.
- [ ] Manually edit/clear the stored auth token (localStorage) then navigate → treated as logged out.
- [ ] Log out via the sidebar → confirmation dialog appears (title "Log out?") before actually logging out; **Cancel** keeps you logged in; **Log out** signs out and redirects to `/admin/login`.
- [ ] **Mobile**: open the hamburger drawer, tap Logout → the drawer closes and the confirmation dialog is fully visible and clickable (not obscured by the drawer or backdrop).

### 1.2 Businesses list
- [ ] List loads and shows all existing businesses with name, plan, customer count, status.
- [ ] Top stat cards (Businesses / Customers / Visits) show sensible non-negative numbers.
- [ ] Search by business name → list filters live.
- [ ] Search by slug → matches.
- [ ] Search by owner email → matches.
- [ ] Search with no matches → "No businesses yet" (or equivalent empty state), not a blank screen or error.
- [ ] Clear the search → full list returns.
- [ ] Click a business row → navigates to that business's detail page.
- [ ] Click "Open" button on a row → same destination as clicking the row.
- [ ] Click the row's delete (trash) icon → native confirm() prompt appears; Cancel does nothing; Confirm deletes the business and removes it from the list without a full page reload.
- [ ] **Mobile**: table scrolls horizontally without breaking page layout; stat cards wrap instead of overflowing.

### 1.3 Create business
- [ ] Navigate via "New business" button → goes straight to the Create business form (no intermediate dialog).
- [ ] Submit with all fields blank → inline errors on name / owner email / owner password, no request sent.
- [ ] Enter a business name only, leave email/password blank → still blocked with per-field errors.
- [ ] Enter an invalid email format → inline error.
- [ ] Enter a password under 8 characters → inline error ("at least 8 characters").
- [ ] Enter a valid name/email/8+ char password → Create button enables, submission succeeds, redirects to the Businesses list, and the new business appears in it.
- [ ] Try creating a second business with the **same owner email** as an existing one → server rejects with a clear conflict error ("A business with this owner email already exists"), surfaced on the form (not just a console error).
- [ ] Optional Staff PIN field: leave blank → business is created with no PIN set.
- [ ] Optional Staff PIN field: enter 3 digits → validation error (PIN must be 4–6 digits).
- [ ] Optional Staff PIN field: enter 7 digits → validation error.
- [ ] Optional Staff PIN field: enter exactly 4, 5, and 6 digits (test each) → all accepted.
- [ ] Optional Staff PIN field: enter non-numeric characters → rejected.
- [ ] **Template picker** — create one business per template and confirm the resulting settings match:
  - [ ] **Café**: visit-based earning, automatic check-in, 1 stamp/day limit, 2-milestone ladder (5 visits / 10 visits), no tiers, only "name" signup field.
  - [ ] **Restaurant**: bill-amount earning (₹200/point), PIN check-in, head-start of 1 stamp enabled, all three signup fields (name/email/birthday) on, tiers enabled (Silver → Gold) instead of a flat milestone ladder, birthday reward pre-configured.
  - [ ] **Blank / custom**: visit-based, automatic check-in, single 10-visit milestone, nothing else pre-filled.
- [ ] Cancel button on the create form → discards input and returns to the Businesses list without creating anything.
- [ ] **Mobile**: all fields, the template picker, and the Create/Cancel buttons remain usable and non-overflowing at narrow width.

### 1.4 Business detail — tab by tab
Open a business you created above (`/admin/businesses/[id]`) and go through every tab. These are the same settings components the business owner sees in their own panel — the difference is admin can edit *any* business here without owning it.

- [ ] Header shows business name, active/inactive badge, slug, and owner email correctly.
- [ ] **Earning & check-in**:
  - [ ] Switch earning mode between Visits / Bill amount / Visits with minimum bill — the right fields show/hide (₹-per-point only for bill amount; minimum bill amount only for the third mode).
  - [ ] Enter an out-of-range ₹-per-point (e.g. 0 or a huge number) → validation blocks save.
  - [ ] Toggle "Bill amount field" switch on/off, save, and re-open the tab → persisted correctly.
  - [ ] Change "Visit confirmation" between Automatic and PIN → saved and reflected on reload.
  - [ ] Stamp limit per day: try `-1` → rejected/clamped. Try `0` → **accepted** (means unlimited, not zero visits — verify on the customer page that a business with limit 0 lets a customer earn stamps on multiple visits in the same day). Try a very large number (e.g. 9999) → either accepted or clamped at the documented max; confirm it isn't silently ignored.
  - [ ] "Mark customer lapsed after (days)" — try 0 and a negative number → rejected; try a normal value (30, 90) → saved.
  - [ ] Save with an invalid field present → Save button stays disabled and an inline "fix the highlighted fields" message shows, not a failed network call.
- [ ] **Milestones**:
  - [ ] Default "reset" mode: add/edit/remove milestones in the ladder; each milestone needs a count, reward type, value, and label — try leaving one blank and confirm Save is blocked with a clear per-field error.
  - [ ] Switch "After the final milestone" to "Move to the next tier" → the milestone ladder editor is replaced by the Tiers editor.
  - [ ] On a business with zero tiers configured, click **"Set up 10 tiers"** → generates a full 10-tier ladder (Bronze → Legend) with sane defaults, and Save is immediately enabled (not blocked by empty-required-field validation).
  - [ ] Edit a tier's name to blank → inline "Required" error, Save blocked.
  - [ ] Add a custom tier manually via "Add tier" instead of the generator → works, with its own milestone sub-ladder.
  - [ ] Delete a tier → removed from the list; deleting all tiers down to zero blocks Save (tiers mode requires at least one tier).
  - [ ] Switch from "next tier" back to "reset" → milestone ladder editor reappears; verify no data loss/corruption switching back and forth before saving.
  - [ ] Save tiers, then check the **Customers** tab and **Dashboard** — a newly signed-up customer should show the first tier immediately, and the dashboard's "Customers by tier" widget should reflect real counts.
- [ ] **Signup & rewards**:
  - [ ] Toggle each signup field (name / email / birthday) independently, save, and confirm on the actual customer signup page (`/b/[slug]`) that exactly the enabled fields appear — not more, not fewer.
  - [ ] Head start: enable it and set a stamp count (0 and a positive number) → a brand-new signup should reflect the head-start stamps immediately on their card, and the customer signup screen should show the "free stamps to start" banner only when `enabled && stamps > 0`.
  - [ ] Head start stamp count: try a negative number → rejected.
- [ ] **Branding**:
  - [ ] Change primary/secondary color via the hex inputs. Try an invalid hex (`#zzz`, missing `#`, too short) → validation error, Save blocked.
  - [ ] Save a valid color pair → the customer page's top bar tone should reflect the new primary color.
- [ ] **PIN**:
  - [ ] Set a brand-new 4-digit PIN → saved, and the reveal ("Show"/"Hide") toggle on the Dashboard and here works correctly (masks by default).
  - [ ] Change an existing PIN to a different value (try 5 and 6 digit lengths too, not just 4) → saved.
  - [ ] Enter fewer than 4 or more than 6 digits → rejected before save.
  - [ ] Enter non-numeric input → rejected.
  - [ ] After setting a 5- or 6-digit PIN here, go confirm a visit on the customer page in PIN mode and verify the full PIN (not just the first 4 digits) is required to confirm — **this was a real bug**, treat it as a priority regression check.
- [ ] **QR & link**:
  - [ ] QR image renders and the link under it matches `.../b/[slug]`.
  - [ ] "Copy link" copies the correct URL to the clipboard (paste it somewhere to confirm).
  - [ ] "Download PNG" downloads a valid, scannable QR image named after the business slug.
  - [ ] Scan the QR with an actual phone camera (or a QR reader) → opens the correct customer page.
- [ ] **Owner account**:
  - [ ] Reset the owner's password here (admin override, no current password needed) to a new value → log in on `/business/login` with the new password to confirm it actually took effect.
  - [ ] Try a password under 8 characters → rejected.
  - [ ] Owner email field is read-only here (cannot be edited) — confirm that's the case.
- [ ] **Plan & status** (header controls, not a tab):
  - [ ] Change plan (Trial/Basic/Pro) via the dropdown → persists on reload.
  - [ ] Click Deactivate → confirmation dialog warns the owner will be logged out and their customer page stops working; confirm it, then:
    - [ ] Owner's existing business-panel session (in another tab/browser) starts failing its next request (403) instead of silently continuing to work.
    - [ ] Owner cannot log back into `/business/login` while inactive (clear "account is inactive" error).
    - [ ] The customer-facing page (`/b/[slug]`) for that business now shows "not available"/not found instead of the normal card flow.
  - [ ] Click Activate on an inactive business → everything above is restored (login works again, customer page works again).
- [ ] **Danger zone**:
  - [ ] Delete button is disabled/no-ops until you type the business's exact name into the confirmation field.
  - [ ] Typing the wrong name (typo, different case) keeps Delete disabled.
  - [ ] Typing the exact name enables Delete; confirm it removes the business, its customers, and its visit history, and redirects back to `/admin`.
  - [ ] After deletion, hitting the old `/admin/businesses/[id]` URL directly (e.g. via back button or bookmark) shows a proper "couldn't be loaded" state — **not an infinite loading skeleton** (this was a real bug, verify the fix holds).
- [ ] Tab content doesn't bleed between businesses: open business A's Milestones tab, navigate to business B, confirm B's data loads fresh (not a stale cache of A's settings).
- [ ] **Mobile**: every tab above remains usable at narrow width — tab pills wrap, forms stack, nothing overflows horizontally.

---

## 2. Business Panel

Test as the owner of a business you created above (or `farzi cafe`, the existing production-ish business — **be careful not to leave test data in it**; prefer a disposable test business for anything destructive).

### 2.1 Login & session
- [ ] Log in with correct owner email/password → lands on `/business/[id]` (Dashboard).
- [ ] Wrong password / unknown email → clear, generic error.
- [ ] Log in to a **deactivated** business → explicit "account is inactive" error, not a generic failure.
- [ ] Refresh mid-session → stays logged in.
- [ ] Log out via sidebar → confirmation dialog, Cancel/confirm both behave correctly.
- [ ] **Mobile**: open the drawer, tap Logout → drawer closes, confirmation dialog fully visible and its buttons are clickable (regression check — this was broken: the dialog used to render underneath the drawer).

### 2.2 Dashboard
- [ ] Stat tiles (Total customers, Visits 30d, Redemptions 30d, Repeat visit rate) load and show real numbers, not stuck on a loading skeleton.
- [ ] "Customers by tier" widget: absent entirely for a business not using tiers; present and accurate (counts sum to total tiered customers) for one that is.
- [ ] "Birthdays today 🎉" widget: only appears when at least one customer's birthday (MM-DD) matches today's date; shows name/phone for each.
- [ ] Business PIN widget: shows "Not set" if no PIN configured; shows masked dots with a working Show/Hide toggle if one is; "Change" button jumps to Settings → PIN tab.
- [ ] "Recent customers" list shows up to 5 most recent, each with visit/point counts and a tier badge (or "—" if untiered).
- [ ] Sign up a brand-new customer from another tab/device while the Dashboard stays open → within ~20 seconds the numbers/recent list update on their own (regression check — this used to require a manual page refresh to see new signups).
- [ ] Empty business (zero customers): dashboard doesn't crash, shows sensible zero/empty states throughout.

### 2.3 Milestones
- [ ] Same checks as Admin → Business detail → Milestones (section 1.4) — verify the owner-facing version behaves identically to the admin override version.
- [ ] Saved changes here are visible immediately to admin viewing the same business.

### 2.4 Customers
- [ ] List loads with columns: Name, Phone, Visits, Points, Tier, Last visit.
- [ ] Search by phone (partial match) → filters correctly.
- [ ] Sort: Newest first / Most visits / Last visit — each reorders the list correctly.
- [ ] Sort by **Tier** (only appears once the business has tiers) → highest tier customers sort to the top.
- [ ] Filter by a specific tier (dropdown only shows once tiers exist) → list narrows to just that tier; "All tiers" clears it.
- [ ] "Unredeemed rewards only" checkbox → narrows to customers with at least one unredeemed unlocked milestone.
- [ ] Combine two filters at once (e.g. tier + unredeemed) → both apply together (AND, not OR).
- [ ] Zero customers / zero matches → clear empty state, not a broken table.
- [ ] Export CSV → downloads a file containing exactly the enabled signup fields (name/email/birthday) plus visit/point/redemption stats; matches whatever filter/search was active at the time.
- [ ] **Mobile**: table scrolls horizontally in its own container; the rest of the page doesn't shift.

### 2.5 Settings → Earning & check-in
- [ ] All checks from section 1.4's Earning & check-in already cover the shared component — re-verify saving from the business panel side specifically (not just admin).
- [ ] **Bill amount required field, end to end** (regression check — previously this was completely broken, businesses on "Bill amount" or "min bill" modes awarded zero stamps no matter what):
  - [ ] Set earning mode to **Bill amount**, save. Go to the customer page, mark a visit — a "Bill amount (₹)" field must appear before the Mark/PIN button, and the button must stay disabled until a value is entered.
  - [ ] Enter a bill amount and confirm the visit → stamps earned should equal `floor(billAmount / amountPerPoint)`. Try a couple of values and check the math server-side (customer's point total in the business panel).
  - [ ] Enter `0` or leave it blank and try to proceed → blocked client-side; if bypassed, the backend should award 0 stamps and log the visit with an explanatory note, not error out.
  - [ ] Set earning mode to **Visits with a minimum bill**, turn the "Bill amount field" switch **on**, set a minimum, save. On the customer page: a bill below the minimum → visit logged, 0 stamps; a bill at/above the minimum → 1 stamp.
  - [ ] Same mode with the "Bill amount field" switch turned **off** → no bill field shown to the customer at all, every visit earns 1 stamp regardless of spend.
  - [ ] Test bill-amount entry under **both** check-in modes (Automatic and PIN) — the field must appear in both, not just one.
- [ ] Stamp limit per day = 0: confirm a customer can mark multiple visits in the same calendar day and each earns stamps (no daily cap applied).
- [ ] Stamp limit per day = 1 (default) or higher N: confirm the (N+1)th visit same day is still logged but awards 0 stamps with a "daily limit reached" note, and doesn't error out.

### 2.6 Settings → Signup & rewards
- [ ] Toggle signup fields and head start as in 1.4; re-verify from the business-panel side.
- [ ] Note: there is currently **no UI here to configure a birthday reward**, even though the backend/data model fully supports one (visible on `restaurant`-template businesses, which get a birthday reward pre-configured at creation). Confirm this is expected/known rather than assuming it's brand-new broken behavior, but flag it if you think owners should be able to edit it and currently can't.

### 2.7 Settings → Branding
- [ ] Same as 1.4's Branding checks, from the owner's own panel.

### 2.8 Settings → PIN
- [ ] Set/change PIN — no "current PIN" confirmation should be required (this app's design choice: the PIN is always owner-visible, and the login token already proves ownership). Confirm that's indeed the current behavior.
- [ ] 4, 5, and 6-digit PINs all save correctly.
- [ ] Reveal/hide toggle on the Dashboard's PIN widget matches whatever was just set here.

### 2.9 Settings → Account
- [ ] Change password: requires current password + a new one ≥ 8 characters.
- [ ] Wrong current password → rejected with a clear error.
- [ ] Successful change → log out and log back in with the new password to confirm it stuck.

### 2.10 QR Code
- [ ] Same checks as 1.4's QR & link tab, verified from the owner's own panel this time.

### 2.11 Mobile responsiveness (whole panel)
- [ ] Sidebar collapses to a hamburger + slide-down drawer under ~780px width.
- [ ] Every screen (Dashboard, Milestones, Customers, Settings — all sub-tabs, QR) renders with no horizontal scrollbar on the page itself at a 320–375px viewport.
- [ ] Forms with multiple fields stack vertically and remain fully usable (nothing clipped or unreachable).
- [ ] The 10-tier milestone editor specifically — this had a real overflow bug — confirm the tier-name input can't push the layout wider than the screen.

---

## 3. Customer-Facing Page

This is the actual product customers use — test it as if you were a real customer on a real phone, for each of several differently-configured test businesses (a plain visits-based one, a bill-amount one, and a tiers-based one).

### 3.1 First visit / lookup
- [ ] Visiting `/b/[valid-slug]` shows the business name/branding and a phone-number entry screen.
- [ ] Visiting `/b/[nonexistent-slug]` → a proper not-found page, not a crash.
- [ ] Visiting `/customer` with no `?slug=` → "No business specified" message.
- [ ] Visiting `/customer?slug=[nonexistent]` → inline "Business not found" message (note: this is a different failure mode than `/b/[slug]`'s — both should fail gracefully, just via different UI).
- [ ] Visiting the page for a **deactivated** business → not found / unavailable, not a broken card screen.
- [ ] Phone input only accepts digits, auto-formats as you type, and caps at 10 digits.
- [ ] "Find my card" stays disabled until 10 digits are entered.
- [ ] Look up a phone number that has never signed up → routes to the Signup screen.
- [ ] Look up a phone number that already has a card → routes straight to the Card screen.

### 3.2 Signup
- [ ] Only the fields enabled in that business's settings appear (test all 8 combinations of name/email/birthday on/off — or at minimum: all-off, all-on, and one mixed case).
- [ ] All fields optional except when explicitly required — confirm you can submit with only a phone number if no fields are enabled.
- [ ] Enter an email in an invalid format (if the email field is shown) → does the UI validate it, or does it just get silently dropped/accepted? Confirm the actual behavior either way.
- [ ] Pick a birthday via the date field (if shown) → stored and later reflected correctly (test the "Birthdays today" dashboard widget with a birthday set to today).
- [ ] Head-start banner ("N free stamps to start") appears only when the business has head start enabled with stamps > 0, and the new card's starting stamp count actually reflects it.
- [ ] Try signing up the **same phone number twice** for the same business (e.g. resubmit, or sign up, clear storage, sign up again) → second attempt is rejected with a clear "already exists" error, not a duplicate customer record.
- [ ] The same phone number signing up at **two different businesses** → two independent customer records/cards, no cross-contamination.
- [ ] After successful signup, lands on the Card screen immediately (no extra step).
- [ ] No overlap/visual glitch between the header and the "Start your card" heading (regression check — this was a real layout bug caused by stale scroll position carrying over between screens).

### 3.3 Returning customer (localStorage caching)
- [ ] After a successful lookup or signup, reload the page (same browser, same business) → skips straight to the Card screen, no re-entering the phone number.
- [ ] Close and reopen the tab (not just reload) → same behavior persists.
- [ ] Visit a **different business's** page in the same browser → does *not* incorrectly reuse the cached number from business A; asks fresh for business B.
- [ ] Tap "Not you? Use a different number" from the Card screen → returns to the phone-entry screen and clears the cached number (confirm via reload that it doesn't silently log back in as the old number).
- [ ] Clear browser storage manually, reload → back to asking for a phone number, as expected for a "new" browser/device.
- [ ] Private/incognito window → always starts fresh (no bleed from a normal window's cached number).

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
- [ ] Rewards tab lists unlocked-but-unredeemed rewards distinctly from already-redeemed ones.
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
