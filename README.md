# heiller

Cinematic single-page site for a healthcare **Revenue Cycle Management** company.

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional, see “Configuration”
npm run dev                    # http://localhost:3000
```

```bash
npm run build && npm start     # production
npm run typecheck              # tsc --noEmit
npm run lint
```

Requires Node **20.9+**.

### One manual step

This project went through a WebGL background scene → hand-drawn dot wave field
→ **fully removed**, across a few rounds of feedback. The dead files from that
were emptied to inert one-line stubs (rather than deleted) because the
environment they were edited in couldn't run `rm`. They're harmless — nothing
imports them, and the app builds and type-checks cleanly with them in place —
but they should be deleted for a clean tree:

```bash
rm -rf src/components/canvas
rm src/components/layout/AmbientField.tsx
rm src/hooks/useSceneQuality.ts
rm src/lib/scene-config.ts
```

Every one of those files starts with a `REMOVED` doc comment saying the same
thing, so `grep -rl REMOVED src` will find all of them if this list ever goes
stale.

---

## The idea

The page is a **single continuous scroll**, not nine screens. The hero is built
to an approved comp — two columns, an illustrated claim-to-revenue composition,
and a dot-matrix wave along the base — and the eight chapters below it carry
that same visual language: white cards, hairline borders, diffuse blue shadow,
blue as the only accent.

### The hero

Three things move, on three different triggers:

| Trigger | What moves |
|---|---|
| Mount | Copy cascades in (badge → each headline line → lede → actions → trust bar). The illustration assembles on its own timeline: paper stack, then its tabs sliding out of the spine, then the clipboard and its tick, then the laptop with its stat cards and a revenue line that draws itself last. |
| Scroll | Scrubbed, so it tracks the wheel continuously in **both** directions. The copy lifts and fades; the illustration's three layers separate at different rates and the whole stage tips back — the composition comes apart into its three constituent ideas rather than sliding off as one picture. |
| Always | The dot wave rolls on its own clock, and swells with scroll velocity. |

**The illustration is real DOM and SVG, not an image** (`sections/HeroVisual.tsx`).
That was a deliberate constraint: a flat render can only ever move as one
rectangle, and the requirement was that it animate piece by piece. Everything
sits in one shared CSS `perspective` at different `translateZ`, so pointer
parallax and the scroll tilt produce genuine depth separation — no WebGL, no 3D
library, just compositor-friendly transforms.

**The wave is a 2D canvas** (`layout/DottedWave.tsx`), not a shader — it avoids
putting three.js (~150kB gzipped) back in the bundle for one decorative element.

It is a **perspective-projected ground plane**, and that distinction matters.
The first attempt walked a fixed screen-space grid and displaced each dot's Y,
which shears a flat sheet: rigid columns, uniform dot size top to bottom, and
it reads as warped graph paper. The fix wasn't a better waveform — it was
adding a camera. Points now live on a uniform grid in *world* space and get
projected through a pinhole (`persp = FOCAL / z`), so the terrain qualities
come out for free: dots shrink with distance, rows bunch toward the horizon,
and a uniform world grid spreads wide when near and compresses when far, giving
a genuine density gradient instead of a faked one.

Motion is three layers, echoing the reference pen's `wave` + `swell` pair:
**travel** (the waveform drifts along world X — the pen's `margin-left` scroll,
but as phase, so it never seams), **swell** (the whole surface breathing
vertically), and **surge** (scroll velocity raises amplitude and accelerates
travel, with an asymmetric envelope that rises fast and decays slowly, so a
flick reads as a swell rolling through).

Bounded to ~8–10k `fillRect` calls per frame by three things: per-row X limits
derived analytically from the projection so off-screen points are never
iterated; rows closer than 1.4px to the previous row skipped as pure overdraw;
and world cell size scaled with canvas width so a 4K display doesn't quadruple
the point count. Pauses entirely via `IntersectionObserver` once scrolled past.

⚠️ The wave needs **vertical room** — it's `52vh` in `Hero.tsx` for a reason.
Squeezed into a short strip, near and far rows collapse together and the
perspective flattens back into the grid it replaced.

| # | Chapter | Story beat |
|---|---------|-----------|
| 00 | Hero | The promise |
| 01 | Problem | Revenue leaks |
| 02 | Complexity | Why it happens |
| 03 | Services | Capabilities |
| 04 | Analytics | The standard (industry benchmarks, not heiller's own claimed results) |
| 05 | Trust | Why trust a small, new company |
| 06 | Contact | The close |

Workflow, Security and an interactive CSS-3D "Explore" chapter used to sit
between Services and Analytics; all three were removed from the homepage on
request and the numbering above was closed up so the sequence reads
unbroken. `/security` is unaffected — it's a standalone route, not this
chapter. See "Casualties of this rule" below for what's now orphaned.

### The hero is a full-bleed video

Chapter 00 was rebuilt to a supplied spec — background video, left-aligned
text, floating pill navbar at the bottom centre — then taken full-bleed. The
spec's 1400px rounded card is gone entirely: no max-width, no 48px radius, no
border, no shadow. Leaving any of that in makes it read as a stretched card
rather than a full-screen hero.

It uses `100svh`, not `100vh`. On mobile browsers `vh` measures against the
*largest* viewport, so with the address bar showing, a `100vh` hero is taller
than the screen and pushes the bottom navbar out of sight on first paint.
`min-h-[640px]` guards short landscape phones.

Three deliberate deviations from the spec, all agreed:

- **GSAP, not `motion/react`.** Adding Motion would mean two animation
  libraries on different clocks — Motion-driven elements would drift a frame
  from GSAP-driven ones during scroll. Identical entrance, no new dependency.
- **Design tokens, not literal hex.** `#0a1b33` → `text-navy`, `#64748b` →
  `text-muted`, `bg-white` → `bg-surface`. Near-identical in light mode, and
  the section now inverts with the theme instead of staying stubbornly light.
