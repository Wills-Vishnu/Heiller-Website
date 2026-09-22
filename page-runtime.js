/* Shared page runtime. Extracted from duplicated inline <script> blocks so
   the hero shader, audit flow and section effects have one source. Every
   block is a self-contained IIFE that no-ops when its target is absent, so
   removing a section never breaks the rest. */

// ── block 1 ─────────────────────────────────────────
/* Drawer controller. Drives every [data-drawer] on the page from one place,
   so privacy and specialties share the same sheet behaviour instead of
   carrying separate implementations. Each drawer declares its own hash, which
   keeps the view linkable and survives back/forward. */
(function () {
  var drawers = Array.prototype.slice.call(document.querySelectorAll("[data-drawer]"));
  if (!drawers.length) return;

  var locked = false;
  var openDrawer = null;

  function lockScroll() {
    if (locked) return;
    locked = true;
    /* Only the scrolling element is frozen. Taking the body out of flow with
       position: fixed relaid out the whole page and made the restore read as
       a scroll reset; overflow alone keeps the offset intact. The page
       already reserves the scrollbar via scrollbar-gutter, so nothing shifts. */
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    /* Everything behind the sheet is still composited through the translucent
       overlay, so the background animations keep costing frames while the
       drawer slides. Flag the state and let them idle. */
    document.documentElement.setAttribute('data-drawer-open', '');
    window.dispatchEvent(new Event('drawerstatechange'));
  }

  function unlockScroll() {
    if (!locked) return;
    locked = false;
    document.documentElement.style.overflow = '';
    document.documentElement.style.overscrollBehavior = '';
    document.documentElement.removeAttribute('data-drawer-open');
    window.dispatchEvent(new Event('drawerstatechange'));
  }

  function build(root) {
    var overlay = root.querySelector("[data-drawer-overlay]");
    var panel = root.querySelector("[data-drawer-panel]");
    var closeButton = root.querySelector("[data-drawer-close]");
    var hash = root.getAttribute("data-drawer-hash") || "";
    if (!overlay || !panel) return null;

    var previousHash = "";
    var previousActive = null;

    var api = {
      root: root,
      hash: hash,
      isOpen: function () { return !root.hasAttribute('data-closed'); },
      open: function () {
        if (openDrawer && openDrawer !== api) openDrawer.close();
        previousActive = document.activeElement;
        if (hash && window.location.hash !== hash) previousHash = window.location.hash;
        root.removeAttribute('data-closed');
        lockScroll();
        openDrawer = api;
        /* Flip to the open state on the next frame so the transition has a
           starting point to animate from. rAF is throttled to nothing while a
           tab is hidden, so a timeout backs it up: without that the sheet can
           be logically open yet still parked off-screen. */
        var revealed = false;
        function reveal() {
          if (revealed || root.hasAttribute('data-closed')) return;
          revealed = true;
          overlay.setAttribute("data-open", "true");
          panel.setAttribute("data-open", "true");
          /* preventScroll: focusing scrolls the target into view, which on a
             fixed sheet drags the locked page underneath it. */
          if (closeButton) closeButton.focus({ preventScroll: true });
        }
        window.requestAnimationFrame(reveal);
        window.setTimeout(reveal, 60);
        if (hash && window.location.hash !== hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search + hash);
        }
      },
      close: function () {
        overlay.removeAttribute("data-open");
        panel.removeAttribute("data-open");
        window.setTimeout(function () { root.setAttribute('data-closed', ''); }, 460);
        unlockScroll();
        if (openDrawer === api) openDrawer = null;
        if (hash && window.location.hash === hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search + previousHash);
        }
        if (previousActive && typeof previousActive.focus === "function") previousActive.focus({ preventScroll: true });
      }
    };

    if (closeButton) closeButton.addEventListener("click", api.close);
    overlay.addEventListener("click", api.close);
    return api;
  }

  var registry = {};
  drawers.forEach(function (root) {
    root.hidden = false;
    root.setAttribute('data-closed', '');
    var api = build(root);
    if (api && root.id) registry[root.id] = api;
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest ? event.target.closest("[data-drawer-open]") : null;
    if (!trigger) return;
    var api = registry[trigger.getAttribute("data-drawer-open")];
    if (!api) return;
    event.preventDefault();
    api.open();
  });

  window.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !openDrawer) return;
    openDrawer.close();
  });

  function syncToHash() {
    Object.keys(registry).forEach(function (id) {
      var api = registry[id];
      if (!api.hash) return;
      if (window.location.hash === api.hash && !api.isOpen()) api.open();
      else if (window.location.hash !== api.hash && api.isOpen()) api.close();
    });
  }
  window.addEventListener("hashchange", syncToHash);
  syncToHash();
})();

