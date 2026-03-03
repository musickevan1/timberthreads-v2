# Phase 14: Tech Debt Cleanup and Phase 9 Verification - Research

**Researched:** 2026-03-03
**Domain:** Documentation verification, file deletion, REQUIREMENTS.md traceability update
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIC-07 | Duplicate pricing tier cards removed from Accommodations section (kept in Pricing section only) | Phase 9 executed this change in commit `7b78dfa`. Source-verified: Accommodations.astro contains only a teaser line; Rate Card block is absent. Needs VERIFICATION.md to formally close the gap. |
| MOBL-01 | Mobile header displays "Timber & Threads" text title alongside logo | Phase 9 executed this change in commit `7b78dfa`. Source-verified: Nav.astro brand span has `text-xl sm:text-2xl` without `hidden sm:block`. Playwright test `header brand text visible` covers all three viewport projects. Needs VERIFICATION.md to formally close the gap. |
</phase_requirements>

---

## Summary

Phase 14 is a documentation and cleanup phase — no production code changes. Three discrete tasks make up the full scope: (1) write a VERIFICATION.md for Phase 9 formally confirming that PRIC-07 and MOBL-01 are satisfied based on source inspection evidence and the existing Playwright test suite; (2) delete the orphaned `src/components/Connect.astro` file which has no importers and is a legacy artifact from Phase 2; and (3) update the REQUIREMENTS.md traceability table to mark PRIC-07 and MOBL-01 as Complete.

The core evidence is fully established. Phase 9 executed correctly: Nav.astro brand span has `text-xl sm:text-2xl` without `hidden sm:block` (MOBL-01 done), and Accommodations.astro has a pricing teaser paragraph with no Rate Card block (PRIC-07 done). The Playwright test suite added in Phase 13 includes `test('header brand text visible')` which runs across all three viewport projects (desktop-1280, mobile-375, mobile-320), providing automated coverage of MOBL-01. The PRIC-07 change is structurally verifiable via grep. Connect.astro is confirmed not imported anywhere — index.astro imports Contact.astro only; no other source file imports Connect.astro.

**Primary recommendation:** Three tasks in sequence — write Phase 9 VERIFICATION.md (cite grep evidence and Playwright test), delete Connect.astro, update REQUIREMENTS.md traceability table. No external dependencies, no library installs, no build changes.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.17.1 | Component framework | Project foundation — Connect.astro is an Astro component file |
| Playwright | (Phase 13 installed) | Test framework | Existing Playwright suite provides MOBL-01 automated coverage |

### Supporting

No additional libraries needed. All tasks are file deletion, markdown writing, and text editing.

### Alternatives Considered

None applicable. No implementation choices are involved — this is entirely verification documentation and file system cleanup.

**Installation:** None required.

---

## Architecture Patterns

### Current File State (Evidence for VERIFICATION.md)

**MOBL-01 — Nav.astro brand span (line 31):**
```html
<span class="font-serif text-xl sm:text-2xl text-stone-800 group-hover:text-brand transition-colors">Timber &amp; Threads</span>
```
- `hidden sm:block` is absent — brand text is visible at all viewports
- `text-xl sm:text-2xl` provides responsive font sizing without overflow

**MOBL-01 — Playwright test (tests/viewport.spec.ts lines 7-10):**
```typescript
test('header brand text visible', async ({ page }) => {
  // Brand text is always visible at all viewports — Phase 9 removed hidden sm:block
  await expect(page.locator('header').getByText('Timber & Threads')).toBeVisible();
});
```
This test runs across all three viewport projects (desktop-1280, mobile-375, mobile-320) — 3 automated assertions confirming MOBL-01 at every supported viewport.

**PRIC-07 — Accommodations.astro (line 125):**
```html
<p class="text-center text-stone-600 mt-8">
  Stays from <strong class="text-stone-800">$60/night per person</strong> — <a href="#pricing-calculator" class="text-brand hover:underline">see full pricing and estimate your stay</a>.
</p>
```
Rate Card block is absent. Single-line teaser with anchor to `#pricing-calculator` is present. No `<!-- Rate Card -->` comment, no `mt-12` pricing div, no tier cards.

