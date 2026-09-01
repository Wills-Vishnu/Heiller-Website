export type WorkflowVisual =
  | 'registration'
  | 'coding'
  | 'submission'
  | 'denial'
  | 'ar'
  | 'reporting';

type RGB = readonly [number, number, number];

export type WorkflowGradientScene = {
  colors: readonly [RGB, RGB, RGB, RGB];
  seed: number;
  offset: readonly [number, number];
  fallback: string;
};

export type AtlasCell = { x: number; y: number; width: number; height: number };

export const WORKFLOW_VISUAL_ORDER: readonly WorkflowVisual[] = [
  'registration',
  'coding',
  'submission',
  'denial',
  'ar',
  'reporting',
] as const;

const rgb = (red: number, green: number, blue: number): RGB => [red / 255, green / 255, blue / 255];

export const WORKFLOW_GRADIENT_SCENES = {
  registration: {
    colors: [rgb(255, 210, 165), rgb(255, 139, 113), rgb(255, 147, 196), rgb(208, 185, 255)],
    seed: 11.4,
    offset: [-0.18, 0.08],
    fallback: 'radial-gradient(circle at 18% 20%, #ffd2a5, transparent 42%), radial-gradient(circle at 78% 35%, #d0b9ff, transparent 46%), linear-gradient(135deg, #ff8b71, #ff93c4)',
  },
  coding: {
    colors: [rgb(202, 235, 255), rgb(137, 174, 255), rgb(202, 178, 255), rgb(255, 247, 218)],
    seed: 23.8,
    offset: [0.16, -0.12],
    fallback: 'radial-gradient(circle at 22% 18%, #caebff, transparent 42%), radial-gradient(circle at 74% 28%, #fff7da, transparent 44%), linear-gradient(140deg, #89aeff, #cab2ff)',
  },
  submission: {
    colors: [rgb(255, 231, 119), rgb(255, 185, 124), rgb(255, 109, 186), rgb(203, 180, 255)],
    seed: 37.2,
    offset: [-0.05, 0.2],
    fallback: 'radial-gradient(circle at 20% 72%, #ffe777, transparent 42%), radial-gradient(circle at 76% 22%, #cbb4ff, transparent 46%), linear-gradient(145deg, #ffb97c, #ff6dba)',
  },
  denial: {
    colors: [rgb(255, 164, 130), rgb(255, 111, 187), rgb(183, 146, 255), rgb(126, 173, 255)],
    seed: 49.6,
    offset: [0.22, 0.06],
    fallback: 'radial-gradient(circle at 28% 18%, #ffa482, transparent 42%), radial-gradient(circle at 80% 70%, #7eadff, transparent 46%), linear-gradient(135deg, #ff6fbb, #b792ff)',
  },
  ar: {
    colors: [rgb(157, 235, 236), rgb(166, 238, 199), rgb(151, 174, 255), rgb(255, 243, 210)],
    seed: 63.1,
    offset: [-0.24, -0.16],
    fallback: 'radial-gradient(circle at 22% 24%, #9debec, transparent 42%), radial-gradient(circle at 78% 26%, #fff3d2, transparent 46%), linear-gradient(145deg, #a6eec7, #97aeff)',
  },
  reporting: {
    colors: [rgb(159, 216, 255), rgb(203, 182, 255), rgb(255, 192, 205), rgb(255, 232, 137)],
    seed: 78.5,
    offset: [0.1, 0.18],
    fallback: 'radial-gradient(circle at 18% 24%, #9fd8ff, transparent 42%), radial-gradient(circle at 78% 76%, #ffe889, transparent 46%), linear-gradient(140deg, #cbb6ff, #ffc0cd)',
  },
} as const satisfies Record<WorkflowVisual, WorkflowGradientScene>;

export function getAtlasCell(visual: WorkflowVisual, atlasWidth: number, atlasHeight: number): AtlasCell {
  const index = WORKFLOW_VISUAL_ORDER.indexOf(visual);
  const width = Math.floor(atlasWidth / 3);
  const height = Math.floor(atlasHeight / 2);
  return { x: (index % 3) * width, y: Math.floor(index / 3) * height, width, height };
}

export function shouldAnimateWorkflowGradient(state: {
  disposed: boolean;
  reducedMotion: boolean;
  documentVisible: boolean;
  inView: boolean;
}): boolean {
  return !state.disposed && !state.reducedMotion && state.documentVisible && state.inView;
}

export type WorkflowGradientTarget = { visual: WorkflowVisual; canvas: HTMLCanvasElement };

export type WorkflowGradientRendererOptions = {
  atlas: HTMLCanvasElement;
  host: HTMLElement;
  targets: readonly WorkflowGradientTarget[];
  reducedMotion: boolean;
  onReady?: () => void;
};

export type WorkflowGradientRenderer = {
  dispose: () => void;
  renderFrame: (elapsedSeconds: number) => void;
};

const VERTEX_SHADER = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[4];
uniform vec4 u_scene;
uniform vec4 u_params;
uniform vec2 u_origin;
uniform vec2 u_offset;
uniform float u_seed;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_scale u_params.x
#define u_intensity u_params.y
#define u_contrast u_params.z
#define u_grain u_params.w

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 shade(vec2 p, float t) {
  vec3 acc = u_colors[0] * 0.18;
  float total = 0.18;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 center = vec2(
      sin(t * (0.18 + fi * 0.049) + fi * 2.31 + u_seed),
      cos(t * (0.14 + fi * 0.061) + fi * 1.73 + u_seed * 0.31)
    ) * (0.44 + u_intensity * 0.32);
    float weight = exp(-dot(p - center, p - center) * 5.2);
    acc += u_colors[i] * weight;
    total += weight;
  }
  return acc / total;
}

