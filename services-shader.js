/* Services panel mesh gradient.

   Runs the real Paper shader rather than an approximation: this is the vanilla
   core of the same package the design file uses (@paper-design/shaders), so the
   output matches the artboard exactly. Parameters are copied verbatim from the
   Paper node's exported definition.

   ShaderMount owns its own canvas and appends it to the element it is given, so
   the markup only needs an empty mount point. It also pauses itself when the
   tab is hidden or the element leaves the viewport. */

import {
  ShaderMount,
  meshGradientFragmentShader,
  getShaderColorFromString,
  defaultObjectSizing,
  ShaderFitOptions,
} from '@paper-design/shaders';

// From the Paper file, node "Mesh Gradient" (ShaderMeshGradient).
const PRESET = {
  speed: 0.67,
  scale: 1.24,
  distortion: 0.58,
  swirl: 0.27,
  grainMixer: 0.14,
  grainOverlay: 0.07,
  colors: ['#FFCC00', '#F2FCBD', '#F2FCBD', '#95B32B'],
};

const host = document.querySelector('[data-services-shader]');
if (host) {
  const sizing = { ...defaultObjectSizing, scale: PRESET.scale };

  const mount = new ShaderMount(
    host,
    meshGradientFragmentShader,
    {
      u_colors: PRESET.colors.map(getShaderColorFromString),
      u_colorsCount: PRESET.colors.length,
      u_distortion: PRESET.distortion,
      u_swirl: PRESET.swirl,
      u_grainMixer: PRESET.grainMixer,
      u_grainOverlay: PRESET.grainOverlay,
      u_fit: ShaderFitOptions[sizing.fit],
      u_scale: sizing.scale,
      u_rotation: sizing.rotation,
      u_originX: sizing.originX,
      u_originY: sizing.originY,
      u_offsetX: sizing.offsetX,
      u_offsetY: sizing.offsetY,
      u_worldWidth: sizing.worldWidth,
      u_worldHeight: sizing.worldHeight,
    },
    undefined,
    // Honour reduced motion by holding a single deterministic frame.
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : PRESET.speed,
  );

  host.dataset.servicesShaderReady = 'true';
  window.addEventListener('pagehide', () => mount.dispose(), { once: true });
}
