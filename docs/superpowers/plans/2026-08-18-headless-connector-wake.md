# Headless Connector Wake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace each three-particle connector signal with a six-particle, `480ms` headless fading wake.

**Architecture:** Retain the existing `.signal-group` route, color, and base-delay custom properties. Make every child an equal `3px` `.signal`, with per-particle custom properties controlling only its opacity and timing lag so all six particles independently follow the same CSS motion path.

**Tech Stack:** Static HTML, CSS Motion Path, Vite, in-app browser verification.

## Global Constraints

- Use six equal-sized `3px` circular micro-beads.
- Space beads `96ms` apart for a `480ms` first-to-last wake.
- Fade opacity from approximately `80%` to `10%` without a distinct head class, glow, blur, or shadow.
- Preserve existing routes, source colors, group sequencing, animation duration, connector geometry, and reduced-motion behavior.

---

### Task 1: Convert each connector signal to a headless six-particle wake

**Files:**
- Modify: `design/index.html`
- Verify: live `http://127.0.0.1:5173/design/`

**Interfaces:**
- Consumes: `.signal-group` custom properties `--signal-route`, `--signal-color`, and `--signal-delay`.
- Produces: six equal `.signal` children per group using `--signal-lag` and `--signal-opacity`.

- [x] **Step 1: Run the failing source assertion**

```powershell
$source = Get-Content -Raw design\index.html
if (($source | Select-String -AllMatches 'class="signal signal--').Matches.Count -ne 21) { throw 'Expected the current 21 classed signal particles' }
```

Expected: command succeeds, proving the old three-particle treatment is present.

- [x] **Step 2: Replace the signal CSS**

Keep `.signal-group` unchanged. Replace the `.signal`, `.signal--wake-one`, and `.signal--wake-two` rules with:

```css
.signal {
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--signal-color);
  offset-path: var(--signal-route);
  offset-distance: 0%;
  offset-anchor: center;
  animation: signal-flow 4.7s linear infinite both;
  animation-delay: calc(var(--signal-delay) + var(--signal-lag));
}
```

Keep `@keyframes signal-flow` and its `var(--signal-opacity)` opacity values unchanged.

- [x] **Step 3: Replace all seven groups' children**

Inside every existing `.signal-group`, replace its three children with exactly:

```html
<i class="signal" style="--signal-lag:0ms;--signal-opacity:.8"></i>
<i class="signal" style="--signal-lag:96ms;--signal-opacity:.62"></i>
<i class="signal" style="--signal-lag:192ms;--signal-opacity:.46"></i>
<i class="signal" style="--signal-lag:288ms;--signal-opacity:.32"></i>
<i class="signal" style="--signal-lag:384ms;--signal-opacity:.2"></i>
<i class="signal" style="--signal-lag:480ms;--signal-opacity:.1"></i>
```

- [x] **Step 4: Run build and source assertions**

```powershell
npm run build
$source = Get-Content -Raw design\index.html
if (($source | Select-String -AllMatches 'class="signal"').Matches.Count -ne 42) { throw 'Expected 42 headless signal particles' }
if ($source -match 'signal--head|signal--wake|drop-shadow|box-shadow') { throw 'A forbidden head, old wake class, or shadow remains' }
```

Expected: build succeeds and both assertions pass.

- [x] **Step 5: Verify the live page**

Reload `/design/` and assert seven `.signal-group` elements, 42 `.signal` elements, six `3px` particles per group, lags of `0/96/192/288/384/480ms`, opacity variables `.8/.62/.46/.32/.2/.1`, no filter or shadow, and moving `offset-distance` values.

No commit step is available because `D:\Design\Heiller` is not a Git repository.
