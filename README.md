# Heiller - landing site

Marketing site for Heiller, an end-to-end revenue cycle management company.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # type-check + production bundle into dist/
npm run preview
```

Vanilla TypeScript + Vite. No UI framework. The page is static semantic HTML
and TS only adds behaviour on top. `gsap` + `lenis` drive scroll and motion,
`three` renders a single atmosphere shader on the closing panel.

---

## Where this came from

The Figma source (`5u89MvFcjvlrODtEvEBEHs`, node `3:2695`) is a re-skinned
template. Its headings had been swapped to RCM terms, but the body copy and
mockup screenshots still belonged to "Teak", a mobile-game retention product,
and talked about players, gems and push campaigns. It was used for structure
and content slots only.

Layout structure came from a supplied reference (an Oxaley-style page): the
line-by-line headline fade, the white editorial statement break, and the
oversized closing wordmark.

The palette is sampled from `public/img/cubic-glass.jpg`, the supplied hero
asset. Amber core, coral low-bloom, peach tints, warm neutrals. Nothing in the
colour system is invented alongside it.

A typo in the Figma (`Secure and Transperant`) is corrected here.

---

## Design direction

**Luminance rhythm.** light hero -> dark ticker -> white statement -> dark
proof -> warm-grey services -> dark workflow -> white trust -> dark close. The
page never sits on one value long enough to go flat.

**Type.** Inter Tight for display at 500/600 with tight tracking. Geist Mono
for anything representing data: stats, labels, step numbers, buttons.

**Brand mark.** The supplied `Frame.svg` (kept verbatim at
`public/img/logo.svg`). It is inlined once as an SVG `<symbol id="logo">` at
the top of `index.html` and referenced by `<use>` in the nav, the footer and
the closing lockup, so the path exists once in the document rather than three
times. It is a single filled path drawn in `currentColor`, so it inverts with
whatever panel it sits on. The favicon carries the same path over the ink
ground.

**No em dashes in the page copy.** Sentences were rewritten rather than having
the dash swapped for a hyphen.

### Hero

The cubic-glass asset is the background, shown as supplied. No shader, no
filter, no scrim, no recolouring. `.hero__scrim` is deliberately `display:none`
rather than deleted, as a marker that covering this image was tried and
rejected: a wash heavy enough to guarantee text contrast flattened the glass
tiles into something that read like a generated gradient.

Because the art is uncovered, **the type adapts to it instead**. Contrast here
was not eyeballed; it was measured by drawing the asset into an offscreen
canvas at the same `center / cover` geometry and sampling the worst pixel under
each text block (see the probe pattern in the git history). Results drove three
decisions:

- The headline carries no `line--dim` trail-off. Grey on the amber band
  measured **1.98:1**; solid ink measures **8.70:1**. The device stays on the
  statement section, which is flat white.
- Stat labels are full `--ink`, not `--ink-3`, which measured **2.50:1** there.
- The hero sub uses `--ink-art`, a darker body tone. `--ink-2` passed at
  **4.74:1**, too thin a margin to survive an intermediate width re-cropping
  the image behind it. It now measures **6.35:1**.

Verified passing at 375px, 753px and 1425px. If the asset is ever swapped,
re-run those measurements — every one of these choices is downstream of this
particular image.

Earlier revisions put a particle simulation and then a violet bloom in this
slot. Neither survived review.

### The animated explainers - `src/viz/cardViz.ts`

Nine live diagrams on 2D canvas, each animating what its card describes: codes
resolving onto chart lines, charges reconciling against the schedule, an
eligibility radar returning a benefit panel, claims passing scrubber gates,
denials arcing over the payer wall and rejoining downstream, A/R aging buckets,
ERA lines matching into the ledger, a credentialing calendar hitting a
revalidation date, and a net-collection series drawing itself in.

Three of them (`denial`, `ar`, `analytics`) are reused at large format in the
**Proof** section, where the reference had photography. There is no stock
imagery on the page. The diagrams carry the visual load.

They only run while on screen, and paint a single static frame under
`prefers-reduced-motion`.

**Sizing gotcha:** the diagrams are composed against a 392px card. Positions
are fractions of w/h so they reflow, but stroke widths, dot radii and type are
absolute. `CardViz.paint()` scales the *context* rather than the geometry, so a
1220px panel grows the whole diagram together instead of drawing 1px lines that
disappear. The scale is capped at 2.4 so a full-bleed panel does not end up
with 30px labels.

### Closing panel - `src/gl/Bloom.ts`

A domain-warped fbm mass, dithered to kill the banding a CSS gradient would
show. Its origin is kept high and to the right on purpose: the canvas spans the
CTA *and* the footer, so a low core lands behind the footer links and a left
one lands behind the copy, and both of those are left-aligned. The signup card
carries its own opaque backing for the same reason.

---

## Motion

- **Lenis** smooth scroll, driven from the GSAP ticker so there is one rAF loop
  for scroll, the shader, and twelve canvases.
- Hand-rolled line splitter (`maskWhole` / `maskLines` in `main.ts`) instead of
  GSAP SplitText, so the build carries no plugin licence question.
- `data-dim-from="n"` on a split heading greys every line past `n` **after**
  measuring how the text actually wrapped, so the trail-off adapts to any
  viewport instead of being hardcoded per breakpoint.
- Pinned horizontal rail for the Day 1-30 workflow above 820px. Below that it
  becomes a native swipe lane with the same progress bar.
- Magnetic buttons, difference-blend cursor, scroll-velocity-linked ticker.
- The preloader has an 8s failsafe that jumps the intro timeline to its end.
  Without it, a page opened in a background tab returns to a stuck curtain,
  because rAF is frozen while hidden.

`prefers-reduced-motion` is honoured throughout.

---

## Accessibility

All text clears WCAG AA measured with proper alpha compositing against its
actual background: 4.5:1 for body, 3:1 for display sizes. Three tokens are
pinned by that constraint rather than by taste, so change them carefully:

- `--ink-3` (`#6b615a`) - small text on light. Holds 4.5:1 on `--base-2`,
  which is darker than white.
