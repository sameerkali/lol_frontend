---
description: Audit the current diff (or $ARGUMENTS) for code that shouldn't have been written
argument-hint: "[optional: file path, PR number, or branch — defaults to the working diff]"
---

Review $ARGUMENTS (or, if nothing is given, the current uncommitted diff via `git diff` and `git diff --staged`) for code that exists but shouldn't, using this lens — separate from a correctness review:

For each changed file, check for:
- **Unnecessary existence** — code added for a case the task doesn't have, a "just in case" branch, or a feature no caller uses yet.
- **Reinvented wheels** — new code that duplicates something already in this codebase, the stdlib, the framework, or an already-installed dependency.
- **Premature abstraction** — a helper, interface, or config option built for a second use case that doesn't exist yet.
- **Padding** — a one-liner wrapped in unnecessary structure (a class for one function, a config object for one flag, indirection with only one implementation).
- **Speculative flexibility** — parameters, feature flags, or extension points added for imagined future requirements rather than the actual request.

Do **not** flag any of these as over-engineering even if they add lines — these are the guardrails that stay regardless of size:
- Input validation at trust boundaries
- Error handling for real failure modes
- Security-sensitive logic
- Accessibility
- Anything preventing data loss
- Tests the task calls for

Report findings as a short list, each with: the file/line, what's there, why it's more than the task needs, and the smaller alternative (cite the existing thing to reuse, the stdlib/platform feature, or the one-liner). If nothing qualifies, say so plainly rather than inventing findings — a clean lean diff is a fine outcome.

Do not modify any files during this review — report only, unless the user asks you to apply the trims afterward.