- **The video pauses under `prefers-reduced-motion`.** An autoplaying loop with
  no pause control is a WCAG 2.2.2 failure. Handled in an effect rather than
  by the `autoPlay` attribute, because the attribute can't respond to a reader
  changing the preference mid-session.

⚠️ **One open issue on this hero.**

*No scrim.* The spec specifies "No overlays", so navy text sits directly on the
video. Whether that passes contrast depends on what's under it at any given
frame, and that changes across the loop. If it fails, add a low-opacity
gradient behind the **text column only** — not over the whole video.

*The copy mismatch is fixed.* This hero originally shipped with placeholder
web3 copy ("Foundation of the new digital epoch," "decentralized web,"
"builders and communities") that had nothing to do with the business.
`videoHero` in `lib/site.ts` now describes heiller's actual positioning — see
"What's real and what isn't" further down for the full list of what else that
pass touched.

*Orphaned by this change:* `sections/HeroVisual.tsx`, `lib/hero-visual.ts`, and
`heroHeadline` / `heroTrustSignals` / `HeroSignalIcon` in `lib/site.ts` are no
longer referenced. They still type-check, so nothing is broken — but they're
dead code. `DottedWave` is **still in use** by `PageHero` on the interior
pages; don't delete that one.

### One rule: no two sections share a layout

This is the constraint that keeps a long single-page scroll from turning into
wallpaper. Every chapter has a structurally different skeleton, and the
silhouette alone should tell you which section you are looking at from across
the room.

| Chapter | Layout | Heading |
|---|---|---|
| Problem | Editorial stat band — **no cards at all**, oversized figures on hairline dividers | Full width |
| Complexity | Zig-zag either side of a centre spine | Centred |
| Services | Bento grid, six-column track, mixed spans | Left, wide |
| Workflow | Sticky drawn spine beside a stage list | Left, narrow |
| Security | Stepped columns descending on a diagonal | Left, wide |
| Analytics | Single instrument panel, benchmark metric strip | Left |
| Trust | Three tilting "why trust us" cards over a compliance badge row | Centred |

This got broken once already and is easy to break again. Problem and Complexity
were both "sticky heading left, stacked cards right" — adjacent chapters with
identical skeletons, which made them read as one long section and the reader
stopped distinguishing them. Services and Security were both uniform
three-column card grids for the same reason.

If you add a chapter, **check its skeleton against this table first**, not just
its content. Two useful levers that cost nothing: move the heading (full width
vs left vs centred changes the whole page rhythm), and question whether the
content needs card chrome at all — Problem is the strongest section on the page
precisely because it has none.

### Section motion

Below the hero, motion lives **inside** each section, driven by GSAP +
ScrollTrigger:

- **Hero** — see above.
- **Problem** — rules draw in first, figures rise into the space they define,
  and a thin "leak" line drains beneath each one on its own offset loop. The
  loops are deliberately desynchronised: three lines pulsing together read as a
  loading indicator, three seeping independently read as a slow loss.
- **Complexity** — the centre spine fills as the reader descends (scrubbed, so
  scrolling back up retracts it), facets wipe in with a clip-path mask from
  whichever side they sit on, and each spine node ignites just after its facet
  lands. A mask reveal reads as something being *uncovered*, which is the right
  verb for this chapter.
- **Services** — nine cards entering in scroll-speed-aware batches
  (`ScrollTrigger.batch`), each with a small `rotateX` as well as a translate,
  so the bento reads as a stack of physical objects settling rather than boxes
  fading up. Each card's icon gets its own nested `back.out` scale-in a beat
  later, instead of sitting inert until hovered. The pointer-tilt was dropped
  when this became a bento — a two-row feature cell tilting under the cursor
  moves far more pixels at its corners than a small one, and the effect goes
  from subtle to seasick.
