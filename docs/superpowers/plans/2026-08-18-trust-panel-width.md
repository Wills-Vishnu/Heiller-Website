# Trust Panel Width Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the trust feature panel to the intended balanced width with equal `19px` side insets.

**Architecture:** Preserve the existing absolutely positioned trust layout and replace only the panel's fixed pixel width with a width derived from its containing box. This keeps the current left position while making the right inset mathematically equal.

**Tech Stack:** Static HTML/CSS, Vite, in-app browser verification.

## Global Constraints

- Preserve the existing `19px` left inset.
- Set `.trust__panel` width to `calc(100% - 38px)`.
- Keep the trust box, tab, height, item distribution, typography, border styling, and vertical position unchanged.

---

### Task 1: Correct the trust panel width

**Files:**
- Modify: `design/index.html`
- Verify: live `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: `.trust__box` width `1349px` and `.trust__panel` left inset `19px`.
- Produces: `.trust__panel` width `calc(100% - 38px)`, resolving to `1311px`.

- [x] **Step 1: Run the failing source assertion**

```powershell
$source = Get-Content -Raw design\index.html
if ($source -notmatch '(?s)\.trust__panel\s*\{.*?width:\s*1128px') { throw 'Expected the current fixed 1128px panel width' }
```

Expected: command succeeds, proving the incorrect fixed width is present.

- [x] **Step 2: Apply the minimal CSS correction**

In `.trust__panel`, replace:

```css
width: 1128px;
```

with:

```css
width: calc(100% - 38px);
```

- [x] **Step 3: Run build and source assertions**

```powershell
npm run build
$source = Get-Content -Raw design\index.html
if ($source -notmatch '(?s)\.trust__panel\s*\{.*?width:\s*calc\(100% - 38px\)') { throw 'Expected the balanced panel width rule' }
```

Expected: build succeeds and the assertion passes.

- [x] **Step 4: Verify the live geometry**

Reload `/design/` and read the `.trust__box` and `.trust__panel` bounding rectangles. Assert box width `1349px`, panel width `1311px`, left gap `19px`, right gap `19px`, and five visible `.trust__item` elements inside the panel bounds.

No commit step is available because `D:\Design\Heiller` is not a Git repository.
