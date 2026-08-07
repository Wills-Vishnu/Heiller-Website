/**
 * REMOVED — the entire WebGL background layer.
 *
 * This directory (`src/components/canvas/`) used to hold the site's animated
 * 3D background: a persistent `<Canvas>` with a scroll-choreographed camera,
 * a field of tumbling record cards, a glass ledger slab, an ECG-to-revenue
 * pulse trace, a value-stream of tokens, and a dune-like wave field beneath
 * it all.
 *
 * All of it has been removed at the user's request. The page now renders
 * against a flat background with no 3D scene, no `<canvas>` element, and no
 * `three`/`@react-three/*` dependency (see `package.json`).
 *
 * Every file in this directory has been emptied to a stub for the same
 * reason — the sandbox this change was made in could not run `rm`, so
 * deleting `three` from `package.json` while leaving these files' contents in
 * place would have broken `tsc --noEmit` (TypeScript type-checks every
 * `.tsx` file matched by `tsconfig.json`, not just the ones actually
 * imported). Please delete the whole directory:
 *
 *     rm -rf src/components/canvas
 */
export {};