**Grep evidence commands (for VERIFICATION.md):**
```bash
# MOBL-01: Confirm hidden sm:block removed from brand span
grep -c "hidden sm:block" src/components/Nav.astro
# Expected: 1 (only the underline div, not the brand span)

# PRIC-07: Confirm Rate Card is gone
grep -c "Rate Card" src/components/Accommodations.astro
# Expected: 0

# PRIC-07: Confirm pricing teaser link is present
grep -c "pricing-calculator" src/components/Accommodations.astro
# Expected: 1
```

### Connect.astro Orphan Analysis

**File:** `src/components/Connect.astro`
**Status:** Not imported anywhere. Confirmed by exhaustive grep across all `.astro`, `.ts`, and `.tsx` files in `src/`.
**Content:** Contains a `<section id="contact">` with a Facebook social preview card — a precursor to the current `Contact.astro` which was built in Phase 4 with full contact form, phone, email, address, and the Facebook card integrated into the left column.
**Risk of deletion:** Zero. Connect.astro has no importers. Deleting it removes dead code with no runtime impact.
**Import in index.astro:** `import Contact from '../components/Contact.astro';` — Contact.astro is the active component.

### REQUIREMENTS.md Traceability Update

Current state (from source-verified REQUIREMENTS.md):
```
| PRIC-07 | Phase 9 → Phase 14 (verify) | Pending |
| MOBL-01 | Phase 9 → Phase 14 (verify) | Pending |
```

Target state after Phase 14:
```
| PRIC-07 | Phase 9 | Complete |
| MOBL-01 | Phase 9 | Complete |
```

The checkbox entries at the top of REQUIREMENTS.md also need updating:
- `[ ] PRIC-07` → `[x] PRIC-07`
- `[ ] MOBL-01` → `[x] MOBL-01`

### Anti-Patterns to Avoid

- **Writing a VERIFICATION.md that says "I believe it works" without citing grep/file evidence:** The verification must cite concrete evidence — actual file content, grep command output, and Playwright test names. The v2.2 audit flagged Phase 9 as "partial" precisely because the SUMMARY claimed completion without formal evidence.
- **Leaving REQUIREMENTS.md traceability partially updated:** Both the traceability table and the checkbox entries in the requirement definitions must be updated. Updating only one creates inconsistency.
- **Deleting Connect.astro without verifying zero importers:** Although research confirms no imports exist, the plan should include a grep verification step before deletion.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Proving MOBL-01 at 375px | Manual browser test description | Cite existing Playwright test `header brand text visible` (mobile-375 project) | Playwright already runs this assertion; the evidence is already recorded |
| Proving PRIC-07 | Re-inspecting the whole file | `grep -c "Rate Card" src/components/Accommodations.astro` returns 0 | Deterministic grep is reproducible evidence |

**Key insight:** Phase 13 already created the automated proof for MOBL-01. The VERIFICATION.md must reference `tests/viewport.spec.ts` test `header brand text visible` as part of its evidence chain — it runs across all three viewport projects in the existing Playwright suite.

---

## Common Pitfalls

### Pitfall 1: VERIFICATION.md Written for Phase 9 But Stored in Wrong Directory

**What goes wrong:** VERIFICATION.md gets placed in `.planning/phases/14-tech-debt-cleanup-and-verification/` instead of `.planning/phases/09-mobile-header-and-pricing-cleanup/`.

**Why it happens:** Phase 14 is doing the writing, so the writer defaults to the Phase 14 directory.

**How to avoid:** The VERIFICATION.md belongs to Phase 9. It must be created at `.planning/phases/09-mobile-header-and-pricing-cleanup/09-VERIFICATION.md`. This is what the v2.2 audit requires: "Phase 9 has a VERIFICATION.md."

**Warning signs:** The success criterion explicitly says "Phase 9 has a VERIFICATION.md" — if it's anywhere else, the criterion is not met.

### Pitfall 2: Forgetting to Update Both the Checkbox AND the Traceability Table in REQUIREMENTS.md

