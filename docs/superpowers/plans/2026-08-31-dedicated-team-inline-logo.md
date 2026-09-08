# Dedicated Team Inline Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the supplied Heiller mark as a large, very light-grey inline SVG behind the Dedicated Team content and add “Authorization” as an evenly spaced ninth orbiting pill.

**Architecture:** Retain the existing inline SVG and four-level depth model. Lighten the mark through its scoped CSS color, add one pill through the existing markup pattern, and change the orbit controller’s single count constant from 8 to 9 so the current algorithm distributes every pill at equal 40-degree intervals.

**Tech Stack:** Static HTML/CSS, inline SVG, TypeScript orbit controller, Node.js test runner, Vite.

## Global Constraints

- Use the exact path and `viewBox` from `C:/Users/Jijin/Downloads/SVG@2x (2).svg`.
- Use inline SVG, not an image or CSS mask.
- Use light-grey fill `#F1F2F4`.
- Desktop/tablet width is `clamp(360px, 54vw, 760px)`.
- Mobile width at `767px` and below is `min(92vw, 420px)`.
- Add exactly one pill labelled `Authorization` using `--pill-from: #C8BBFF`, `--pill-to: #8F79F2`, and `--pill-accent: #E0D5FF`.
- Use one orbit with `PILL_COUNT = 9` and preserve the existing start angle and positioning algorithm.
- Preserve heading copy, typography, section dimensions, orbit speed, existing pill copy and colors, orbit radii, blur calculations, and reduced-motion behavior.
- Do not modify adjacent sections or animate the logo.
- The directory has no `.git` metadata; execute verification checkpoints but do not fabricate commits.

---

## File Map

- Modify `D:/Design/Heiller/index.html`: inline mark markup, responsive sizing, and heading layer.
- Modify `D:/Design/Heiller/dedicated-team.ts`: change foreground pill depth from 3 to 4.
- Modify `D:/Design/Heiller/tests/dedicated-team.test.mjs`: structural, style, and depth regression assertions.
- Reference `D:/Design/Heiller/docs/superpowers/specs/2026-08-31-dedicated-team-inline-logo-design.md`: approved requirements.

### Task 0: Lighten the mark and add Authorization to the single orbit

**Files:**
- Modify: `D:/Design/Heiller/tests/dedicated-team.test.mjs`
- Modify: `D:/Design/Heiller/index.html`
- Modify: `D:/Design/Heiller/dedicated-team.ts`

**Interfaces:**
- Consumes: the existing `.dedicated-team__mark`, `.tag` pill markup, and `layoutOrbit()` logic.
- Produces: nine `.tag` elements, including one visible `Authorization` label, distributed by `PILL_COUNT = 9`.

- [ ] **Step 1: Update the regression test first**

Add assertions to `tests/dedicated-team.test.mjs`:

```js
test("dedicated team uses a lighter mark and nine-pill orbit", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""
  const markRule = html.match(/\.dedicated-team__mark\s*\{[^}]*\}/s)?.[0] ?? ""
  assert.match(markRule, /color:\s*#F1F2F4;/i)
  assert.equal((section.match(/data-dedicated-pill/g) ?? []).length, 9)
  assert.equal((section.match(/>Authorization<\/span>/g) ?? []).length, 1)
  assert.match(section, /--pill-from:\s*#C8BBFF;\s*--pill-to:\s*#8F79F2;\s*--pill-accent:\s*#E0D5FF;/i)
  assert.match(motion, /const PILL_COUNT = 9/)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
```

Expected: FAIL because the mark is still `#E7E9EC`, the section has eight pills, and `PILL_COUNT` is 8.

- [ ] **Step 3: Implement the minimal markup, color, and count changes**

Change the mark rule in `index.html` to:

```css
color: #F1F2F4;
```

Add this sibling beside the existing `.dedicated-team__pill` elements:

```html
<span class="dedicated-team__pill" data-dedicated-pill style="--pill-from:#C8BBFF;--pill-to:#8F79F2;--pill-accent:#E0D5FF">Authorization</span>
```

Change the constant in `dedicated-team.ts` to:

```ts
const PILL_COUNT = 9
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
```

Expected: all Dedicated Team tests pass.

- [ ] **Step 5: Run full automated verification**

Run `npm test` and `npm run build`.

Expected: both commands succeed with zero failures.

