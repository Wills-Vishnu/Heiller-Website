const TAU = Math.PI * 2
const PILL_COUNT = 9
const START_ANGLE = -(Math.PI * 3) / 8
const MAX_SCROLL_VELOCITY = 2400
const SETTLE_TIME_CONSTANT_SECONDS = 0.1
const COMPACT_RADIUS_X = 0.324

export const MAX_ANGULAR_VELOCITY = 5.76
export const MAX_MOBILE_ORBIT_BLUR_PX = 2.5
export const IDLE_ORBIT_DURATION_SECONDS = 28
export const IDLE_ANGULAR_VELOCITY = TAU / IDLE_ORBIT_DURATION_SECONDS

export type OrbitTransform = {
  x: number
  y: number
}

export function getOrbitTransform(
  index: number,
  angle: number,
  width: number,
  height: number,
  compact: boolean,
): OrbitTransform {
  const normalizedIndex = ((index % PILL_COUNT) + PILL_COUNT) % PILL_COUNT
  const phase = START_ANGLE + angle + (normalizedIndex / PILL_COUNT) * TAU
  const radiusX = width * (compact ? COMPACT_RADIUS_X : 0.35)
  const radiusY = height * (compact ? 0.36 : 0.324)

  return {
    x: Math.cos(phase) * radiusX,
    y: Math.sin(phase) * radiusY,
  }
}

export function getOrbitDepth(x: number): 1 | 4 {
  return x < 0 ? 1 : 4
}

export function getOrbitBlur(
  x: number,
  width: number,
  mobile: boolean,
  reducedMotion: boolean,
): number {
  if (!mobile || reducedMotion || x >= 0 || width <= 0) return 0

  const rearDepth = Math.max(0, Math.min(1, -x / (width * COMPACT_RADIUS_X)))
  const easedDepth = rearDepth * rearDepth * (3 - 2 * rearDepth)
  return easedDepth * MAX_MOBILE_ORBIT_BLUR_PX
}

export function getTargetAngularVelocity(scrollVelocity: number): number {
  const clamped = Math.max(-MAX_SCROLL_VELOCITY, Math.min(MAX_SCROLL_VELOCITY, scrollVelocity))
  return (clamped / MAX_SCROLL_VELOCITY) * MAX_ANGULAR_VELOCITY
}

export function dampAngularVelocity(current: number, target: number, deltaSeconds: number): number {
  const safeDelta = Math.max(0, deltaSeconds)
  const blend = 1 - Math.exp(-safeDelta / SETTLE_TIME_CONSTANT_SECONDS)
  return current + (target - current) * blend
}

function initDedicatedTeamOrbit(): void {
  const field = document.querySelector<HTMLElement>("[data-dedicated-field]")
  const pills = field
    ? Array.from(field.querySelectorAll<HTMLElement>("[data-dedicated-pill]"))
    : []

  if (!field || pills.length === 0) return

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  let reducedMotion = reducedMotionQuery.matches
  let bounds = field.getBoundingClientRect()
  let orbitAngle = 0
  let angularVelocity = 0
  let sampledScrollVelocity = 0
  let lastScrollSample = 0
  let lastScrollY = window.scrollY
  let lastScrollTime = performance.now()
  let lastFrameTime = 0
  let inView = false
  let pageVisible = document.visibilityState === "visible"
  let frame = 0

  /* A drawer covers this section with a translucent overlay, so the orbit keeps
     repainting eight blurred pills for nothing. Idle while one is open. */
  const drawerOpen = (): boolean => document.documentElement.hasAttribute("data-drawer-open")
  const shouldAnimate = (): boolean => pageVisible && inView && !reducedMotion && !drawerOpen()

  const stopOrbit = (): void => {
    if (frame === 0) return
    window.cancelAnimationFrame(frame)
    frame = 0
    lastFrameTime = 0
  }

  const startOrbit = (): void => {
    if (frame !== 0 || !shouldAnimate()) return
    frame = window.requestAnimationFrame(renderOrbit)
  }

  const layoutOrbit = (): void => {
    const compact = bounds.width < 768
    const mobile = window.innerWidth < 768

    pills.forEach((pill, index) => {
      const transform = getOrbitTransform(index, orbitAngle, bounds.width, bounds.height, compact)
      const blur = getOrbitBlur(transform.x, bounds.width, mobile, reducedMotion)

      pill.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) translate(-50%, -50%)`
      pill.style.zIndex = String(getOrbitDepth(transform.x))
      pill.style.filter = blur > 0 ? `blur(${blur}px)` : "none"
    })
  }

  const updateBounds = (): void => {
    bounds = field.getBoundingClientRect()
    layoutOrbit()
  }

  const onScroll = (): void => {
    if (!shouldAnimate()) return
    const now = performance.now()
    const elapsedSeconds = Math.max((now - lastScrollTime) / 1000, 1 / 240)
    sampledScrollVelocity = (window.scrollY - lastScrollY) / elapsedSeconds
    lastScrollY = window.scrollY
    lastScrollTime = now
    lastScrollSample = now
    startOrbit()
  }

  const onVisibilityChange = (): void => {
    pageVisible = document.visibilityState === "visible"
    if (shouldAnimate()) startOrbit()
    else stopOrbit()
  }

  const onReducedMotionChange = (event: MediaQueryListEvent): void => {
    reducedMotion = event.matches
    angularVelocity = 0
    layoutOrbit()
    if (shouldAnimate()) startOrbit()
    else stopOrbit()
  }

  const renderOrbit = (time: number): void => {
    frame = 0
    if (!shouldAnimate()) {
      angularVelocity = 0
      return
    }

    const deltaSeconds = lastFrameTime === 0 ? 0 : Math.min((time - lastFrameTime) / 1000, 0.05)
    lastFrameTime = time

    const freshScrollSample = performance.now() - lastScrollSample <= 80
    const targetVelocity = freshScrollSample
      ? IDLE_ANGULAR_VELOCITY + getTargetAngularVelocity(sampledScrollVelocity)
      : IDLE_ANGULAR_VELOCITY

    angularVelocity = dampAngularVelocity(angularVelocity, targetVelocity, deltaSeconds)
    orbitAngle += angularVelocity * deltaSeconds
    layoutOrbit()

    startOrbit()
  }

  const resizeObserver = new ResizeObserver(updateBounds)
  resizeObserver.observe(field)

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false
    if (shouldAnimate()) startOrbit()
    else stopOrbit()
  }, { rootMargin: "0px" })
  intersectionObserver.observe(field)

  window.addEventListener("scroll", onScroll, { passive: true })
  const onDrawerStateChange = (): void => {
    if (drawerOpen()) stopOrbit()
    else startOrbit()
  }

  document.addEventListener("visibilitychange", onVisibilityChange)
  window.addEventListener("drawerstatechange", onDrawerStateChange)
  reducedMotionQuery.addEventListener("change", onReducedMotionChange)

  layoutOrbit()

  window.addEventListener("pagehide", () => {
    stopOrbit()
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    window.removeEventListener("scroll", onScroll)
    document.removeEventListener("visibilitychange", onVisibilityChange)
    window.removeEventListener("drawerstatechange", onDrawerStateChange)
    reducedMotionQuery.removeEventListener("change", onReducedMotionChange)
  }, { once: true })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDedicatedTeamOrbit, { once: true })
} else {
  initDedicatedTeamOrbit()
}