// ── block 2 ─────────────────────────────────────────
(function () {
    var canvases = Array.prototype.slice.call(document.querySelectorAll(".hero-bg, .site-footer__bg"));
    if (!canvases.length) return;
    canvases.forEach(function (canvas) {
    var exposeSharedShader = canvas.classList.contains("hero-bg");
    var gl = canvas.getContext("webgl", {
      antialias: false,
      /* alpha must stay on. The shader writes alpha 1.0, but both canvases are
         faded into the page with a CSS mask-image, and a mask needs a layer that
         can carry per-pixel alpha. Declaring the drawing buffer opaque under a
         mask leaves artefacts along the masked edges. */
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: exposeSharedShader
    });
    if (!gl) return;

    var VERT =
      "attribute vec2 a_position;" +
      "void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }";

    var FRAG = [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH",
      "precision highp float;",
      "#else",
      "precision mediump float;",
      "#endif",
      "uniform vec3 u_colors[8];",
      "uniform vec4 u_scene;",
      "uniform vec4 u_shape;",
      "uniform vec4 u_surface;",
      "uniform vec4 u_finish;",
      "uniform vec4 u_transform;",
      "uniform vec4 u_space;",
      "uniform vec4 u_cursor;",
      "#define u_resolution u_scene.xy",
      "#define u_time u_scene.z",
      "#define u_colorCount u_scene.w",
      "#define u_scale u_shape.x",
      "#define u_intensity u_shape.y",
      "#define u_paramA u_shape.z",
      "#define u_warp u_shape.w",
      "#define u_detail u_surface.x",
      "#define u_contrast u_surface.y",
      "#define u_brightness u_surface.z",
      "#define u_saturation u_surface.w",
      "#define u_hue u_finish.x",
      "#define u_vignette u_finish.y",
      "#define u_blur u_finish.z",
      "#define u_grain u_finish.w",
      "#ifdef GL_FRAGMENT_PRECISION_HIGH",
      "#define u_seed u_transform.x",
      "#else",
      "#define u_seed mod(u_transform.x, 31.0)",
      "#endif",
      "#define u_rotate u_transform.y",
      "#define u_drift u_transform.z",
      "#define u_oklab u_transform.w",
      "#define u_offset u_space.xy",
      "#define u_mouse u_space.zw",
      "#define u_cursorPresence u_cursor.x",
      "#define u_cursorEffect u_cursor.y",
      "#define u_cursorStrength u_cursor.z",
      "#define u_cursorRadius u_cursor.w",
      "float hash21(vec2 p){",
      "#ifndef GL_FRAGMENT_PRECISION_HIGH",
      "  p = mod(p, 31.0);",
      "#endif",
      "  p = fract(p * vec2(234.34, 435.345));",
      "  p += dot(p, p + 34.23);",
      "  return fract(p.x * p.y);",
      "}",
      "float grainHash(vec2 p){",
      "  vec3 p3 = fract(vec3(p.xyx) * 0.1031);",
      "  p3 += dot(p3, p3.yzx + 33.33);",
      "  return fract((p3.x + p3.y) * p3.z);",
      "}",
      "vec2 hash22(vec2 p){",
      "#ifndef GL_FRAGMENT_PRECISION_HIGH",
      "  p = mod(p, 31.0);",
      "#endif",
      "  float n = sin(dot(p, vec2(41.0, 289.0)));",
      "  return fract(vec2(15731.743, 7892.321) * n);",
      "}",
      "float noise(vec2 p){",
      "  vec2 i = floor(p);",
      "  vec2 f = fract(p);",
      "  vec2 u = f * f * (3.0 - 2.0 * f);",
      "  return mix(mix(hash21(i), hash21(i + vec2(1.0,0.0)), u.x),",
      "             mix(hash21(i + vec2(0.0,1.0)), hash21(i + vec2(1.0,1.0)), u.x), u.y);",
      "}",
      "float fbm(vec2 p){",
      "  float v = 0.0; float a = 0.5;",
      "  for (int i = 0; i < 5; i++){",
      "    v += a * noise(p);",
      "    p = p * 2.03 + vec2(17.0, 9.2);",
      "    a *= 0.5;",
      "  }",
      "  return v;",
      "}",
      "vec3 srgbToLinear(vec3 c){",
      "  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));",
      "}",
      "vec3 linearToSrgb(vec3 c){",
      "  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0/2.4)) - 0.055, step(0.0031308, c));",
      "}",
      "vec3 linToOklab(vec3 c){",
      "  float l = 0.4122214708*c.r + 0.5363325363*c.g + 0.0514459929*c.b;",
      "  float m = 0.2119034982*c.r + 0.6806995451*c.g + 0.1073969566*c.b;",
      "  float s = 0.0883024619*c.r + 0.2817188376*c.g + 0.6299787005*c.b;",
      "  l = pow(max(l,0.0), 1.0/3.0); m = pow(max(m,0.0), 1.0/3.0); s = pow(max(s,0.0), 1.0/3.0);",
      "  return vec3(0.2104542553*l + 0.7936177850*m - 0.0040720468*s,",
      "              1.9779984951*l - 2.4285922050*m + 0.4505937099*s,",
      "              0.0259040371*l + 0.7827717662*m - 0.8086757660*s);",
      "}",
      "vec3 oklabToLin(vec3 c){",
      "  float l = c.x + 0.3963377774*c.y + 0.2158037573*c.z;",
      "  float m = c.x - 0.1055613458*c.y - 0.0638541728*c.z;",
      "  float s = c.x - 0.0894841775*c.y - 1.2914855480*c.z;",
      "  l = l*l*l; m = m*m*m; s = s*s*s;",
      "  return vec3(4.0767416621*l - 3.3077115913*m + 0.2309699292*s,",
      "              -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,",
      "              -0.0041960863*l - 0.7034186147*m + 1.7076147010*s);",
      "}",
      "vec3 mixColour(vec3 a, vec3 b, float t){",
      "  if (u_oklab > 0.5){",
      "    vec3 la = linToOklab(srgbToLinear(a));",
      "    vec3 lb = linToOklab(srgbToLinear(b));",
      "    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);",
      "  }",
      "  return mix(a, b, t);",
      "}",
      "vec3 palette(float x){",
      "  float n = max(u_colorCount - 1.0, 1.0);",
      "  float f = clamp(x, 0.0, 1.0) * n;",
      "  vec3 col = u_colors[0];",
      "  for (int i = 0; i < 7; i++){",
      "    if (float(i) < n)",
      "      col = mixColour(col, u_colors[i + 1], smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));",
      "  }",
      "  return col;",
      "}",
      "vec3 hueRotate(vec3 col, float a){",
      "  const mat3 toYIQ = mat3(0.299,0.596,0.211, 0.587,-0.274,-0.523, 0.114,-0.322,0.312);",
      "  const mat3 toRGB = mat3(1.0,1.0,1.0, 0.956,-0.272,-1.106, 0.621,-0.647,1.703);",
      "  vec3 yiq = toYIQ * col;",
      "  float ca = cos(a), sa = sin(a);",
      "  yiq = vec3(yiq.x, yiq.y*ca - yiq.z*sa, yiq.y*sa + yiq.z*ca);",
      "  return toRGB * yiq;",
      "}",
      "vec3 shade(vec2 uv, vec2 p, float t){",
      "  float y = uv.y",
      "    + sin(uv.x * (3.0 + u_intensity * 9.0) + t * 0.8) * 0.08",
      "    + (fbm(p * 2.0 + t * 0.1) - 0.5) * u_intensity * 0.6;",
      "  return palette(y);",
      "}",
      "void main(){",
      "  vec2 uv = gl_FragCoord.xy / u_resolution.xy;",
      "  vec2 screenUv = uv;",
      "  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);",
      "  float cursorMask = 0.0;",
      "  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;",
      "  p *= u_scale;",
      "  if (abs(u_rotate) > 0.0001){",
      "    float cr = cos(u_rotate), sr = sin(u_rotate);",
      "    p = mat2(cr, -sr, sr, cr) * p;",
      "  }",
      "  p += u_offset;",
      "  if (u_drift > 0.0001) p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));",
      "  if (u_warp > 0.0){",
      "    p += u_warp * (vec2(fbm(p * u_detail + u_seed), fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);",
      "  }",
      "  vec3 col;",
      "  if (u_blur > 0.0){",
      "    float e = u_blur;",
      "    float pe = e * u_scale;",
      "    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;",
      "    col  = shade(uv, p, u_time) * 0.36;",
      "    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;",
      "    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;",
      "    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;",
      "    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;",
      "  } else {",
      "    col = shade(uv, p, u_time);",
      "  }",
      "  if (abs(u_contrast - 1.0) > 0.0001) col = (col - 0.5) * u_contrast + 0.5;",
      "  if (abs(u_saturation - 1.0) > 0.0001){",
      "    float luma = dot(col, vec3(0.299, 0.587, 0.114));",
      "    col = mix(vec3(luma), col, u_saturation);",
      "  }",
      "  if (abs(u_hue) > 0.0001) col = hueRotate(col, u_hue);",
      "  if (abs(u_brightness) > 0.0001) col += u_brightness;",
      "  if (u_vignette > 0.0001){",
      "    float vd = length(screenUv - 0.5) * 1.41421356;",
      "    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);",
      "  }",
      "  if (u_grain > 0.0001)",
      "    col += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;",
      "  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);",
      "}"
    ].join("\n");

    var U = {
      colors: [
        [0.10196078431372549, 0.0784313725490196, 0.13725490196078433],
        [0.7176470588235294, 0.36470588235294116, 0.4117647058823529],
        [0.9176470588235294, 0.803921568627451, 0.7607843137254902],
        [1, 0.9607843137254902, 0.9215686274509803],
        [1, 0.9607843137254902, 0.9215686274509803],
        [1, 0.9607843137254902, 0.9215686274509803],
        [1, 0.9607843137254902, 0.9215686274509803],
        [1, 0.9607843137254902, 0.9215686274509803]
      ],
      colorCount: 4, scale: 1.320, intensity: 0.490, paramA: 0.840, warp: 0.006,
      detail: 1.728, contrast: 1.077, brightness: 0.070, saturation: 2.000,
      hue: 2.2689, vignette: 0.000, blur: 0.0400, grain: 0.050, seed: 4984.0,
      rotate: 3.3685, offsetX: -0.130, offsetY: 0.050, drift: 0.400,
      oklab: 1.0, timeScale: -0.670
    };
    if (canvas.classList.contains("site-footer__bg")) {
      U.colors = [
        [0.1411764705882353, 0.3607843137254902, 1],
        [0.43529411764705883, 0.6588235294117647, 1],
        [0.1411764705882353, 0.4196078431372549, 1],
        [0.7215686274509804, 0.7803921568627451, 1],
        [0.9529411764705882, 0.9058823529411765, 0.7686274509803922],
        [1, 0.9686274509803922, 0.9372549019607843],
        [1, 0.9686274509803922, 0.9372549019607843],
        [1, 0.9686274509803922, 0.9372549019607843]
      ];
      U.colorCount = 6;
      U.hue = 0;
      U.brightness = 0.025;
      U.saturation = 1.35;
      U.contrast = 1.04;
      U.offsetY = -0.08;
    }

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    var program = gl.createProgram();
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uni = {
      colors: gl.getUniformLocation(program, "u_colors"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
      space: gl.getUniformLocation(program, "u_space"),
      cursor: gl.getUniformLocation(program, "u_cursor")
    };
    gl.uniform3fv(uni.colors, new Float32Array([].concat.apply([], U.colors)));
    gl.uniform4f(uni.shape, U.scale, U.intensity, U.paramA, U.warp);
    gl.uniform4f(uni.surface, U.detail, U.contrast, U.brightness, U.saturation);
    gl.uniform4f(uni.finish, U.hue, U.vignette, U.blur, U.grain);
    gl.uniform4f(uni.transform, U.seed, U.rotate, U.drift, U.oklab);
    gl.uniform4f(uni.cursor, 0, U.cursorEffect || 0, U.cursorStrength || 0, U.cursorRadius || 0);

    var raf = 0, start = performance.now(), disposed = false;
    var visible = document.visibilityState === "visible", inView = !("IntersectionObserver" in window);
    var timeAnimated = Math.abs(U.timeScale) > 0.0001;
    var frameListeners = [];
    var externalUsers = 0;

    function isActive() {
      if (document.documentElement.hasAttribute("data-drawer-open")) return false;
      return inView || externalUsers > 0;
    }

    function subscribe(listener) {
      frameListeners.push(listener);
      var removed = false;
      return function () {
        if (removed) return;
        removed = true;
        frameListeners = frameListeners.filter(function (item) {
          return item !== listener;
        });
      };
    }

    function retain() {
      externalUsers += 1;
      requestRender();
      var released = false;
      return function () {
        if (released) return;
        released = true;
        externalUsers = Math.max(0, externalUsers - 1);
      };
    }

    function resizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rawW = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var rawH = Math.max(1, Math.round(canvas.clientHeight * dpr));
      /* Both shaders are soft, low-frequency gradients stretched to full bleed,
         so they carry no detail that survives a 1:1 buffer. Rendering at ~0.9
         Mpx and letting the browser scale up is indistinguishable and cuts the
         fill rate — and the area the compositor has to re-blend under the nav —
         by roughly half. */
      var pixelScale = Math.min(1, Math.sqrt(900000 / Math.max(1, rawW * rawH)));
      var w = Math.max(1, Math.round(rawW * pixelScale));
      var h = Math.max(1, Math.round(rawH * pixelScale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    function requestRender() {
      if (!disposed && visible && isActive() && raf === 0) raf = requestAnimationFrame(render);
    }
    function drawFrame(now) {
      gl.uniform4f(uni.scene, canvas.width, canvas.height, ((now - start) / 1000) * U.timeScale, U.colorCount);
      gl.uniform4f(uni.space, U.offsetX, U.offsetY, 0, 0);
      gl.uniform4f(uni.cursor, 0, U.cursorEffect || 0, U.cursorStrength || 0, U.cursorRadius || 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frameListeners.slice().forEach(function (listener) {
        listener(canvas, now);
      });
    }
    function render(now) {
      raf = 0;
      if (disposed) return;
      drawFrame(now);
      if (timeAnimated && visible && isActive()) requestRender();
    }

    var ro = new ResizeObserver(function () { resizeCanvas(); requestRender(); });
    ro.observe(canvas);
    var io = new IntersectionObserver(function (entries) {
      inView = entries[0] ? entries[0].isIntersecting : true;
      if (isActive()) requestRender();
      else if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", function () {
      visible = document.visibilityState === "visible";
      if (visible) requestRender();
      else if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    });
    window.addEventListener("resize", function () { resizeCanvas(); if (isActive()) requestRender(); });

    if (exposeSharedShader) {
      window.__heillerHeroShader = {
        subscribe: subscribe,
        retain: retain,
        requestFrame: requestRender
      };
    }

    resizeCanvas();
    drawFrame(performance.now()); // paint at least one frame even if the tab starts hidden
    if (isActive()) requestRender();
    });
  })();

  // Gradient text masks: copy the live hero shader into real text
  // glyphs. The DOM copy stays visible until the first successful
  // paint, so WebGL or Canvas failures remain readable.
  (function () {
    var hero = window.__heillerHeroShader;
    if (!hero) return;

    function mountGradientText(config) {
      var root = document.querySelector(config.root);
      var text = root && root.querySelector(config.text);
      var lines = text && Array.prototype.slice.call(
        text.querySelectorAll(config.lines)
      );
      var output = text && text.querySelector(config.output);
      var g = output && output.getContext("2d");
      if (!root || !text || !lines.length || !output || !g) return;

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var reduced = window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var releaseHero = null;
      var unsubscribe = null;
      var observer = null;
      var metrics = null;
      var metricsDirty = true;
      /* Sampling the shader means pulling pixels back off the GPU, which stalls
         the pipeline. Two rules keep that off the hot path: never sample while
         the headline is off screen, and once on screen take a few frames and
         stop. The hero drifts slowly enough that a held sample is indistinct
         from a live one, and this is what reduced-motion already did. */
      var onScreen = false;
      var framesWanted = 0;

      function measure() {
        var rect = text.getBoundingClientRect();
        var width = Math.max(1, Math.round(rect.width));
        var height = Math.max(1, Math.round(rect.height));
        var style = window.getComputedStyle(text);
        var pixelWidth = Math.round(width * dpr);
        var pixelHeight = Math.round(height * dpr);
        if (output.width !== pixelWidth) output.width = pixelWidth;
        if (output.height !== pixelHeight) output.height = pixelHeight;
        metrics = {
          width: width,
          height: height,
          font: [style.fontWeight, style.fontSize, style.fontFamily].join(" "),
          letterSpacing: style.letterSpacing,
          align: style.textAlign,
          lines: lines.map(function (line) {
            var lineRect = line.getBoundingClientRect();
            return {
              text: line.textContent,
              x: lineRect.left - rect.left,
              y: lineRect.top - rect.top,
              width: lineRect.width
            };
          })
        };
        metricsDirty = false;
      }

      function paint(source) {
        if (!onScreen || framesWanted <= 0) return;
        framesWanted -= 1;
        if (metricsDirty || !metrics) measure();
        var width = metrics.width;
        var height = metrics.height;

        try {
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.globalCompositeOperation = "source-over";
          g.clearRect(0, 0, width, height);

          g.fillStyle = "#000";
          g.font = metrics.font;
          g.textBaseline = "top";
          if ("letterSpacing" in g) g.letterSpacing = metrics.letterSpacing;
          metrics.lines.forEach(function (line) {
            g.textAlign = metrics.align === "center" ? "center" : "left";
            g.fillText(
              line.text,
              metrics.align === "center" ? line.x + line.width / 2 : line.x,
              line.y
            );
          });

          var scale = Math.max(width / source.width, height / source.height);
          var sourceWidth = width / scale;
          var sourceHeight = height / scale;
          var sourceX = (source.width - sourceWidth) * 0.5;
          var sourceY = (source.height - sourceHeight) * 0.5;
          g.globalCompositeOperation = "source-in";
          g.save();
          g.translate(0, height);
          g.scale(1, -1);
          g.drawImage(
            source,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, width, height
          );
          g.restore();
          if (config.contrastGradient && config.contrastGradient.length) {
            var contrast = g.createLinearGradient(0, 0, 0, height);
            config.contrastGradient.forEach(function (stop) {
              contrast.addColorStop(stop.offset, stop.color);
            });
            g.globalCompositeOperation = "source-atop";
            g.fillStyle = contrast;
            g.fillRect(0, 0, width, height);
          }
          g.globalCompositeOperation = "source-over";
          root.classList.add(config.readyClass);
        } catch (error) {
          root.classList.remove(config.readyClass);
          return;
        }

        if (reduced) {
          if (releaseHero) { releaseHero(); releaseHero = null; }
          if (unsubscribe) { unsubscribe(); unsubscribe = null; }
          if (observer) observer.disconnect();
          return;
        }
        /* Sampled enough: let the hero go idle again. Holding it retained kept
           a full-size off-screen shader running at 60fps. */
        if (framesWanted <= 0 && releaseHero) { releaseHero(); releaseHero = null; }
      }

      unsubscribe = hero.subscribe(paint);
      observer = new IntersectionObserver(function (entries) {
        onScreen = entries[0] ? entries[0].isIntersecting : true;
        if (onScreen) {
          framesWanted = 3;
          if (!releaseHero) releaseHero = hero.retain();
          hero.requestFrame();
        } else {
          framesWanted = 0;
          if (releaseHero) { releaseHero(); releaseHero = null; }
        }
      }, { threshold: 0 });
      observer.observe(text);

      function invalidate() {
        metricsDirty = true;
        /* A resize or a font swap invalidates the held sample, so take it again. */
        if (onScreen) {
          framesWanted = 3;
          if (!releaseHero) releaseHero = hero.retain();
        }
        hero.requestFrame();
      }
      window.addEventListener("resize", invalidate);
      var resizeObserver = new ResizeObserver(invalidate);
      resizeObserver.observe(text);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(invalidate);
      }
    }

    mountGradientText({
      root: ".dedicated-team",
      text: "#dedicated-team-title",
      lines: ".dedicated-team__title-line",
      output: ".dedicated-team__title-gl",
      readyClass: "dedicated-team--title-shader",
      contrastGradient: [
        { offset: 0, color: "rgba(54, 119, 255, 0.18)" },
        { offset: 0.48, color: "rgba(86, 111, 255, 0.34)" },
        { offset: 0.72, color: "rgba(118, 104, 238, 0.5)" },
        { offset: 1, color: "rgba(236, 172, 54, 0.62)" }
      ]
    });
  })();

// ── block 3 ─────────────────────────────────────────
(function () {
    var audit = document.querySelector(".audit");
    if (!audit) return;

    var inner = audit.querySelector(".future-section__inner");
    var ledger = audit.querySelector(".audit__ledger");
    // The whole head block, not just the h2: below 960 the intro copy
    // stacks under the heading, and measuring the h2 alone would start
    // the route partway through that paragraph.
    var heading = audit.querySelector(".audit__head");
    var rows = Array.prototype.slice.call(audit.querySelectorAll(".audit__row"));
    var cta = audit.querySelector(".audit__cta");
    var calendarFrame = document.querySelector(".booking-calendar__frame");
    var svg = audit.querySelector(".audit__flow");
    var track = audit.querySelector(".audit__track");
    var route = audit.querySelector(".audit__route");
    var arrow = audit.querySelector(".audit__arrow");
    var fadeGradient = audit.querySelector("#audit-entry-fade-grad");
    var fadeMask = audit.querySelector("#audit-entry-mask");
    var fadeRect = audit.querySelector(".audit__fade-rect");
    if (!inner || !ledger || !rows.length || !cta || !svg || !track || !route || !fadeGradient || !fadeMask || !fadeRect) return;

    var reducedMotion = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var visible = true;
    var frame = 0;
    var targetProgress = reducedMotion ? 1 : 0;
    var currentProgress = targetProgress;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function smoothProgress(current, target) {
      if (Math.abs(target - current) < 0.001) return target;
      return current + (target - current) * 0.16;
    }

    function getAuditProgress() {
      var box = audit.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      var start = viewportHeight * 0.72;
      var end = viewportHeight * 0.42;
      return clamp((start - box.top) / Math.max(1, box.bottom - box.top - end + start), 0, 1);
    }

    function paint(progress) {
      var clamped = clamp(progress, 0, 1);
      route.style.strokeDashoffset = String(1 - clamped);
      audit.style.setProperty("--audit-cta-progress", clamp((clamped - 0.94) / 0.06, 0, 1).toFixed(4));
      if (arrow) arrow.style.opacity = String(clamp((clamped - 0.92) / 0.08, 0, 1));
      audit.classList.toggle("is-drawn", clamped > 0.002);
    }

    // Build a rounded polyline through a list of [x, y] points.
    function rounded(pts, r) {
      if (pts.length < 2) return "";
      var d = "M " + pts[0][0] + " " + pts[0][1];
      for (var i = 1; i < pts.length - 1; i++) {
        var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
        var v1x = p1[0] - p0[0], v1y = p1[1] - p0[1];
        var l1 = Math.hypot(v1x, v1y) || 1;
        var v2x = p2[0] - p1[0], v2y = p2[1] - p1[1];
        var l2 = Math.hypot(v2x, v2y) || 1;
        var rr = Math.min(r, l1 / 2, l2 / 2);
        var ax = p1[0] - (v1x / l1) * rr, ay = p1[1] - (v1y / l1) * rr;
        var bx = p1[0] + (v2x / l2) * rr, by = p1[1] + (v2y / l2) * rr;
        d += " L " + ax + " " + ay + " Q " + p1[0] + " " + p1[1] + " " + bx + " " + by;
      }
      var last = pts[pts.length - 1];
      d += " L " + last[0] + " " + last[1];
      return d;
    }

    function build() {
      var ib = inner.getBoundingClientRect();
      var lb = ledger.getBoundingClientRect();
      var hb = heading.getBoundingClientRect();
      var cb = cta.getBoundingClientRect();
      var fb = calendarFrame ? calendarFrame.getBoundingClientRect() : null;
      var W = ib.width;

      var xL = (lb.left - ib.left) + 4.5;         // port column, left rail
      var xR = (lb.right - ib.left) - 5;          // right rail
      var leftIndex = rows[0].querySelector(".audit__index");
      var rightIndex = rows[1].querySelector(".audit__index");
      if (window.innerWidth > 640 && leftIndex && rightIndex) {
        var leftIndexBox = leftIndex.getBoundingClientRect();
        var rightIndexBox = rightIndex.getBoundingClientRect();
        var leftIndexCenter = (leftIndexBox.left + leftIndexBox.width / 2) - ib.left;
        var rightIndexCenter = (rightIndexBox.left + rightIndexBox.width / 2) - ib.left;
        // At stacked widths every index occupies the left column. Only
        // replace the fallbacks when a real left/right pair is present.
        if (rightIndexCenter - leftIndexCenter > 120) {
          xL = leftIndexCenter;
          xR = rightIndexCenter;
        }
      }
      var startX = (hb.left + hb.width / 2) - ib.left;
      var startY = (hb.bottom - ib.top) + 20;     // just under the head block
      var fadeDistance = window.innerWidth <= 640 ? 72 : 100;
      var ys = rows.map(function (r) {
        return r.getBoundingClientRect().top - ib.top;
      });
      var yBottom = lb.bottom - ib.top;
      var desktopCalendarTarget = window.innerWidth > 960 && fb;
      var bx = desktopCalendarTarget
        ? (fb.left + fb.width / 2) - ib.left
        : (cb.left + cb.width / 2) - ib.left;
      // Desktop lands directly on the calendar edge; mobile still lands
      // just above the CTA.
      var byTop = desktopCalendarTarget
        ? fb.top - ib.top
        : (cb.top - ib.top) - 12;
      var H = Math.max(ib.height, byTop + 24);

      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("width", W);
      svg.setAttribute("height", H);
      fadeGradient.setAttribute("y1", startY);
      fadeGradient.setAttribute("y2", startY + fadeDistance);
      fadeMask.setAttribute("x", 0);
      fadeMask.setAttribute("y", 0);
      fadeMask.setAttribute("width", W);
      fadeMask.setAttribute("height", H);
      fadeRect.setAttribute("width", W);
      fadeRect.setAttribute("height", H);

      // Boustrophedon: down from the heading, then weave each divider
      // right/left, and drop into the button on the last pass.
      var pts = [
        [startX, startY],
        [startX, ys[0]], [xR, ys[0]],
        [xR, ys[1]], [xL, ys[1]],
        [xL, ys[2]], [xR, ys[2]],
        [xR, ys[3]], [xL, ys[3]],
        [xL, yBottom], [bx, yBottom],
        [bx, byTop]
      ];
      var d = rounded(pts, 30);
      track.setAttribute("d", d);
      route.setAttribute("d", d);
      route.setAttribute("pathLength", "1");
      route.style.strokeDasharray = "1";

      // Desktop connects directly into the calendar, without an
      // arrowhead. Mobile keeps the chevron that lands above the CTA.
      arrow.setAttribute("d", desktopCalendarTarget ? "" :
        "M " + (bx - 6.5) + " " + (byTop - 8) +
        " L " + bx + " " + byTop +
        " L " + (bx + 6.5) + " " + (byTop - 8));

      ledger.classList.add("is-flow");
    }

    function render() {
      frame = 0;
      if (!visible || document.hidden) return;
      currentProgress = reducedMotion ? 1 : smoothProgress(currentProgress, targetProgress);
      paint(currentProgress);
      if (!reducedMotion && Math.abs(targetProgress - currentProgress) >= 0.001) {
        frame = requestAnimationFrame(render);
      }
    }

    function sampleProgress() {
      if (!visible || document.hidden) return;
      targetProgress = reducedMotion ? 1 : getAuditProgress();
      if (!frame) frame = requestAnimationFrame(render);
    }

    function schedule() {
      sampleProgress();
    }

    build();
    schedule();
    // Fonts landing can shift divider positions; rebuild once settled.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { build(); schedule(); });
    }
    window.addEventListener("load", function () { build(); schedule(); });

    var raf;
    window.addEventListener("resize", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { build(); schedule(); });
    }, { passive: true });

    if ("ResizeObserver" in window) {
      var resizeObserver = new ResizeObserver(function () { build(); schedule(); });
      resizeObserver.observe(inner);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        visible = Boolean(entries[0] && entries[0].isIntersecting);
        schedule();
      });
      observer.observe(audit);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
  })();