**What goes wrong:** The traceability table is updated to "Complete" but the requirement definition entries still show `[ ] PRIC-07` and `[ ] MOBL-01` at the top of the file.

**Why it happens:** Two separate locations in the same file track the same information.

**How to avoid:** After updating the traceability table, scroll back to the v2.2 requirements section and flip the checkboxes.

### Pitfall 3: VERIFICATION.md Missing Playwright Test Reference

**What goes wrong:** The VERIFICATION.md only cites grep commands for static markup evidence but doesn't reference that the Playwright test `header brand text visible` already provides automated coverage of MOBL-01 across all three viewport projects.

**Why it happens:** The Playwright tests were added in Phase 13, after Phase 9 ran. The Phase 9 SUMMARY has no knowledge of them.

**How to avoid:** Reference `tests/viewport.spec.ts` line 7 (`test('header brand text visible', ...)`) in the VERIFICATION.md. Note that this test is tagged as running across desktop-1280, mobile-375, and mobile-320 projects — providing the 375px and 320px coverage that MOBL-01 requires.

---

## Code Examples

### VERIFICATION.md Structure for Phase 9

The VERIFICATION.md must satisfy the audit criterion: "confirms PRIC-07 (no duplicate pricing cards in Accommodations) and MOBL-01 (mobile header shows brand text) are satisfied." Pattern from Phase 10 VERIFICATION.md (which the audit shows has status `passed`):

```markdown
---
phase: 09-mobile-header-and-pricing-cleanup
status: passed
requirements: [MOBL-01, PRIC-07]
verified: 2026-03-03
---

# Phase 9 Verification: Mobile Header and Pricing Cleanup

## MOBL-01: Mobile Header Brand Text

**Result: PASSED**

**Evidence:**
- src/components/Nav.astro line 31: brand span class is `font-serif text-xl sm:text-2xl text-stone-800 group-hover:text-brand transition-colors`
- `hidden sm:block` is absent from the brand span — text is always visible
- Underline decoration div (line 32) retains `hidden sm:block` as intended (decorative only)
- Playwright test `header brand text visible` in tests/viewport.spec.ts:7 asserts visibility across all three viewport projects (desktop-1280, mobile-375, mobile-320)

**Grep verification:**
`grep -n "hidden sm:block" src/components/Nav.astro`
Returns line 32 only (the underline div) — brand span is not in this output.

## PRIC-07: Duplicate Pricing Cards Removed from Accommodations

**Result: PASSED**

**Evidence:**
- src/components/Accommodations.astro: Rate Card block (formerly lines 124-150 with `<!-- Rate Card -->` comment, `mt-12` div, two tier cards, minimums text, "Estimate Your Stay" CTA) is fully absent
- Replaced with single pricing teaser paragraph linking to `#pricing-calculator`
- Authoritative pricing content remains exclusively in src/components/PricingSection.astro

**Grep verification:**
- `grep -c "Rate Card" src/components/Accommodations.astro` → 0
- `grep -c "pricing-calculator" src/components/Accommodations.astro` → 1

**Commit:** 7b78dfa (feat: show brand text on mobile, remove duplicate pricing cards)
```

### Connect.astro Deletion

```bash
# Verify zero importers before deletion
grep -r "Connect" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
# Expected: no output (or output not referencing Connect.astro as an import)

# Delete the file
rm src/components/Connect.astro

# Verify it's gone
ls src/components/ | grep Connect
# Expected: no output
```

### REQUIREMENTS.md Edit Targets

Two locations in `/home/evan/Projects/clients/timberandthreads-v2/.planning/REQUIREMENTS.md`:

**Location 1 — Requirement definitions (lines ~12, ~19):**
```
- [ ] **PRIC-07**: Duplicate pricing tier cards removed...
→ becomes:
- [x] **PRIC-07**: Duplicate pricing tier cards removed...

- [ ] **MOBL-01**: Mobile header displays "Timber & Threads" text title...
→ becomes:
- [x] **MOBL-01**: Mobile header displays "Timber & Threads" text title...
```

**Location 2 — Traceability table (lines ~182-185):**
```
| PRIC-07 | Phase 9 → Phase 14 (verify) | Pending |
→ becomes:
| PRIC-07 | Phase 9 | Complete |