- `--ink-dim` (`#8a7d73`) - display-size de-emphasis only. Dark enough to keep
  3:1 where the hero art is at its peachiest, which is the binding case.
- Buttons use ink type on the amber wipe. White on amber is only 2.8:1.

Single `h1`, ordered headings, skip link, labelled email input, visible focus
rings, Escape closes the mobile menu, decorative canvases are `aria-hidden`.

## Performance

Gzipped: ~28kB app, ~33kB gsap+lenis, ~115kB three.

**Worth deciding:** three.js is now 115kB gzip to draw one full-screen quad on
the closing panel, since the hero shader is gone. `Bloom` could be rewritten
against raw WebGL in roughly sixty lines and drop the dependency entirely, for
about a 60% cut to total JS. It is still here because three was the requested
stack. Say the word.

The shader pauses via `IntersectionObserver` when off screen, DPR is capped at
1.4, and context loss degrades to the CSS background rather than a black hole.
The hero asset is downscaled to 2400px / 130kB from the 6440px source.

---

## Before this ships

1. **Verify every number.** The stats (98.4% clean claim rate, -41% denial
   rate, 97.2% net collection, 22 days in A/R, and the ticker figures) came
   from the Figma comp or were written to fit it. They are plausible, not
   sourced.
2. **Legal / infosec sign-off on the security section.** It describes an
   intended posture: encryption, HIPAA, audit trails, residency, access
   control, continuity. Confirm each claim is true before publishing. There is
   a comment marking this in `index.html`.
3. **Wire the signup form.** `initForm()` validates and confirms but posts
   nowhere. Point it at the CRM.
4. **Client logos.** The Figma's logo strip held template placeholders, so it
   became an operating-metrics ticker rather than inventing logos. Drop a real
   logo lane back in once there are cleared names.
5. **Licence the hero asset.** Confirm usage rights for `Cubic Glass - 08`
   before this goes public.
6. Replace footer links (`#`-anchors today) with real routes, and add an OG
   image.
