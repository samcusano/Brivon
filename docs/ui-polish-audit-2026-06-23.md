# Brivon UI Polish Audit

**Skill:** `make-interfaces-feel-better`
**Date:** 2026-06-23
**Mode:** Audit-only — no code changed
**Scope:** All production pages/components (`client/src/pages/__design_lab` excluded from priority per CLAUDE.md)

## Summary

| Principle | Status | Severity |
| --- | --- | --- |
| Scale on press (#12) | ❌ Missing app-wide — base `Button` has none | **P0** |
| `will-change` misuse (#15) | ❌ `will-change: transform, left, top` | **P0** |
| `transition: all` (#14) | ❌ 1 utility + ~30 production usages | **P1** |
| Text wrapping (#10) | ❌ No page headings use `balance`/`pretty` | **P1** |
| Image outlines (#11) | ❌ 0 of 11 `<img>` have an outline | **P2** |
| Tabular numbers (#9) | ⚠️ Good in AdvocatePortal, gaps elsewhere | **P2** |
| Concentric radius (#1) | ⚠️ Needs spot-verification | **P2** |
| Skip-animation-on-load (#13) | ⚠️ Borderline, review only | **P3** |
| Font smoothing (#8) | ✅ Already applied at root | — |

---

## P0 — Highest leverage

### Scale on press (#12)

The base `Button` (`client/src/components/ui/button.tsx:8`) only has `transition-colors` — **no tactile press feedback anywhere it's used**, which is most clickable surfaces in the app. The only `active:scale` in the codebase lives in `__design_lab` and uses `0.95` (skill mandates exactly `0.96`).

| Location | Current | Recommended |
| --- | --- | --- |
| `ui/button.tsx:8` (cva base) | `...transition-colors...` | Add `transition-transform` + `active:not-disabled:scale-[0.96]`; expose a `static` prop to opt out |
| `__design_lab/FeedbackOverlay.tsx:303` | `active:scale-95` | `active:scale-[0.96]` — below `0.95` feels exaggerated |

Single highest-impact change: fixing the base `Button` propagates tactile feedback everywhere at once.

### `will-change` misuse (#15) + animating layout props

`client/src/index.css:302`

| Location | Current | Recommended |
| --- | --- | --- |
| `index.css:302` `.halfCircle-caregivers__faceWrap` | `will-change: transform, left, top;` | `will-change: transform;` — `left`/`top` can't be GPU-composited, so listing them wastes a layer hint |
| Same element animates `left`/`top` | layout-triggering animation | If positions animate, drive them with `transform: translate()` instead of `left`/`top` to stay on the compositor |

---

## P1

### `transition: all` (#14)

~30 production occurrences (plus 7 in `__design_lab`). Worst offenders are a shared utility and an animating width:

| Location | Current | Recommended |
| --- | --- | --- |
| `index.css:173` `.smooth-transition` | `@apply transition-all ...` | Bake the anti-pattern out of the shared utility — specify properties, or retire it |
| `ui/progress.tsx:21` | `transition-all` on a width bar | `transition-[width]` (or animate `transform: scaleX`) |
| `ui/tabs.tsx:30`, `accordion.tsx:29`, `input-otp.tsx:42`, `toast.tsx:26`, `sidebar.tsx:295` | `transition-all` | Scope to the properties that actually change (`transition-[color,box-shadow]`, etc.) |
| Pages: `AdvocatePortal.tsx` (×4), `MatchIntake.tsx` (×4), `PatientCase.tsx` (×2), `PatientCases.tsx` (×2), `SecondOpinion.tsx:59`, `CaseDashboard.tsx:358`, `AdvocateOnboarding.tsx:1261`, `SourcePanel.tsx:134`, `ChatMessage.tsx:97`, `QuestionQueue.tsx:94` | `transition-all` | Most only change `box-shadow`/`border-color`/`transform` — replace with the explicit list |
| `ui/navigation-menu.tsx:58` | bare `transition` | `transition-transform` (only `rotate` changes) |

### Text wrapping (#10)

No page-level heading uses `text-balance`, and body copy doesn't use `text-pretty`. Only 3 shadcn primitives (`field`, `empty`, `item`) use it. High-visibility headings like `AppealIntake.tsx:163` ("Your claim was denied. Let's fight back.") will orphan words.

| Location | Current | Recommended |
| --- | --- | --- |
| Page `<h1>/<h2>` (AppealIntake, PatientCase, SecondOpinion, OnboardingStatus, AppealCasePage, etc.) | default wrapping | Add `text-balance` to headings (≤6 lines) |
| Body paragraphs / descriptions / card text | default wrapping | Add `text-pretty` to prevent last-line orphans |

---

## P2

### Image outlines (#11)

0 of 11 `<img>` tags have the subtle separator outline.

| Location | Recommended |
| --- | --- |
| `ScrollMorphHero.tsx:109,143`, `HalfCircleCaregivers.tsx:187,250`, `PatientCases.tsx:71`, `AdvocateOnboarding.tsx:285`, `MatchIntake.tsx:563`, `PatientCaseDashboard.tsx:379`, `Marketplace.tsx:470`, `CaseDashboard.tsx:194`, `AdvocateDetail.tsx:314` | Add `outline outline-1 -outline-offset-1 outline-black/10` (pure black, not a tinted neutral) |

### Tabular numbers (#9)

Well-applied in `AdvocatePortal` (counts/ages) and `chart.tsx`. Gaps: progress percentages and dynamic counts in `SecondOpinion.tsx`, `MatchIntake.tsx`, `AdvocateOnboarding.tsx` progress bars and any case-count displays — verify and add `tabular-nums` where digits update.

### Concentric radius (#1)

Couldn't confirm by grep — needs visual spot-check on nested cards (e.g. `PatientCases.tsx:66` `rounded-2xl` card with inner elements, the design-lab variants). Flagged for manual verification rather than asserting a violation.

---

## P3 / Review-only

- **Skip animation on load (#13):** `AppealIntake.tsx:157` and `AdvocatePortal.tsx:196` use `AnimatePresence mode="wait"` without `initial={false}`, so the first step/panel animates in on mount. Borderline-intentional for a multi-step entrance — review visually before deciding; don't blindly add `initial={false}` or you'll kill the intended entrance.
- **Font smoothing (#8):** ✅ Already correct — `antialiased` at root (`index.css:153`). No change needed.

---

## Recommended fix sequence

1. **P0** — base `Button` press scale + the `will-change`/layout-animation fix. Biggest perceived-quality jump for the least code.
2. The `.smooth-transition` utility and `progress.tsx`.
3. A typography pass adding `text-balance`/`text-pretty`.
4. P2 image outlines and remaining `tabular-nums`.