// ── block 7 ─────────────────────────────────────────
/* Hero headline: the last word cycles through the revenue-cycle stages.
   The slot is sized to the widest variant so the centred line never shifts,
   and each character swaps on a short stagger with a blur/rise. Absent on
   pages without a hero headline, where this simply no-ops. */
(function () {
  var slot = document.querySelector("[data-hero-morph]");
  if (!slot) return;

  var track = slot.querySelector(".hero__morph-track");
  if (!track) return;

  var words = (slot.getAttribute("data-words") || "")
    .split("|")
    .map(function (w) { return w.trim(); })
    .filter(Boolean);
  if (words.length < 2) return;

  var CHAR_STAGGER = 30;   // ms between characters
  var CHAR_DURATION = 300; // ms per character
  var HOLD = 2500;         // ms a word stays put

  var index = 0;
  var timer = 0;
  var reduced = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reserve the widest word so shorter ones leave space on the right rather
     than pulling the rest of the sentence across. Measured against the real
     rendered type, so it survives the font swap and every breakpoint. */
  function measure() {
    var probe = document.createElement("span");
    var cs = window.getComputedStyle(track);
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0";
    probe.style.font = cs.font;
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontSize = cs.fontSize;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.letterSpacing = cs.letterSpacing;
    document.body.appendChild(probe);

    var widest = 0;
    words.forEach(function (word) {
      probe.textContent = word;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    });
    document.body.removeChild(probe);
    if (widest > 0) slot.style.setProperty("--hero-morph-w", Math.ceil(widest) + "px");
  }

  function render(word, animate) {
    track.textContent = "";
    Array.prototype.forEach.call(word, function (ch, i) {
      var span = document.createElement("span");
      span.className = "hero__morph-char" + (animate ? " hero__morph-char--in" : "");
      span.textContent = ch;
      if (animate) span.style.animationDelay = i * CHAR_STAGGER + "ms";
      track.appendChild(span);
    });
  }

  function swap() {
    var chars = Array.prototype.slice.call(track.children);
    chars.forEach(function (span, i) {
      span.className = "hero__morph-char hero__morph-char--out";
      span.style.animationDelay = i * CHAR_STAGGER + "ms";
    });
    var outFor = CHAR_DURATION + chars.length * CHAR_STAGGER;
    window.setTimeout(function () {
      index = (index + 1) % words.length;
      render(words[index], true);
    }, outFor);
  }

  function start() {
    if (timer) return;
    timer = window.setInterval(swap, HOLD);
  }
  function stop() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = 0;
  }

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener("resize", measure);

  render(words[0], false);
  if (reduced) return; // hold the first word; the slot is still reserved

  // Only cycle while the headline is actually on screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0] && entries[0].isIntersecting) start(); else stop();
    }, { threshold: 0 }).observe(slot);
  } else {
    start();
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (slot.getBoundingClientRect().bottom > 0) start();
  });
})();

