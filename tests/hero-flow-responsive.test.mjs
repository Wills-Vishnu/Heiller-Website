import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const landingPath = new URL('../index.html', import.meta.url);

test('hero process canvas is centered inside the shared content frame', async () => {
  const html = await readFile(landingPath, 'utf8');

  assert.doesNotMatch(html, /\.hero__flow\s*\{[^}]*width:\s*1400px;/s);
  assert.match(html, /\.hero__flow\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*var\(--content-frame-max\);/s);
  assert.match(html, /\.flow__tags\s*\{[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\);/s);
});

test('hero process retains fluid tablet and readable mobile layouts', async () => {
  const html = await readFile(landingPath, 'utf8');

  assert.match(html, /@media \(max-width:\s*960px\)[\s\S]*?\.flow__tags\s*\{[^}]*left:\s*0;[^}]*transform:\s*none;[^}]*aspect-ratio:\s*1079\s*\/\s*275;/s);
  assert.match(html, /@media \(max-width:\s*640px\)[\s\S]*?\.flow__wires\s*\{\s*display:\s*none;\s*\}[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s);
});

test('hero process nodes use the approved transparent liquid-glass pill treatment', async () => {
  const html = await readFile(landingPath, 'utf8');
  const flow = html.match(/<div class="flow__tags">[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? '';

  assert.equal((flow.match(/class="tag(?: tag--(?:start|terminal))?"/g) ?? []).length, 8);
  assert.equal((flow.match(/class="tag__label"/g) ?? []).length, 8);
  for (const label of ['Patient', 'Verify', 'Code', 'Claim', 'Process', 'Payment', 'Report', 'Optimize']) {
    assert.match(flow, new RegExp(`<span class="tag__label">${label}<\\/span>`));
  }

  assert.match(html, /\.tag\s*\{[^}]*border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.72\);[^}]*border-radius:\s*999px;[^}]*backdrop-filter:\s*blur\(14px\) saturate\(145%\);[^}]*-webkit-backdrop-filter:\s*blur\(14px\) saturate\(145%\);/s);
  assert.match(html, /\.tag::before\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(html, /\.tag::after\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(html, /\.tag__label\s*\{[^}]*z-index:\s*1;/s);
  assert.match(html, /@supports not \(\(backdrop-filter:\s*blur\(1px\)\) or \(-webkit-backdrop-filter:\s*blur\(1px\)\)\)[\s\S]*?\.tag\s*\{[^}]*background:/s);
  assert.doesNotMatch(html, /querySelectorAll\([^)]*\.flow__tags \.tag[^)]*\)[\s\S]{0,500}pointer(?:down|move|up)/s);
});

test('hero process inactive pills use active-strength color and active pills get brighter', async () => {
  const html = await readFile(landingPath, 'utf8');

  assert.match(html, /\.tag\s*\{[^}]*background:\s*color-mix\(in srgb,\s*rgba\(255,255,255,\.38\)\s*54%,\s*var\(--node-color\)\s*46%\);/s);
  assert.match(html, /0%\s*\{[\s\S]*?background:\s*color-mix\(in srgb,\s*rgba\(255,255,255,\.38\)\s*54%,\s*var\(--node-color\)\s*46%\);/s);
  assert.match(html, /6\.5%,\s*10\.5%\s*\{[\s\S]*?background:\s*color-mix\(in srgb,\s*rgba\(255,255,255,\.2\)\s*28%,\s*var\(--node-color\)\s*72%\);/s);
  assert.match(html, /6\.5%,\s*10\.5%\s*\{[\s\S]*?0 0 30px 14px color-mix\(in srgb,\s*var\(--node-color\)\s*34%,\s*transparent\);/s);
  assert.doesNotMatch(html, /rgba\(255,\s*255,\s*255,\s*\.46\)\s*92%,\s*var\(--node-color\)\s*8%/);
});

test('hero process keeps pill radii across responsive layouts', async () => {
  const html = await readFile(landingPath, 'utf8');
  assert.doesNotMatch(html, /\.flow__tags \.tag\s*\{[^}]*border-radius:\s*4px;/s);
  assert.match(html, /@media \(max-width:\s*960px\)[\s\S]*?\.flow__tags \.tag\s*\{[^}]*border-radius:\s*999px;/s);
  assert.match(html, /@media \(max-width:\s*640px\)[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s);
});
