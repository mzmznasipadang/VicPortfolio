import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  NormalBlending,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

const STAR_COUNT = 1400;

const palettes = {
  dark: { star: '#ffffff', glow: '#49bce9', ridgeBack: '#272660', ridgeFront: '#9fb4cf', starAlpha: 1 },
  light: { star: '#272660', glow: '#49bce9', ridgeBack: '#c6eafa', ridgeFront: '#7fcdee', starAlpha: 0.55 },
};

const starVertex = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 6.2831);
    gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z);
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vTwinkle * uAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

// Full-screen quad: two noise ridges, a soft glow above them, and (dark mode) the odd shooting star behind them.
const ridgeFragment = /* glsl */ `
  uniform vec2 uResolution;
  uniform vec2 uMeteorHead;
  uniform vec2 uMeteorDir;
  uniform float uMeteorLen;
  uniform float uMeteorAlpha;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec3 uBack;
  uniform vec3 uFront;
  uniform vec3 uGlow;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) { float i = floor(x); float f = fract(x); return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f)); }
  float fbm(float x) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(x); x *= 2.1; a *= 0.5; } return v; }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    float x = vUv.x * aspect;
    // Size ridges for an ~800px-tall hero so a tall phone hero doesn't get giant mountains.
    float k = min(1.0, 800.0 / uResolution.y);
    float back = (0.12 + fbm(x * 1.6 + 3.0 + uPointer.x * 0.15 + uTime * 0.01) * 0.14) * k;
    float front = (0.04 + fbm(x * 2.4 + 11.0 + uPointer.x * 0.35) * 0.09) * k;
    float edge = 1.5 / uResolution.y;

    float glow = exp(-max(vUv.y - back, 0.0) * 9.0 / k) * 0.35 * (0.8 + 0.2 * sin(uTime * 0.4 + x));
    vec4 color = vec4(uGlow, glow * step(back, vUv.y));

    // Shooting star: a tail fading back from a bright head, composited over the sky.
    if (uMeteorAlpha > 0.0) {
      vec2 q = vec2(x, vUv.y) - uMeteorHead;
      float along = dot(q, -uMeteorDir);
      float across = abs(dot(q, vec2(-uMeteorDir.y, uMeteorDir.x)));
      float px = 1.0 / uResolution.y;
      float tail = step(0.0, along) * pow(max(1.0 - along / uMeteorLen, 0.0), 2.0) * smoothstep(1.6 * px, 0.0, across);
      float head = exp(-length(q) / (2.5 * px));
      float m = clamp((tail + head) * uMeteorAlpha, 0.0, 1.0);
      float a = m + color.a * (1.0 - m);
      color = vec4((mix(uGlow, vec3(1.0), 0.75) * m + color.rgb * color.a * (1.0 - m)) / max(a, 0.0001), a);
    }
    float backMask = smoothstep(back + edge, back - edge, vUv.y);
    color = mix(color, vec4(uBack, 1.0), backMask);
    float frontMask = smoothstep(front + edge, front - edge, vUv.y);
    vec3 frontColor = mix(uFront, uBack, vUv.y / max(front, 0.001) * 0.6);
    color = mix(color, vec4(frontColor, 1.0), frontMask);
    gl_FragColor = color;
  }
`;

const quadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/** Mounts the hero scene into `canvas`, sized to `host`. Returns a cleanup function. Throws if WebGL is unavailable. */
export function mountHeroScene(canvas: HTMLCanvasElement, host: HTMLElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true }) // keeps the stars in theme-switch snapshots;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.autoClear = false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stars
  const starScene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 10;
  const positions = new Float32Array(STAR_COUNT * 3);
  const phases = new Float32Array(STAR_COUNT);
  const sizes = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i++) {
    positions.set([(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 24, -Math.random() * 30], i * 3);
    phases[i] = Math.random();
    sizes[i] = 1 + Math.random() * 2.5;
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  starGeometry.setAttribute('aPhase', new BufferAttribute(phases, 1));
  starGeometry.setAttribute('aSize', new BufferAttribute(sizes, 1));
  const starMaterial = new ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() }, uColor: { value: new Color() }, uAlpha: { value: 1 } },
  });
  const stars = new Points(starGeometry, starMaterial);
  starScene.add(stars);

  // Ridges
  const ridgeScene = new Scene();
  const ridgeCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const ridgeGeometry = new PlaneGeometry(2, 2);
  const ridgeMaterial = new ShaderMaterial({
    vertexShader: quadVertex,
    fragmentShader: ridgeFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uResolution: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uPointer: { value: new Vector2() },
      uBack: { value: new Color() },
      uFront: { value: new Color() },
      uGlow: { value: new Color() },
      uMeteorHead: { value: new Vector2() },
      uMeteorDir: { value: new Vector2(1, 0) },
      uMeteorLen: { value: 0.15 },
      uMeteorAlpha: { value: 0 },
    },
  });
  ridgeScene.add(new Mesh(ridgeGeometry, ridgeMaterial));

  // Shooting stars: one at a time, dark mode only, every 6–15s at a random spot and angle.
  // Timed on the loop's clock, so they pause with it (hidden tab, reduced motion, theme switch).
  let dark = false;
  let nextMeteor = 3 + Math.random() * 4;
  let meteor: { start: Vector2; dir: Vector2; travel: number; from: number; duration: number } | undefined;
  function updateMeteor(t: number) {
    const u = ridgeMaterial.uniforms;
    if (!meteor && dark && t >= nextMeteor) {
      const aspect = u.uResolution.value.x / u.uResolution.value.y;
      const angle = ((20 + Math.random() * 15) * Math.PI) / 180;
      const side = Math.random() < 0.5 ? -1 : 1; // falling left or right
      meteor = {
        start: new Vector2((side < 0 ? 0.35 + Math.random() * 0.6 : 0.05 + Math.random() * 0.6) * aspect, 0.6 + Math.random() * 0.32),
        dir: new Vector2(side * Math.cos(angle), -Math.sin(angle)),
        travel: 0.3 + Math.random() * 0.25,
        from: t,
        duration: 0.7 + Math.random() * 0.5,
      };
      u.uMeteorDir.value.copy(meteor.dir);
      u.uMeteorLen.value = 0.1 + Math.random() * 0.1;
    }
    if (!meteor) return;
    const progress = (t - meteor.from) / meteor.duration;
    if (progress >= 1 || !dark) {
      meteor = undefined;
      u.uMeteorAlpha.value = 0;
      nextMeteor = t + 6 + Math.random() * 9;
      return;
    }
    u.uMeteorHead.value.copy(meteor.start).addScaledVector(meteor.dir, progress * meteor.travel);
    u.uMeteorAlpha.value = Math.sin(Math.PI * progress);
  }

  function applyTheme() {
    dark = document.documentElement.classList.contains('dark');
    const p = dark ? palettes.dark : palettes.light;
    if (!dark) ridgeMaterial.uniforms.uMeteorAlpha.value = 0;
    // Additive blending vanishes on white, so light mode draws stars normally.
    starMaterial.blending = p === palettes.dark ? AdditiveBlending : NormalBlending;
    starMaterial.needsUpdate = true;
    starMaterial.uniforms.uColor.value.set(p.star);
    starMaterial.uniforms.uAlpha.value = p.starAlpha;
    ridgeMaterial.uniforms.uBack.value.set(p.ridgeBack);
    ridgeMaterial.uniforms.uFront.value.set(p.ridgeFront);
    ridgeMaterial.uniforms.uGlow.value.set(p.glow);
  }
  applyTheme();
  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Pointer parallax (eased toward the target every frame)
  const target = new Vector2();
  const pointer = new Vector2();
  const onPointer = (e: PointerEvent) => target.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
  window.addEventListener('pointermove', onPointer, { passive: true });

  let frame = 0;
  let running = false;
  let visible = true;
  const start = performance.now();

  function render() {
    const t = (performance.now() - start) / 1000;
    pointer.lerp(target, 0.04);
    camera.position.x = pointer.x * 1.2;
    camera.position.y = -pointer.y * 0.8;
    camera.lookAt(0, 0, -10);
    stars.rotation.z = t * 0.004;
    starMaterial.uniforms.uTime.value = t;
    ridgeMaterial.uniforms.uTime.value = t;
    ridgeMaterial.uniforms.uPointer.value.copy(pointer);
    if (running) updateMeteor(t);
    renderer.clear();
    renderer.render(starScene, camera);
    renderer.render(ridgeScene, ridgeCamera);
  }

  function loop() {
    render();
    frame = requestAnimationFrame(loop);
  }

  function updateRunning() {
    // Hold the loop while a theme switch animates, so the reveal isn't competing with a full-screen redraw every frame.
    const switching = document.documentElement.hasAttribute('data-theme-switch');
    const shouldRun = !reduceMotion && visible && !document.hidden && !switching;
    if (shouldRun && !running) { running = true; frame = requestAnimationFrame(loop); }
    if (!shouldRun && running) { running = false; cancelAnimationFrame(frame); }
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    ridgeMaterial.uniforms.uResolution.value.set(width, height);
    if (!running) render();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateRunning(); });
  visibilityObserver.observe(host);
  document.addEventListener('visibilitychange', updateRunning);
  // When the loop is stopped (reduced motion), redraw the still frame on theme change.
  const themeRender = new MutationObserver(() => { updateRunning(); if (!running) render(); });
  themeRender.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme-switch'] });

  resize();
  updateRunning();

  return () => {
    cancelAnimationFrame(frame);
    themeObserver.disconnect();
    themeRender.disconnect();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', updateRunning);
    starGeometry.dispose();
    starMaterial.dispose();
    ridgeGeometry.dispose();
    ridgeMaterial.dispose();
    renderer.dispose();
  };
}
