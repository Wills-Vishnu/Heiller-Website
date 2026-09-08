import EmbedSnippet from "@calcom/embed-snippet"
import { getCalEmbedLayout, getReportedCalHeight } from "./cal-booking-layout.js"

const CAL_LINK = "heiller/revenue-audit"
const CAL_NAMESPACE = "revenue-audit"
const CAL_LAYOUT = "month_view"
const CAL_BRAND_LIGHT = "#ff682c"
const CAL_BRAND_DARK = "#ff682c"

const mount = document.querySelector<HTMLElement>("[data-cal-booking]")

if (mount && !mount.dataset.calInitialized) {
  mount.dataset.calInitialized = "true"

  const Cal = EmbedSnippet()
  Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" })

  const bookingCal = Cal.ns[CAL_NAMESPACE]
  bookingCal("inline", {
    elementOrSelector: mount,
    calLink: CAL_LINK,
    config: {
      layout: CAL_LAYOUT,
      theme: "light",
    },
  })
  bookingCal("ui", {
    cssVarsPerTheme: {
      light: { "cal-brand": CAL_BRAND_LIGHT },
      dark: { "cal-brand": CAL_BRAND_DARK },
    },
    hideEventTypeDetails: false,
    layout: CAL_LAYOUT,
  })

  let frameId = 0
  let observedIframe: HTMLIFrameElement | null = null

  const syncEmbedLayout = () => {
    frameId = 0
    const iframe = mount.querySelector<HTMLIFrameElement>("iframe")
    if (!iframe) return

    const nativeHeight = getReportedCalHeight(iframe.offsetHeight, iframe.style.height)
    const layout = getCalEmbedLayout(mount.clientWidth, nativeHeight, window.innerWidth)
    mount.style.setProperty("--cal-embed-scale", String(layout.scale))
    mount.style.setProperty("--cal-embed-native-width", `${layout.nativeWidth}px`)
    mount.style.setProperty("--cal-embed-native-height", `${nativeHeight}px`)
    mount.style.setProperty("--cal-embed-scaled-height", `${layout.scaledHeight}px`)
    mount.toggleAttribute("data-cal-scaled", layout.scale > 1)

    if (iframe !== observedIframe) {
      observedIframe = iframe
      resizeObserver.observe(iframe)
      iframeMutationObserver.disconnect()
      iframeMutationObserver.observe(iframe, { attributes: true, attributeFilter: ["style"] })
    }
  }

  const scheduleEmbedLayout = () => {
    if (frameId) cancelAnimationFrame(frameId)
    frameId = requestAnimationFrame(syncEmbedLayout)
  }

  const resizeObserver = new ResizeObserver(scheduleEmbedLayout)
  const iframeMutationObserver = new MutationObserver(scheduleEmbedLayout)
  const mutationObserver = new MutationObserver(scheduleEmbedLayout)
  resizeObserver.observe(mount)
  mutationObserver.observe(mount, { childList: true, subtree: true })
  window.addEventListener("resize", scheduleEmbedLayout, { passive: true })
  scheduleEmbedLayout()
}
