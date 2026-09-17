# UI kit — Customer page

Mobile web, 420px, no app and no login. Built from the BRD's customer flow:

1. **Lookup** — the NFC tag has been tapped; the page is already branded with the
   business's logo and colour. Phone number is the only identifier.
2. **Signup** — shown when the number is new. Only the fields the business enabled
   (here: name + birthday). Head-start stamps are announced as a mint sticker.
3. **Card** — stamp grid, progress to the next milestone, the full ladder, and the
   one primary action pinned above the bottom bar.
4. **PIN** — the phone is handed to staff. Demo PIN is `4821`.
5. **Celebration** — fires when a stamp lands exactly on a milestone.
6. **Rewards / History** — unlocked and redeemed rewards; visit log.

Redemption always requires the PIN. Check-in here is set to PIN mode; in automatic
mode the `Mark my visit` button calls `markVisit()` directly and skips the pad.