// ── nav scroll state ────────────────────────────────
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;
  function sync() {
    if (window.scrollY > 40) nav.setAttribute("data-scrolled", "");
    else nav.removeAttribute("data-scrolled");
  }
  window.addEventListener("scroll", sync, { passive: true });
  sync();
})();

// ── block: faq ──────────────────────────────────────────────
/* Smooth open/close for the FAQ. <details> swaps its content between rendered
   and display: none, so CSS alone has nothing to transition; the panel height
   is animated instead, and the element is only closed once the collapse has
   finished playing. */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  if (!items.length) return;

  var DURATION = 300;
  var EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animatable = typeof Element.prototype.animate === "function";
  var openCount = 0;

  /* Growing a panel moves everything below it, and the browser's scroll
     anchoring answers that by scrolling the page to keep some other element
     put — so the whole page appears to slide. Suspend anchoring for the length
     of the animation: the answer expands in place and the viewport holds. */
  function holdViewport() {
    openCount += 1;
    document.documentElement.style.overflowAnchor = "none";
  }
  function releaseViewport() {
    openCount = Math.max(0, openCount - 1);
    if (openCount === 0) document.documentElement.style.overflowAnchor = "";
  }

  var openItem = null;

  items.forEach(function (item) {
    var summary = item.querySelector("summary");
    var panel = item.querySelector("p");
    if (!summary || !panel) return;

    var animation = null;

    summary.addEventListener("click", function (event) {
      if (reduced || !animatable) {
        /* Still one at a time when the animation is skipped. */
        if (!item.open && openItem && openItem !== item) openItem.open = false;
        openItem = item.open ? null : item;
        return;
      }
      event.preventDefault();

      if (animation) animation.cancel();
      item.removeAttribute("data-collapsing");
      holdViewport();

      if (!item.open) {
        /* One answer at a time: the open one collapses as this one expands. */
        if (openItem && openItem !== item) openItem.collapse();
        openItem = item;
        item.open = true;
        var height = panel.scrollHeight;
        animation = panel.animate(
          { height: ["0px", height + "px"], opacity: [0, 1] },
          { duration: DURATION, easing: EASING }
        );
        animation.onfinish = releaseViewport;
      } else {
        item.setAttribute("data-collapsing", "");
        animation = panel.animate(
          { height: [panel.getBoundingClientRect().height + "px", "0px"], opacity: [1, 0] },
          { duration: DURATION, easing: EASING }
        );
        if (openItem === item) openItem = null;
        animation.onfinish = function () {
          item.open = false;
          item.removeAttribute("data-collapsing");
          releaseViewport();
        };
      }

      animation.oncancel = function () {
        item.removeAttribute("data-collapsing");
        releaseViewport();
      };
    });

    /* Play this item's collapse from wherever it currently stands, so a click
       on another question closes it with the same motion as clicking it. */
    item.collapse = function () {
      if (!item.open) return;
      if (animation) animation.cancel();
      holdViewport();
      item.setAttribute("data-collapsing", "");
      animation = panel.animate(
        { height: [panel.getBoundingClientRect().height + "px", "0px"], opacity: [1, 0] },
        { duration: DURATION, easing: EASING }
      );
      animation.onfinish = function () {
        item.open = false;
        item.removeAttribute("data-collapsing");
        releaseViewport();
      };
      animation.oncancel = function () {
        item.removeAttribute("data-collapsing");
        releaseViewport();
      };
    };
  });
})();

