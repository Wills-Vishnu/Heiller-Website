# Remove Announcement Strip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the sky-blue announcement row and reclaim its `35px` of vertical space without changing the navigation or hero padding.

**Architecture:** Delete the standalone announcement CSS rules and matching HTML element from the existing static design file. Let normal document flow move the hero upward; do not introduce replacement spacing.

**Tech Stack:** Static HTML/CSS, Vite, in-app browser verification.

## Global Constraints

- Delete `.announce`, `.announce span`, and the `<div class="announce">` element.
- Keep `.nav` and its markup unchanged.
- Keep `.hero` at `padding-top: 280px`.
- Do not change unrelated content or layout.

---

### Task 1: Remove the announcement strip

**Files:**
- Modify: `design/index.html`
- Verify: live `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: the standalone `.announce` CSS and HTML block.
- Produces: a page whose first in-flow section is `.hero`, while `header.nav` remains absolutely positioned.

- [x] **Step 1: Run the failing source assertion**

```powershell
$source = Get-Content -Raw design\index.html
if (($source | Select-String -AllMatches 'class="announce"').Matches.Count -ne 1) { throw 'Expected one announcement element before removal' }
if ($source -notmatch '\.announce\s*\{') { throw 'Expected announcement CSS before removal' }
```

Expected: both assertions succeed, reproducing the unwanted strip.

- [x] **Step 2: Delete the exact announcement CSS**

Remove the complete `.announce { ... }` and `.announce span { ... }` rule blocks, including the announcement-section comment.

- [x] **Step 3: Delete the exact announcement HTML**

Remove:

```html
<div class="announce">
  <span>Stablecoin-backed cards are now integrated with Stripe Issuing&nbsp;&nbsp;-&gt;</span>
</div>
```

- [x] **Step 4: Run build and source assertions**

```powershell
npm run build
$source = Get-Content -Raw design\index.html
if ($source -match '\.announce|class="announce"') { throw 'Announcement CSS or markup remains' }
if ($source -notmatch '(?s)\.hero\s*\{.*?padding-top:\s*280px') { throw 'Hero padding changed unexpectedly' }
if ($source -notmatch '<header class="nav">') { throw 'Navigation was removed unexpectedly' }
```

Expected: build and all assertions pass.

- [x] **Step 5: Verify the live page**

Reload `/design/` and assert zero `.announce` elements, one `header.nav`, `.hero` computed padding-top `280px`, and a hero top edge `35px` above its previous measured position.

No commit step is available because `D:\Design\Heiller` is not a Git repository.
