# Team photos

Drop headshots here and point at them from `src/lib/team-content.ts` via each
person's `photo` field, e.g. `photo: '/team/arjun-patel.jpg'`.

Anyone without a `photo` renders a neutral placeholder at the correct aspect
ratio, so the page never breaks while you are still collecting images.

## Specs

| Card        | Crop        | Export at   |
| ----------- | ----------- | ----------- |
| Leadership  | 1.35 : 1    | 1200 × 890  |
| Team member | 1.3 : 1     | 900 × 690   |

Images are rendered through `next/image` with `object-position: center top`, so
leave headroom above the subject rather than centring the face in the frame.

## Shooting notes

The cards render grayscale and only go colour on hover, which hides a lot of
white-balance mismatch — but not framing mismatch. For a consistent set:

- Plain wall, no busy background
- Face a window; no overhead lighting
- Waist-up, eyes about a third down the frame
- Same distance and same eye level for everyone

`.jpg` at ~80% quality is fine; Next.js re-encodes and serves modern formats.