- [ ] **Step 6: Verify the live responsive result**

At desktop, 768px, 393px, and 320px, confirm nine pills exist, all are above the mark, the orbit remains animated and evenly spaced, the heading remains legible, and the document has no horizontal overflow or console errors. Reset the viewport override and leave `http://127.0.0.1:5180/#dedicated-team-title` open.

Because this directory has no Git metadata, report the verified changed files without fabricating a commit.

### Task 1: Add and style the decorative inline mark

**Files:**
- Modify: `D:/Design/Heiller/tests/dedicated-team.test.mjs`
- Modify: `D:/Design/Heiller/index.html:2231-2254,2285-2289,2797-2800`

**Interfaces:**
- Consumes: `.dedicated-team__field` as the positioning container.
- Produces: one `.dedicated-team__mark` SVG centered at layer 0, with all pills and the heading above it.

- [ ] **Step 1: Add the failing structural and style test**

Append to `tests/dedicated-team.test.mjs`:

```js
test("dedicated team centers a large decorative inline mark", () => {
  const section = html.match(/<section class="dedicated-team"[\s\S]*?<\/section>/)?.[0] ?? ""
  const markRule = html.match(/\.dedicated-team__mark\s*\{[^}]*\}/s)?.[0] ?? ""
  assert.equal((section.match(/class="dedicated-team__mark"/g) ?? []).length, 1)
  assert.match(section, /<svg class="dedicated-team__mark"[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*viewBox="47 -407\.5 406 406"/)
  assert.match(section, /<path[^>]*fill="currentColor"/)
  assert.match(markRule, /color:\s*#F1F2F4;/)
  assert.match(markRule, /width:\s*clamp\(360px,\s*54vw,\s*760px\);/)
  assert.match(markRule, /z-index:\s*0;/)
  assert.match(html, /\.dedicated-team h2\s*\{[^}]*z-index:\s*3;/s)
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.dedicated-team__mark\s*\{\s*width:\s*min\(92vw,\s*420px\);/s)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
```

Expected: FAIL because `.dedicated-team__mark` is not present.

- [ ] **Step 3: Add the centered logo CSS and raise the heading**

Insert after `.dedicated-team__field` and update the heading depth in `index.html`:

```css
.dedicated-team__mark {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 0;
  display: block;
  width: clamp(360px, 54vw, 760px);
  height: auto;
  color: #F1F2F4;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.dedicated-team h2 {
  position: relative;
  z-index: 3;
  margin: 0;
  color: #080808;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: clamp(36px, calc(5.1vw - 5px), 83px);
  font-weight: 500;
  letter-spacing: -.055em;
  line-height: .91;
  text-align: center;
  pointer-events: none;
}
```

Add inside `@media (max-width: 767px)`:

```css
.dedicated-team__mark { width: min(92vw, 420px); }
```

- [ ] **Step 4: Add the exact inline SVG before the heading**

Inside `.dedicated-team__field`, immediately before the `<h2>`, add:

```html
<svg class="dedicated-team__mark" aria-hidden="true" focusable="false" viewBox="47 -407.5 406 406">
  <path d="M351.75 -204.5L351.75 -306.25C351.75 -362.459 397.313 -408 453.5 -408L453.5 -306.25C453.5 -250.051 407.959 -204.5 351.75 -204.5ZM453.5 -1C397.313 -1 351.75 -46.551 351.75 -102.75L351.75 -204.5C407.959 -204.5 453.5 -158.959 453.5 -102.75L453.5 -1ZM148.25 -102.75C148.25 -46.551 102.709 -1 46.5 -1L46.5 -102.75C46.5 -158.959 92.063 -204.5 148.25 -204.5L148.25 -102.75ZM46.5 -408C102.709 -408 148.25 -362.459 148.25 -306.25L148.25 -204.5C92.063 -204.5 46.5 -250.051 46.5 -306.25L46.5 -408ZM250 -204.5C306.209 -204.5 351.75 -158.959 351.75 -102.75L351.75 -1C295.563 -1 250 -46.551 250 -102.75C250 -46.551 204.459 -1 148.25 -1L148.25 -102.75C148.25 -158.959 193.813 -204.5 250 -204.5ZM351.75 -306.25C351.75 -250.051 306.209 -204.5 250 -204.5C193.813 -204.5 148.25 -250.051 148.25 -306.25L148.25 -408C204.459 -408 250 -362.459 250 -306.25C250 -362.459 295.563 -408 351.75 -408L351.75 -306.25Z" fill="currentColor" />
</svg>
```