- **Workflow** *(orphaned — no longer on the homepage, see "Casualties of this
  rule")* — an SVG spine draws itself via `stroke-dashoffset`, scrubbed
  against its own scroll position (no pin), while its nodes light up in sync
  with the eight stages scrolling past beside it. The heading + spine sit in a
  sticky column next to the stage list.
- **Security (home section)** *(orphaned — same reason; `/security` the route
  is unaffected)* — six pillars with original abstract SVG glyphs (no
  padlocks, no shields-with-a-tick), animating in as a batch; each glyph
  scales and clears in shortly after its card, the same "settle in, don't wait
  for a hover" treatment as Services. The stepped columns are what make the
  stagger land — a flat grid delivers a whole row at the same scroll position
  and the stagger is wasted on it. `items-start` on that grid is load-bearing:
  without it every card stretches to its row's tallest and the offsets
  collapse.
- **Analytics** — four benchmark tiles (`analyticsMetrics` in `lib/site.ts`)
  entering as a staggered batch, each figure counting up via `CountUp`. This
  used to be a mock dashboard — a 12-month line chart and a denial-root-cause
  bar chart, both built from invented numbers. Both are gone; see "What's real
  and what isn't" below for why.
- **Trust** — three tilting cards (`trustPoints` in `lib/site.ts`) entering as
  a staggered batch, same `TiltCard` treatment the old testimonial cards used.
  There is no client-logo marquee anymore — see the same section below.
- **Contact** — an expanding radial light bloom behind the form as the reader
  arrives, purely CSS/GSAP, no 3D. The panel itself rises in first, then the
  six form fields settle in with a short stagger of their own, overlapping the
  tail of the panel tween rather than waiting for it to finish.

Two more pieces of motion sit outside the chapter sections, in `app/layout.tsx`
itself, because they're page-wide chrome rather than section content:

- **`layout/ScrollProgress.tsx`** — a 3px gradient bar fixed to the top of the
  viewport, filling left-to-right with `self.progress` from a single
  whole-document `ScrollTrigger`. Not gated behind `prefers-reduced-motion`:
  it's entirely reader-driven (only moves because the reader scrolled) and
  conveys real information, so it isn't the kind of automatic motion that
  WCAG's SC 2.2.2 is concerned with.
- **`layout/BackToTop.tsx`** — a floating button that fades and lifts in once
  the reader has scrolled roughly one viewport, toggled by a single
  `ScrollTrigger.onToggle` flipping a class (the same cheap pattern the navbar
  uses for its condense state — no per-frame cost). It's a plain `href="#hero"`
  anchor, so it rides the same Lenis-intercepted anchor handling as every other
  in-page link rather than a bespoke scroll-to-top. Reachable by keyboard at
  any scroll position via `focus-visible`, and placed last in the DOM so tab
  order reaches it after the rest of the page, not before.

### A layout bug worth knowing about if you add a pinned section

GSAP's `pin` fixes an element's on-screen position for the life of a
`ScrollTrigger`. It's a great effect, but it has one sharp edge: if the pinned
element is taller than the viewport, everything below the fold becomes
*unreachable* — not just off-screen, genuinely unreachable, because scrolling
while pinned drives the animation timeline rather than moving the frozen
layout. Complexity and Workflow both originally pinned a block containing a
full heading plus every list item stacked in normal document flow (4 facets /
8 stages), which on most laptop screens ran well past 1,000px tall. The
reader could see the heading and the first item or two and nothing else, no
matter how much they scrolled.

Both sections were rewritten to use the same pattern already proven in
Services and Security — `ScrollTrigger.batch`, no pin — plus a native CSS
`position: sticky` heading (which, unlike `pin`, can only hold within its own
column's actual height, so it physically cannot trap anything). If you add a
new pinned section, budget its *total pinned height*, not just its width, against
a real viewport (⁓760–900px inner height on a typical laptop, once the fixed
navbar is subtracted) before shipping it.

### Two more traps, both hit while building the hero

**Never let two effects animate the same property on the same element.** The
hero illustration wants a scrubbed scroll tilt *and* a pointer-follow parallax,
and both naturally want `rotateX`. On a single element GSAP resolves that by
last-write-wins every frame, so one of them silently does nothing — no error,
no warning, just a dead effect. The fix is structural, not a tweak: the scroll
tilt owns the outer `stage`, the pointer parallax owns a nested wrapper, and
the two transforms compose. If you add a third effect, give it its own element
too.

**Percentage heights need a parent with a resolvable height.** The laptop's
keyboard deck was originally `h-[3.5%]` inside an auto-height parent, where a
percentage height resolves to `auto` — i.e. nothing renders at all for an
empty div. It's `clamp()` now. This bites specifically on decorative empty
elements, because there's no content to make the bug obvious.

### What changed, and why it's worth knowing

The project originally shipped with a persistent WebGL background: a
scroll-choreographed camera moving through a field of instanced 3D objects
(first an abstract sphere-and-orbits "atom", later redesigned into
claim-record cards, a glass ledger slab, an ECG-to-revenue pulse trace, and a
dune-like dot wave field). It was removed in full at the user's request. If
you want to see what that looked like or resurrect a piece of it, check the
git history (or ask for it to be rebuilt) — the stub files left behind under
"One manual step" above are what remains of it and are safe to delete.

---

## Pages

Three routes. The landing page is the scroll narrative; the two interior pages
are reference material people arrive at deliberately, usually from search or
from a link someone sent them during a buying process.

| Route | For whom | What it does |
|---|---|---|
| `/` | A practice administrator being persuaded | The nine-chapter argument |
| `/security` | A compliance officer doing diligence | Attestations, PHI lifecycle, access controls, subprocessors, incident windows, disclosure policy |
| `/about` | A buyer deciding whether to trust the argument | The belief, operating principles, engagement model, leadership, locations |

**Both interior pages are server components.** They export `metadata`, contain
no interactivity of their own, and ship no JavaScript for their content —
`PageHero` and the `RevealGroup` wrappers are the only client code on them.
That is worth preserving: if you add a hook directly to one of these pages,
the whole route becomes a client bundle.

Content lives in `lib/page-content.ts` rather than `lib/site.ts`. The rule the
codebase cares about is unchanged — copy lives in `lib/`, never hard-coded in
a component — but everything in that file is consumed by exactly one route,
whereas `site.ts` holds what the whole site shares.

### Anchors across routes

`#services` works on `/`, and silently does nothing on `/security` — there is
no such section on that page to scroll to. `resolveNavHref()` in `lib/site.ts`
handles this: a hash is left alone on `/` (so `SmoothScrollProvider`'s
`a[href^="#"]` interceptor still routes it through Lenis) and becomes
`/#section` anywhere else (a normal navigation back to the landing page,
deliberately *not* intercepted).

Anything rendering `navLinks` must pass hrefs through it. `Navbar` and `Footer`
both do, via `usePathname()`. If you add a third consumer and forget, the
symptom is a nav link that does nothing at all on the interior pages — no error,
no console warning.

### The layout inventory

**No layout may appear twice — not within a page, and not across pages.** This
is the hardest constraint in the project and the one most likely to get broken
by someone adding a section in a hurry. The full register:

| Layout | Where | Never reuse |
|---|---|---|
| Full-bleed video hero | home | — |
| Full-bleed dark band hero | `/security` | — |
| Full-bleed light split hero | `/about` | — |
| Editorial stat band (no cards) | home / Problem | — |
| Zig-zag centre spine | home / Complexity | — |
| Bento grid | home / Services | — |
| Instrument panel | home / Analytics | — |
| Marquee + tilt cards | home / Trust | — |
| Split form panel | home / Contact | — |
| Single wide attestation panel | `/security` attestations | — |
| Full-width bands with accent edge | `/security` lifecycle | — |
| Card-less definition list | `/security` controls | — |
| Data table | `/security` subprocessors | — |
| Recessed closing block | `/security` | — |
| Asymmetric story + margin figures | `/about` | — |
| Oversized numbered list | `/about` principles | — |
| Descending staircase | `/about` engagement | — |
| Roster strip | `/about` team + offices | — |
| Rule-framed centred close | `/about` | — |

Three heroes, three registers — video, document-header with a meta row, and a
light headline/lede split — all full bleed, all theme-following.

**Two layouts on `/security` were replaced for readability, not novelty.** The
lifecycle ran five columns across at desktop — roughly 230px each for 40-word
paragraphs, which is a column of confetti. The attestations came off an
overlapping fanned stack whose negative margins ate 32px out of each text
column, setting body copy to about 28 characters. Both are now full-measure.
That page is read closely by one person doing a job, not skimmed: **density is
the enemy there**, and any layout that pushes body text below ~45 characters is
wrong for it regardless of how good it looks. Three sequences — vertical spine, horizontal stepper, diagonal staircase
— because the same content shape appears on three pages and must not look it.
Two closings that resolve oppositely: `/security` on a dark band, `/about` on
type between two hairlines.

**Casualties of this rule.** `ui/Timeline.tsx`, `ui/SpotlightCard.tsx`
(including `AuroraPanel`), `ui/RevealGroup.tsx` and `layout/PageHero.tsx` are
no longer imported anywhere. They were the shared components that made the two
interior pages look like each other — a vertical spine on both, a spotlight
grid on both, the same hero on both. They still type-check, so nothing is
broken, but they are dead code. The `aurora-a` / `aurora-b` keyframes in
`globals.css` and `accessControls` in `lib/page-content.ts` are dormant for the
same reason.

**More recent casualties, different reason.** `sections/Workflow.tsx`,
`sections/Security.tsx` and `sections/DashboardScene.tsx` are no longer
imported by `app/page.tsx` — not because their layouts collided with anything,
but because the homepage chapters were removed on request. All three still
type-check and are untouched, so reinstating one is just adding the import and
the JSX line back to `page.tsx` (and picking eyebrow numbers that don't
collide with the sequence documented above). `workflowSteps` in `lib/site.ts`
is dormant for the same reason — it only ever fed `sections/Workflow.tsx`.
**`securityPillars` is not dormant** — despite also feeding the orphaned
`sections/Security.tsx`, it is separately imported by
`sections/SecurityMotion.tsx` and rendered live on `/security`. Don't delete
it when cleaning up the homepage casualties above.

That is the trade this rule demands: shared layout components are exactly what
produces cross-page sameness, so a site with this constraint will have fewer of
them and more one-off sections. Reaching for a shared card grid is the failure
mode to watch for.

### Interior-page motion

Both interior pages keep their motion in one module each —
`sections/SecurityMotion.tsx` and `sections/AboutMotion.tsx` — with every
section's layout and animation defined together rather than assembled from
shared parts. That is a direct consequence of the layout inventory above:
shared section components are what made the two pages look alike.

The rule applied throughout: **every effect had to mean something on the page
it appears on.** `ScrambleText` is only on `/security`, because text decrypting
into legibility *is* that page's subject. The lifecycle stepper draws left to
right because data moves through a pipeline. The attestation sheets overlap
because certifications are paperwork and paperwork sits in a pile. The
subprocessor table is revealed by a scan sweep because a scan reads as review.
Nothing here transplants to another page, which is the test.

Two details worth not undoing:

**`ScrambleText` locks its layout box.** The real string renders in normal flow
at `opacity: 0` — which keeps it in the accessibility tree and gives crawlers
the real headline — while the scrambling copy is layered on top absolutely.
Swapping characters in place would change their widths and shove the page
around for the whole animation. Spaces and punctuation are never scrambled, so
both layers wrap identically.

**The staircase indents by percentage, not by fixed pixels.** `lg:ml-[12%]`
steps keep the diagonal at the same angle whatever the container width; fixed
margins would flatten the slope as the viewport grows. They are dropped below
`lg`, where a 36% indent on a phone leaves the last card three words wide.

**The 3D dashboard is CSS transforms, not WebGL.** `DashboardScene` gets real
perspective, real depth sorting and hardware compositing from one
`perspective` on the stage, `preserve-3d` on the rig, and a `translateZ` per
panel. Because the panels are true siblings in 3D space, rotating the rig makes
them slide past each other with correct parallax — which is what separates it
from a stack of `box-shadow`s pretending to be depth. Two details that are easy
to get wrong: `touch-action: none` on the stage (or the browser claims the drag
for scrolling and pointermove dies after a few pixels), and
`setPointerCapture` (or a drag that leaves the element never receives its
`pointerup` and the object sticks to the cursor forever).

**`items-start` and `max-w` are load-bearing on the offset layouts.** The
stepped columns on home/Security and the staircase on `/about` both rely on
their items *not* stretching to fill. Remove either and the offsets collapse
back into a flat block — the layout looks broken in a way that reads as a
spacing bug rather than a missing constraint.

Every one of these has a `prefers-reduced-motion` branch that jumps to the
finished state. The scramble in particular is *skipped entirely* rather than
slowed — rapidly flashing text is precisely what that preference exists to
suppress.

### Teasers, not duplicates

The landing page's Security section — a summary with a link into `/security`
for the full detail — was removed on request, along with Workflow and the
interactive CSS-3D "Explore" chapter. Trust remains as the one surviving
teaser pattern: a summary on the landing page linking out, with the detail
living in exactly one place so it can't drift and search engines aren't asked
to choose between two near-identical documents. `/security` itself is
untouched and still the canonical page for that content — a reader who wants
it now finds it through the primary nav (`Navbar` → Security) rather than a
homepage summary.

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              fonts, metadata, JSON-LD, providers, chrome
│   ├── page.tsx                the nine-chapter narrative
│   ├── globals.css             ← ALL Tailwind theme config lives here (v4)
│   ├── sitemap.ts · robots.ts
│   └── api/contact/route.ts    validated, honeypot-guarded lead endpoint
│
├── components/
│   ├── layout/
│   │   ├── SmoothScrollProvider  Lenis ⇄ GSAP clock reconciliation
│   │   ├── Navbar · Footer
│   │   ├── ScrollProgress        top-of-viewport read progress bar
│   │   ├── BackToTop             floating scroll-to-top control
│   │   ├── DottedWave            2D-canvas dot wave under the hero
│   │   ├── ThemeToggle           light/dark switch (no React state — see below)
│   │
│   │   ├── PageHero              interior-page hero (/security, /about)
│   │
│   ├── sections/               one file per chapter, plus HeroVisual
│   ├── sections/               …plus SecurityMotion, AboutMotion
│   └── ui/                     Logo, SplitText, MagneticButton, TiltCard,
│                               CountUp, SectionIntro, ServiceIcon,
│                               SecurityGlyph, RevealGroup, ScrambleText,
│                               Timeline, SpotlightCard + AuroraPanel
├── hooks/
│   ├── useReducedMotion.ts
│   └── useIsomorphicLayoutEffect.ts
├── lib/
│   ├── site.ts                 ← shared company content + resolveNavHref()
│   ├── page-content.ts         /security and /about copy
│   ├── hero-visual.ts          illustration labels, stats, sparkline geometry
│   ├── theme.ts                theme storage + the no-flash init script
│   ├── scroll-state.ts         the mutable, un-reactive scroll store
│   ├── math.ts                 clamp/lerp/damp/track/smootherstep
│   └── gsap.ts                 single plugin registration point
└── types/global.d.ts           reserved for future ambient declarations
```

### Animation architecture

**One clock.** Lenis is stepped from inside `gsap.ticker`, and ScrollTrigger
updates from Lenis's scroll event — so smooth scrolling and every
scroll-triggered timeline agree on exactly the same position every frame.
`gsap.ticker.lagSmoothing(0)` is set because GSAP's default lag smoothing
fast-forwards timelines after a long frame, which would otherwise
desynchronise the two.

**A scroll store that doesn't cause re-renders.** `lib/scroll-state.ts` is a
plain mutable object, not React state, not context. `SmoothScrollProvider`
writes `progress`/`velocity`/pointer position into it on every Lenis tick
(which can exceed 120 Hz on a high-refresh trackpad); nothing subscribes to it
for a render, so scrolling itself never triggers React. Section-level motion
instead hangs off GSAP's own `ScrollTrigger` instances, which are the right
tool for "animate when this element crosses this point in the viewport."

**No paid GSAP plugins.** SplitText, DrawSVG and ScrollSmoother are Club GSAP
products. Their effects are reproduced with free equivalents:
- Text reveal → hand-rolled word masking (`ui/SplitText.tsx`)
- Path draw → `stroke-dasharray` + `stroke-dashoffset` (`sections/Workflow.tsx`)
- Smooth scroll → Lenis

---

## Performance

| Technique | Where |
|---|---|
| No WebGL and no 3D dependency in the bundle. The one `<canvas>` is 2D, capped at DPR 2, and `IntersectionObserver`-gated so it stops entirely once scrolled past | `layout/DottedWave` |
| Hero illustration is DOM + SVG on compositor-only transforms rather than a raster — no image bytes, and it stays sharp at any density | `sections/HeroVisual` |
| Two webfonts, not three — the editorial serif was removed with the accent-word retune | `app/layout` |
| `ScrollTrigger.batch` — cards enter in scroll-speed-aware groups, not one trigger each | `sections/Services`, `sections/Security`, `sections/Trust` |
| No pinned (`position: fixed`) sections anywhere — Complexity and Workflow use sticky headings + scrubbed/batched reveals instead, so nothing can ever be taller than the screen showing it | `sections/Complexity`, `sections/Workflow` |
| Marquee pauses on hover, focus and when scrolled off-screen | `sections/Trust` |
| Compositor-only properties (`transform`/`opacity`/`filter`) for every scroll-driven animation | throughout |
| `optimizePackageImports` for lucide-react | `next.config.mjs` |
| Zero external asset fetches — no images, no fonts beyond the three Google fonts, no HDRIs/textures | whole app |

**Lighthouse.** With no WebGL layer, 95+ across the board (mobile and
desktop) on Performance, Accessibility, Best Practices and SEO is a realistic
target — the previous 3D scene was the only thing pulling mobile performance
down into the mid-80s/90s.

---

## Accessibility

- Skip link; single `h1`; semantic landmarks throughout.
- Split-text markup is `aria-hidden`; the full sentence is exposed once via
  `aria-label` (or an adjacent `sr-only` heading), so nothing is read as a
  stream of disconnected words.
- Full keyboard support. The mobile sheet traps focus, closes on `Escape`,
  restores focus on close, and locks body scroll.
- Anchor navigation moves focus, not just scroll position.
- Form outcomes announced through `role="status"` live regions.
- Pinch-zoom is never disabled (`maximumScale: 5`).
- `prefers-reduced-motion` is honoured **by adapting, not by deleting**: colour
  and opacity transitions remain, Lenis is bypassed for native scrolling, and
  pins/parallax/stagger are removed in favour of a static, fully-visible layout.
  That includes the newer icon and form-field entrance tweens (Services,
  Security, ContactCta) and the navbar/footer mount cascades — every
  `useGSAP` added in this pass has its own `if (reducedMotion) { gsap.set(...
  end state); return; }` branch, same as the original sections.
- Text/background pairs in the palette meet WCAG AA. Re-run an audit if you
  change `--color-muted` or `--color-faint` — those two are closest to the line
  **in both themes**. Dark mode is not a free pass here: `--color-cobalt` is
  lifted to `#5B8BFF` specifically because the light-mode blue fails against a
  dark canvas, and `--color-faint` is the tightest pair in the dark palette.
- `color-scheme` is set from the theme class, so browser-native UI (form
  controls, Firefox's scrollbar, spellcheck underlines) matches the chosen
  theme rather than the OS.

---

## Design system

All tokens live in `src/app/globals.css` under `@theme`. **Tailwind v4 is
CSS-first — there is no `tailwind.config.ts`.**

| Token | Value | Role |
|---|---|---|
| `--color-frost` | `#F2F5FC` | Page canvas — faint lavender-blue cast |
| `--color-ink` | `#0A1020` | Primary type |
| `--color-navy` | `#111A35` | Headline ink, primary button |
| `--color-cobalt` | `#2F6BFF` | Primary accent — does all the accent work |
| `--color-positive` / `--color-negative` | `#16A06F` / `#D92D3F` | Metric deltas, form outcomes |
| `--color-coral` | `#FF7A3D` | **Logo terminal only** — not a page accent |
| `--color-muted` / `--color-faint` | `#59657F` / `#8B97B1` | Body / meta |

Type: **Sora** (display + UI) and **Inter** (body). Write `*word*` inside any
`SplitText` or `SectionIntro` title and it renders as the accent — the
authoring syntax is unchanged, but it now resolves to **electric blue**, not
the italic serif the earlier build used. That third font family has been
removed entirely.

Two surface classes do most of the work:

- `.surface-card` — solid surface, hairline border, diffuse shadow. The default
  for cards and panels.
- `.surface-glass` — near-opaque surface with a light blur. Only for things
  that genuinely overlap moving content (the navbar, the hero badge).

---

## Dark mode

**Light by default, toggle-only.** The OS `prefers-color-scheme` setting is
deliberately not consulted — a first-time reader always gets the light design,
and dark is something they opt into. That choice then persists in
`localStorage`. (To honour the system preference instead, the only file that
needs changing is `THEME_INIT_SCRIPT` in `lib/theme.ts`.)

**One class does everything.** `dark` on `<html>` re-colours the entire site,
because every colour in the system is a CSS custom property and the dark
palette is just those same properties redefined under `html.dark`. Tailwind v4
compiles colour utilities to `var(--color-*)` rather than inlining literals, so
overriding the variable flips every utility at once. Almost no component
carries a `dark:` variant.

That only holds if components use **tokens, not literals**. `bg-white` does not
become dark; `bg-surface` does. If you add a component, reach for `bg-surface`,
`text-navy`, `border-hairline` — never a raw colour.

### The three things that don't come for free

**1. Anything using ink as a background.** `--color-navy` is *headline ink*, so
it inverts to near-white. `bg-navy text-white` — the old primary button —
would become white-on-white. Hence the semantic `--color-inverse` /
`--color-on-inverse` pair, which means "the opposite of the page" and flips
deliberately. Same reason the modal scrim is `--color-scrim` rather than
`bg-navy/25`, which would have become a *light* wash over a dark page.

> ### ⚠️ `bg-inverse` is not "dark". It is "opposite".
>
> This one shipped and looked badly broken, so it is worth stating plainly.
> `/security` used `bg-inverse` for its hero and closing band, intending
> dramatic dark slabs. In light mode they were dark, as intended. **In dark
> mode they flipped to near-white** — a blazing white hero above near-black
> content, so the page appeared to change theme halfway down.
>
> The rule:
>
> | Use | For |
> |---|---|
> | `inverse` / `on-inverse` | Small elements only — buttons, pills, chips |
> | `surface` / `frost` / `mist` | Whole sections. These track the theme in the same direction as everything else |
>
> A section that must be dark in *both* themes needs its own non-flipping token
> pair. None exists, deliberately: a page that ignores the reader's theme
> choice is a worse answer than one that follows it.

Low-alpha ink tints (`bg-navy/[0.05]` for the scroll-progress track,
`bg-navy/10` for the clipboard rules) are fine as-is and *should* stay —
they correctly become subtle light tints on dark.

**2. Shadows.** A shadow composites over the background, so a navy shadow on a
navy-black canvas comes out lighter than the canvas — a glow, not a shadow.
The `--shadow-*` tokens go black-tinted and roughly triple in opacity under
dark. One-off inline shadows use `rgb(var(--shadow-tint) / <alpha>)`.

**3. Canvas and SVG.** `<canvas>` gets no cascade, so `DottedWave` is the one
place that reads the theme in JS — cached, updated by a `MutationObserver` on
the class, not polled per frame. Its dark ramp is *not* the light ramp
brightened: on a white page troughs recede by going paler, on a dark page they
must recede by going darker, so the luminance relationship inverts.

For SVG, CSS variables don't resolve inside presentation attributes
(`stroke="var(--color-cobalt)"` silently fails). Use a Tailwind class
(`className="stroke-cobalt"`) for strokes and fills, and inline `style` for
gradient stops (`style={{ stopColor: 'var(--color-cobalt)' }}`).

### No-flash on load

`THEME_INIT_SCRIPT` runs as a blocking inline script, first thing in `<body>`.
If the class were applied in an effect, a reader who chose dark would get a
full white frame on **every single load** — the most visible possible bug.
`suppressHydrationWarning` on `<html>` is what lets it mutate `className`
before React hydrates without warning.

`ThemeToggle` holds **no React state** for the same reason: the server can't
know the reader's choice, so any theme-dependent *markup* would hydrate
mismatched. Both icons are always in the DOM and swapped by the `dark:`
variant, so server and client render identically and the right icon shows
before JS runs.

---

## Configuration

`.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://heiller.com   # metadataBase, sitemap, JSON-LD
CONTACT_WEBHOOK_URL=                      # CRM / Zapier / ESP endpoint
CONTACT_NOTIFY_EMAIL=sushanth3306@gmail.com
```

With `CONTACT_WEBHOOK_URL` unset, form submissions are logged to the dev server
console and the form still works end to end.

---

## What's real and what isn't

heiller is a real, operating company as of this pass: HEILLER RCM LLC,
Phoenix AZ, founded 2026, eight people, three active clients, HIPAA-compliant,
US-only. Earlier drafts of this site described a different, much larger and
more automated company — a 40+ specialist team across US and India offices,
SOC 2/HITRUST/ISO 27001 certifications, a per-tenant encryption-key
architecture with brokered virtual desktops, a live daily-refreshed analytics
dashboard, fictional testimonials from named people at fictional companies,
and specific performance deltas ("+6.2 pts", "within two quarters of
onboarding") nobody had measured. None of that was true, and a site aimed at
US government review is exactly the wrong place to leave it standing. It has
been rewritten throughout — company identity, hero copy, services, the
Analytics section (now industry benchmarks, not a mock dashboard), Trust (now
three honest statements instead of a logo marquee and invented quotes), the
About page (real stats, real leadership names and titles, no fabricated
bios), and the Security page's data-handling and access-control descriptions
(rewritten to match an 8-person, mostly-manual operation rather than a
platform engineering team's infrastructure).

**Three things are still genuinely open**, flagged `PLACEHOLDER` in
`lib/page-content.ts`, and need real information (not more writing) to close:

1. **The subprocessors table** (`subprocessors`) now names real vendors — AWS
   and Microsoft 365 — but their `baa` status is deliberately set to "Confirm
   before publishing" rather than "Executed." Both vendors offer a standard
   HIPAA BAA (AWS via AWS Artifact, Microsoft via the Online Services
   HIPAA/BAA terms), but whether heiller has actually signed either has not
   been verified in this pass — check and update before this table is final.
   The clearinghouse row still needs a real vendor name once one is selected.
   Separately: the team's use of consumer ChatGPT/Claude accounts (no PHI
   entered, so not listed as subprocessors) is disclosed in a note under the
   table on `/security` — if that ever changes, a BAA-backed enterprise tier
   becomes mandatory before continuing.
2. **The SEV-1 breach-notification window** (`incidentTiers`, 24 hours) is
   confirmed as a commitment the team can meet — no longer open, kept here as
   a reminder that it's a real promise, not a template default.
3. **The vulnerability-disclosure contact** now points at a dedicated address,
   `security@heillerrcm.com` (`disclosure.email` in `lib/page-content.ts`).
   **That inbox needs to actually exist and be monitored** before this page
   goes live — a dedicated address nobody reads is worse than the general one.

Two smaller, non-content items also remain:

4. **Swap the logo.** `components/ui/Logo.tsx` contains an original
   placeholder mark ("the closing cycle"): a blue ring left deliberately
   unclosed, with a warm terminal as the point of intervention. Replace the
   `<svg>` body there and `public/logo.svg`.
5. **There is no social-share preview image.** `app/opengraph-image.tsx` is
   referenced by an older version of this README and by a leftover line in
   `layout.tsx`'s metadata comments, but the file does not actually exist in
   this project — confirmed by checking the filesystem, not assumed from the
   docs. `metadata.openGraph` and `metadata.twitter` in `app/layout.tsx` set
   no `images` field either, and there's no static image in `public/` to fall
   back to. Practically: when a heiller link is shared on LinkedIn, Slack, or
   X, it will render with **no preview image at all** — not a broken one, just
   absent. This predates the content-accuracy pass and is a real gap, not a
   content problem; fix it by adding `app/opengraph-image.tsx` (Next.js's
   `ImageResponse` file convention) or a static image referenced from
   `metadata.openGraph.images`.
6. **Write the legal pages.** The footer links Privacy, Terms, HIPAA notice
   and Accessibility to `#`.

And two standing operational notes, unrelated to the content pass:

7. **`/api/contact` is not a HIPAA-compliant channel.** The form copy tells
   users not to submit PHI. If you ever intend to accept PHI, you need BAAs
   with your hosting and email providers, encryption at rest, and audit
   logging.
8. **Delete the stub files.** See "One manual step" above.

heiller currently publishes **no phone number** (`contact` in `lib/site.ts`
has no `phoneDisplay`/`phoneHref` field — it was removed rather than filled
with a placeholder) and **no social links** (`socials` is an empty array).
Add either back once there's a real number or real, live accounts to point
to — an empty "Follow" section or a fake phone number is worse than omitting
both, which is what the site currently does.

---

## Editing content

**Everything company-specific is in `src/lib/site.ts`.** No component hard-codes
a phone number, service name, statistic or URL.

Adding a new chapter is now simple: add a new `<Section />` to `app/page.tsx`
in the right position and update the chapter table in that file's own doc
comment. There are no cross-file keyframe arrays to keep in sync anymore —
each section's animation is self-contained. **Ignore `CHAPTERS` in
`lib/site.ts`** — it's orphaned leftover from the removed WebGL scene, still
lists `workflow` and `security` even though both are gone from the homepage,
and nothing in the app reads it. Don't append to it; it does nothing.

---

## Browser support

Modern evergreen browsers. `backdrop-filter` degrades to a solid translucent
surface where unsupported. Tested targets: Chrome/Edge 111+, Firefox 121+,
Safari 16.4+.
