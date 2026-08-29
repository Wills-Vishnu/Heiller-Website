export const METRIC_MESH_PALETTE = [
  [0.851, 0.275, 0.659], // #d946a8 magenta/pink
  [0.957, 0.247, 0.431], // #f43f6e coral/red
  [1.000, 0.357, 0.208], // #ff5b35 orange-red
  [0.976, 0.451, 0.086], // #f97316 orange
  [0.753, 0.518, 0.988], // #c084fc soft purple
] as const;

export type MetricMeshTarget = {
  readonly canvas: HTMLCanvasElement;
  readonly value: string;
  readonly index: number;
  readonly font: string;
};

export type MetricMeshRenderer = {
  setTargets(targets: readonly MetricMeshTarget[]): void;
  resize(): void;
  dispose(): void;
};

export function getMetricFrameTime(milliseconds: number, reducedMotion: boolean) {
  return reducedMotion ? 12 : milliseconds / 1000;
}

export function getMetricSampleWindow(index: number) {
  const fraction = Math.max(0, Math.min(1, index / 3));
  return { x: fraction * 0.38, y: (1 - fraction) * 0.38, width: 0.62, height: 0.62 };
}

const VERTEX_SHADER = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
vec3 pal(int i){
  if(i==0) return vec3(0.851,0.275,0.659);
  if(i==1) return vec3(0.957,0.247,0.431);
  if(i==2) return vec3(1.000,0.357,0.208);
  if(i==3) return vec3(0.976,0.451,0.086);
  return vec3(0.753,0.518,0.988);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float t=u_time*0.30;
  vec3 acc=vec3(0.0); float total=0.0; float chromaSum=0.0;
  for(int i=0;i<5;i++){
    float fi=float(i);
    vec2 c=vec2(0.5+0.44*sin(t*(0.55+fi*0.13)+fi*1.7),0.5+0.44*cos(t*(0.47+fi*0.17)+fi*2.3));
    float d=distance(uv,c); float w=exp(-d*d*8.0); vec3 colour=pal(i);
    chromaSum+=length(colour-vec3(dot(colour,vec3(0.299,0.587,0.114))))*w;
    acc+=colour*w; total+=w;
  }
  vec3 col=acc/max(total,0.0001);
  float targetC=chromaSum/max(total,0.0001);
  float lum=dot(col,vec3(0.299,0.587,0.114));
  vec3 chroma=col-vec3(lum); float lengthC=length(chroma);
  col=clamp(vec3(lum)+chroma*min(targetC/max(lengthC,0.002),2.6),0.0,1.0);
  gl_FragColor=vec4(col,1.0);
}`;

export function createMetricMeshRenderer(
  source: HTMLCanvasElement,
  options: { reducedMotion: boolean; onReady?: () => void },
): MetricMeshRenderer | null {
  source.width = 512;
  source.height = 288;
  const gl = source.getContext('webgl');
  if (!gl) return null;

  const compile = (type: number, code: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'u_res');
  const time = gl.getUniformLocation(program, 'u_time');
  gl.viewport(0, 0, source.width, source.height);
  gl.uniform2f(resolution, source.width, source.height);

  let targets: readonly MetricMeshTarget[] = [];
  let frameId = 0;
  let disposed = false;
  const startedAt = performance.now();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const paintTarget = (target: MetricMeshTarget) => {
    const { canvas } = target;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const sample = getMetricSampleWindow(target.index);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.drawImage(source, sample.x * source.width, sample.y * source.height, sample.width * source.width, sample.height * source.height, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.fillStyle = '#000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = target.font;
    context.fillText(target.value, width / 2, height / 2);
    context.globalCompositeOperation = 'source-over';
  };

  const render = (now: number) => {
    if (disposed) return;
    gl.uniform1f(time, getMetricFrameTime(now - startedAt, options.reducedMotion));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    targets.forEach(paintTarget);
    if (!options.reducedMotion) frameId = requestAnimationFrame(render);
  };

  render(performance.now());
  options.onReady?.();

  return {
    setTargets(nextTargets) {
      targets = [...nextTargets].sort((a, b) => a.index - b.index);
      if (options.reducedMotion) render(performance.now());
    },
    resize() {
      targets.forEach(paintTarget);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