- [ ] **Step 5: Run the focused test**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
```

Expected: PASS for the inline mark test and all existing Dedicated Team tests.

- [ ] **Step 6: Record the atomic checkpoint**

If Git metadata is restored:

```powershell
git add index.html tests/dedicated-team.test.mjs
git commit -m "feat: add inline mark to dedicated team"
```

Otherwise record the passing focused test and continue without a commit.

### Task 2: Place foreground pills above the heading

**Files:**
- Modify: `D:/Design/Heiller/tests/dedicated-team.test.mjs`
- Modify: `D:/Design/Heiller/dedicated-team.ts:36-38`

**Interfaces:**
- Produces: `getOrbitDepth(x: number): 1 | 4`.
- Consumes: the existing `layoutOrbit()` assignment to `pill.style.zIndex`.

- [ ] **Step 1: Add the failing depth regression assertion**

Append to `tests/dedicated-team.test.mjs`:

```js
test("dedicated team orbits across four explicit depth layers", () => {
  assert.match(motion, /getOrbitDepth\(x:\s*number\):\s*1\s*\|\s*4/)
  assert.match(motion, /return x < 0 \? 1 : 4/)
  assert.doesNotMatch(motion, /return x < 0 \? 1 : 3/)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
```

Expected: FAIL because `getOrbitDepth()` still returns `1 | 3`.

- [ ] **Step 3: Update the foreground orbit depth**

Replace the helper in `dedicated-team.ts`:

```ts
export function getOrbitDepth(x: number): 1 | 4 {
  return x < 0 ? 1 : 4
}
```

- [ ] **Step 4: Run the focused test**

Run:

```powershell
node --test tests/dedicated-team.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Record the atomic checkpoint**

If Git metadata is restored:

```powershell
git add dedicated-team.ts tests/dedicated-team.test.mjs
git commit -m "fix: layer orbiting pills around inline mark"
```

Otherwise record the passing focused test and continue without a commit.

### Task 3: Verify the inline mark across responsive layouts

**Files:**
- Verify: `D:/Design/Heiller/index.html`
- Verify: `D:/Design/Heiller/dedicated-team.ts`
- Verify: `D:/Design/Heiller/tests/dedicated-team.test.mjs`

**Interfaces:**
- Consumes: `.dedicated-team__mark` and `getOrbitDepth(x): 1 | 4`.
- Produces: verified desktop, tablet, 393px, and 320px layering with no overflow or runtime errors.

- [ ] **Step 1: Run all tests**

Run:

```powershell
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run the production build**

Run:

```powershell
npm run build
```

Expected: TypeScript validation and Vite production build succeed.

- [ ] **Step 3: Verify geometry at desktop, 768px, 393px, and 320px**

At `http://127.0.0.1:5180/`, compare `.dedicated-team__mark` and `#dedicated-team-title` rectangles at each width.

Expected:

- Horizontal and vertical center deltas are at most 1 CSS pixel.
- Computed mark width follows the desktop clamp or mobile `min()` rule.
- `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- Computed z-indices are 0 for the mark and 3 for the heading.
- Pills observed on the rear and foreground halves use z-indices 1 and 4.

- [ ] **Step 4: Verify visual hierarchy and runtime state**

Inspect desktop and 320px screenshots. Confirm the grey mark is considerably larger than before, the heading is fully readable, every pill remains above the logo, and pills visibly pass behind and in front of the heading. Read browser console errors.

Expected: visual hierarchy matches the approved design and the console has zero errors.

- [ ] **Step 5: Restore the normal viewport and leave the section open**

Reset the browser viewport override, navigate to `http://127.0.0.1:5180/#dedicated-team-title`, and keep the tab available to the user.

- [ ] **Step 6: Record the final checkpoint**

If Git metadata is restored and Tasks 1–2 were not committed separately:

```powershell
git add index.html dedicated-team.ts tests/dedicated-team.test.mjs docs/superpowers/specs/2026-08-31-dedicated-team-inline-logo-design.md docs/superpowers/plans/2026-08-31-dedicated-team-inline-logo.md
git commit -m "feat: layer large inline mark behind dedicated team"
```

Otherwise report the verified changed files and the absence of repository metadata.
