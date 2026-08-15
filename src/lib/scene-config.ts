/**
 * REMOVED.
 *
 * This file used to hold the palette, camera choreography, and formation math
 * for the WebGL background scene (the ledger, record cards, pulse ribbon, wave
 * field). That whole layer has been removed from the site at the user's
 * request — the page now has a flat background with no animated 3D scene.
 *
 * The sandbox this change was made in could not run `rm`, so this file was
 * emptied out instead of deleted so the project keeps type-checking and
 * building cleanly (it previously imported `three`, which is no longer a
 * dependency — see `package.json`). Please delete this file:
 *
 *     rm src/lib/scene-config.ts
 */
export {};