| MOBL-01 | Phase 9 → Phase 14 (verify) | Pending |
→ becomes:
| MOBL-01 | Phase 9 | Complete |
```

---

## State of the Art

| Old State | New State | When Changed | Impact |
|-----------|-----------|--------------|--------|
| Phase 9 had SUMMARY but no VERIFICATION.md | Phase 9 has formal VERIFICATION.md with grep + Playwright evidence | Phase 14 execution | PRIC-07 and MOBL-01 status changes from "partial" to formally verified |
| Connect.astro exists as orphan with duplicate `id="contact"` | Connect.astro deleted | Phase 14 execution | Removes misleading grep results; Contact.astro is sole contact section component |
| REQUIREMENTS.md shows PRIC-07 and MOBL-01 as Pending | Both marked Complete | Phase 14 execution | Traceability is accurate; v2.2 milestone requirements fully accounted |

**Deprecated/outdated:**
- `src/components/Connect.astro`: Superseded by Contact.astro in Phase 4 (v2.0). No importers. Safe to delete.

---

## Open Questions

1. **Should Phase 14 produce its own VERIFICATION.md in addition to Phase 9's?**
   - What we know: The success criterion says "Phase 9 has a VERIFICATION.md." The Phase 14 goal is to write that document.
   - What's unclear: Whether Phase 14 itself needs a VERIFICATION.md documenting that the three cleanup tasks were completed.
   - Recommendation: Yes — Phase 14 should have its own VERIFICATION.md confirming: Phase 9 VERIFICATION.md was created, Connect.astro was deleted, and REQUIREMENTS.md was updated. This follows the project pattern where each phase has a VERIFICATION.md.

2. **Does Phase 14 need a SUMMARY.md in addition to VERIFICATION.md?**
   - What we know: Completed phases (10, 11, 12, 13) have both SUMMARY.md and VERIFICATION.md.
   - What's unclear: Whether the GSD workflow generates SUMMARY separately or it's part of plan execution.
   - Recommendation: Follow the same pattern as prior phases — plan execution creates a SUMMARY; verification step creates VERIFICATION.md. Both in the Phase 14 directory.

---

## Sources

### Primary (HIGH confidence)

- Direct source inspection: `src/components/Nav.astro` line 31 — confirmed brand span class without `hidden sm:block`, with `text-xl sm:text-2xl`
- Direct source inspection: `src/components/Accommodations.astro` line 125 — confirmed pricing teaser present, no Rate Card block
- Direct source inspection: `src/components/Connect.astro` — confirmed file exists; content is a Facebook-only social card (no contact form, no phone/email/address)
- Direct source inspection: `src/pages/index.astro` — confirmed imports `Contact from '../components/Contact.astro'`; no import of Connect.astro
- Grep scan: All `.astro`, `.ts`, `.tsx` files in `src/` — zero references to `Connect.astro` as an import
- Direct source inspection: `tests/viewport.spec.ts` lines 7-10 — `header brand text visible` test confirmed; runs across all three Playwright projects
- Direct source inspection: `.planning/REQUIREMENTS.md` lines 12, 19, 182-185 — current state of PRIC-07 and MOBL-01 entries and traceability table
- Direct source inspection: `.planning/v2.2-MILESTONE-AUDIT.md` — audit source confirming tech debt items and gaps
- Direct source inspection: `.planning/phases/09-mobile-header-and-pricing-cleanup/09-01-SUMMARY.md` — commit `7b78dfa` confirmed; requirements-completed: [MOBL-01, PRIC-07]

### Secondary (MEDIUM confidence)

None required — all evidence is from direct project file inspection.

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; only documentation writing, file deletion, text editing
- Architecture: HIGH — evidence is definitive from direct source inspection; zero ambiguity about current file state
- Pitfalls: HIGH — derived from reading the v2.2 audit document which describes exactly what went wrong and what was missed

**Research date:** 2026-03-03
**Valid until:** Stable indefinitely — evidence is based on current file state which only Phase 14 itself will change