void main() {
  vec2 localFragment = gl_FragCoord.xy - u_origin;
  vec2 p = (localFragment - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p = p * u_scale + u_offset;
  vec3 color = shade(p, u_time);
  color = (color - 0.5) * u_contrast + 0.5;
  color = mix(color, vec3(1.0), 0.08);
  color += (grainHash(localFragment + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

const MAX_ATLAS_WIDTH = 1920;
const MAX_ATLAS_HEIGHT = 1080;
const MAX_DPR = 1.5;
const TIME_SCALE = 0.18;

export function createWorkflowGradientRenderer(
  options: WorkflowGradientRendererOptions,
): WorkflowGradientRenderer | null {
  const { atlas, host, targets, reducedMotion, onReady } = options;
  if (targets.length !== WORKFLOW_VISUAL_ORDER.length) return null;

  const gl = atlas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    colors: gl.getUniformLocation(program, 'u_colors'),
    scene: gl.getUniformLocation(program, 'u_scene'),
    params: gl.getUniformLocation(program, 'u_params'),
    origin: gl.getUniformLocation(program, 'u_origin'),
    offset: gl.getUniformLocation(program, 'u_offset'),
    seed: gl.getUniformLocation(program, 'u_seed'),
  };
  gl.enable(gl.SCISSOR_TEST);
  gl.uniform4f(uniforms.params, 1.12, 0.32, 1.05, 0.035);

  const contexts = targets.map(({ canvas }) => canvas.getContext('2d'));
  if (contexts.some((context) => !context)) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    return null;
  }

  let disposed = false;
  let documentVisible = document.visibilityState === 'visible';
  let inView = true;
  let raf = 0;
  let elapsedSeconds = 0;
  let lastNow: number | null = null;
  let ready = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const largest = targets.reduce(
      (size, { canvas }) => {
        const rect = canvas.getBoundingClientRect();
        return { width: Math.max(size.width, rect.width), height: Math.max(size.height, rect.height) };
      },
      { width: 1, height: 1 },
    );
    const cellWidth = Math.min(640, Math.max(1, Math.ceil(largest.width * dpr)));
    const cellHeight = Math.min(540, Math.max(1, Math.ceil(largest.height * dpr)));
    atlas.width = Math.min(MAX_ATLAS_WIDTH, cellWidth * 3);
    atlas.height = Math.min(MAX_ATLAS_HEIGHT, cellHeight * 2);
    for (const { canvas } of targets) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.ceil(rect.width * dpr));
      canvas.height = Math.max(1, Math.ceil(rect.height * dpr));
    }
  };

  const renderFrame = (time: number) => {
    if (disposed) return;
    try {
      gl.useProgram(program);
      for (const visual of WORKFLOW_VISUAL_ORDER) {
        const scene = WORKFLOW_GRADIENT_SCENES[visual];
        const cell = getAtlasCell(visual, atlas.width, atlas.height);
        const glY = atlas.height - cell.y - cell.height;
        gl.viewport(cell.x, glY, cell.width, cell.height);
        gl.scissor(cell.x, glY, cell.width, cell.height);
        gl.uniform3fv(uniforms.colors, new Float32Array(scene.colors.flat()));
        gl.uniform4f(uniforms.scene, cell.width, cell.height, time * TIME_SCALE, 4);
        gl.uniform2f(uniforms.origin, cell.x, glY);
        gl.uniform2f(uniforms.offset, scene.offset[0], scene.offset[1]);
        gl.uniform1f(uniforms.seed, scene.seed);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      gl.flush();

      let copiedAllTargets = true;
      targets.forEach((target, index) => {
        const context = contexts[index];
        if (!context) {
          copiedAllTargets = false;
          return;
        }
        const cell = getAtlasCell(target.visual, atlas.width, atlas.height);
        try {
          context.drawImage(
            atlas,
            cell.x,
            cell.y,
            cell.width,
            cell.height,
            0,
            0,
            target.canvas.width,
            target.canvas.height,
          );
        } catch {
          copiedAllTargets = false;
        }
      });
      if (copiedAllTargets && !ready) {
        ready = true;
        onReady?.();
      }
    } catch {
      disposed = true;
      if (raf !== 0) cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  function requestRender() {
    if (shouldAnimateWorkflowGradient({ disposed, reducedMotion, documentVisible, inView }) && raf === 0) {
      raf = requestAnimationFrame(render);
    }
  }

  function render(now: number) {
    raf = 0;
    if (!shouldAnimateWorkflowGradient({ disposed, reducedMotion, documentVisible, inView })) {
      lastNow = null;
      return;
    }
    if (lastNow !== null) elapsedSeconds += Math.min((now - lastNow) / 1000, 0.1);
    lastNow = now;
    renderFrame(elapsedSeconds);
    requestRender();
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    renderFrame(elapsedSeconds);
    requestRender();
  });
  resizeObserver.observe(host);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? true;
    lastNow = null;
    if (inView) {
      renderFrame(elapsedSeconds);
      requestRender();
    } else if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  intersectionObserver.observe(host);

  const onVisibilityChange = () => {
    documentVisible = document.visibilityState === 'visible';
    lastNow = null;
    if (documentVisible) {
      renderFrame(elapsedSeconds);
      requestRender();
    } else if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  resize();
  renderFrame(0);
  requestRender();

  return {
    renderFrame,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      atlas.width = 1;
      atlas.height = 1;
      for (const { canvas } of targets) {
        canvas.width = 1;
        canvas.height = 1;
      }
    },
  };
}