// ── block: mobile nav menu ──────────────────────────────────────────────────
/* Below 960px the bar carries the brand and a toggle; the links and the CTA
   live in a sheet that drops from under it. All of the motion is CSS — this
   only owns the open/closed state and the ways out of it. */
(function () {
  var nav = document.querySelector(".nav");
  var toggle = nav && nav.querySelector("[data-nav-toggle]");
  var menu = nav && nav.querySelector("[data-nav-menu]");
  if (!nav || !toggle || !menu) return;

  function isOpen() {
    return nav.hasAttribute("data-menu-open");
  }

  /* The sheet covers the top of the screen, so the browser UI above it should
     match. The tag only exists while the menu is open, which leaves the normal
     status bar colour alone the rest of the time. */
  var themeMeta = null;
  function setThemeColor(open) {
    if (open && !themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.setAttribute("name", "theme-color");
      themeMeta.setAttribute("content", "#FFFFFF");
      document.head.appendChild(themeMeta);
    } else if (!open && themeMeta) {
      themeMeta.remove();
      themeMeta = null;
    }
  }

  function setOpen(open) {
    if (open === isOpen()) return;
    if (open) { openedAt = window.scrollY; nav.setAttribute("data-menu-open", ""); }
    else nav.removeAttribute("data-menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    setThemeColor(open);
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  /* Anything that takes the reader somewhere closes the sheet, including the
     Specialties link — the drawer controller handles opening the drawer, this
     just gets the menu out of its way. */
  menu.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (!isOpen()) return;
    if (nav.contains(event.target)) return;
    setOpen(false);
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Leaving the breakpoint hides the sheet in CSS, so the state has to follow
     or the toggle comes back out of sync. */
  var wide = window.matchMedia("(min-width: 961px)");
  var onWide = function (event) { if (event.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else wide.addListener(onWide);

  /* Close on a real scroll only. A bare scroll event is not enough: layout
     settling fires zero-delta ones, and on mobile so does the address bar
     showing and hiding. */
  var openedAt = 0;
  window.addEventListener("scroll", function () {
    if (!isOpen()) return;
    if (Math.abs(window.scrollY - openedAt) < 24) return;
    setOpen(false);
  }, { passive: true });
})();
