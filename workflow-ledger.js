export function buildCenterSpine({ x, startY, endY }) {
  return {
    d: `M ${x} ${startY} L ${x} ${endY}`,
    arrow: `M ${x - 6.5} ${endY - 8} L ${x} ${endY} L ${x + 6.5} ${endY - 8}`,
  }
}

export function buildSerpentineRoute({ x, startY, endY, rowYs, amplitude }) {
  const points = [
    { x, y: startY },
    ...rowYs.map((y, index) => ({ x: x + (index % 2 === 0 ? -amplitude : amplitude), y })),
    { x, y: endY },
  ]
  let d = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const next = points[index]
    const midpointY = (previous.y + next.y) / 2
    d += ` C ${previous.x} ${midpointY} ${next.x} ${midpointY} ${next.x} ${next.y}`
  }
  return {
    d,
    arrow: `M ${x - 6.5} ${endY - 8} L ${x} ${endY} L ${x + 6.5} ${endY - 8}`,
  }
}

export const LEDGER_CTA_GAP = 16

/* Length of the run-in the opening mask uses; the closing mask mirrors it. */
export const LEDGER_FADE = 64

export function smoothProgress(current, target, easing = 0.16) {
  if (Math.abs(target - current) < 0.001) return target
  return current + (target - current) * easing
}

export function getLedgerAmplitude(width) {
  return Math.min(32, Math.max(12, width * 0.025))
}

export function getLedgerProgress({ top, bottom, viewportHeight }) {
  const start = viewportHeight * 0.72
  const end = viewportHeight * 0.42
  return Math.max(0, Math.min(1, (start - top) / Math.max(1, bottom - top - end + start)))
}

function initWorkflowLedger() {
  const host = document.querySelector("[data-workflow-ledger]")
  if (!host) return

  const rows = [...host.querySelectorAll("[data-workflow-row]")]
  const foot = host.querySelector(".v3-ledger__foot")
  const svg = host.querySelector("[data-ledger-flow]")
  const track = host.querySelector("[data-ledger-track]")
  const fill = host.querySelector("[data-ledger-fill]")
  const fadeEnd = host.querySelector("[data-ledger-fade-end]")
  const fadeEndRect = host.querySelector("[data-ledger-fade-end-rect]")
  if (!rows.length || !foot || !svg || !track || !fill) return

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  let visible = true
  let frame = 0
  let targetProgress = reduced ? 1 : 0
  let currentProgress = targetProgress

  const measure = () => {
    const hostBox = host.getBoundingClientRect()
    const firstBox = rows[0].getBoundingClientRect()
    const button = foot.querySelector(".v3-action") ?? foot
    const buttonBox = button.getBoundingClientRect()
    if (!hostBox.width || !hostBox.height) return
    const rowYs = rows.map(row => {
      const box = row.getBoundingClientRect()
      return box.top - hostBox.top + box.height / 2
    })
    const geometry = buildSerpentineRoute({
      x: hostBox.width / 2,
      startY: firstBox.top - hostBox.top - 28,
      endY: buttonBox.top - hostBox.top - LEDGER_CTA_GAP,
      rowYs,
      amplitude: getLedgerAmplitude(hostBox.width),
    })
    svg.setAttribute("viewBox", `0 0 ${hostBox.width} ${hostBox.height}`)
    track.setAttribute("d", geometry.d)
    fill.setAttribute("d", geometry.d)
    /* Slide the closing fade onto the tail of the route so it dissolves the
       way it arrives, instead of stopping on a hard dash. */
    if (fadeEnd && fadeEndRect) {
      const endY = buttonBox.top - hostBox.top - LEDGER_CTA_GAP
      fadeEnd.setAttribute("y1", String(endY - LEDGER_FADE))
      fadeEnd.setAttribute("y2", String(endY))
      fadeEndRect.setAttribute("y", String(endY - LEDGER_FADE))
      fadeEndRect.setAttribute("height", String(Math.max(0, hostBox.height - endY + LEDGER_FADE)))
    }
  }

  const render = () => {
    frame = 0
    if (!visible || document.hidden) return
    currentProgress = reduced ? 1 : smoothProgress(currentProgress, targetProgress)
    fill.style.strokeDashoffset = String(1 - currentProgress)
    if (!reduced && Math.abs(targetProgress - currentProgress) >= 0.001) {
      frame = requestAnimationFrame(render)
    }
  }

  const sampleProgress = () => {
    if (!visible || document.hidden) return
    const box = host.getBoundingClientRect()
    targetProgress = reduced ? 1 : getLedgerProgress({ top: box.top, bottom: box.bottom, viewportHeight: window.innerHeight })
    if (!frame) frame = requestAnimationFrame(render)
  }

  const schedule = () => {
    sampleProgress()
  }

  measure()
  schedule()
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(() => { measure(); schedule() }) : null
  resizeObserver?.observe(host)
  const intersectionObserver = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    schedule()
  }) : null
  intersectionObserver?.observe(host)
  window.addEventListener("resize", () => { measure(); schedule() }, { passive: true })
  window.addEventListener("scroll", schedule, { passive: true })
  document.addEventListener("visibilitychange", schedule)
  document.fonts?.ready.then(() => { measure(); schedule() })
}

if (typeof document !== "undefined") initWorkflowLedger()
