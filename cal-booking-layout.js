const DESKTOP_BREAKPOINT = 1200
const NATIVE_PANEL_WIDTH = 1040
const MAX_SCALE = 1.26
const DESKTOP_BRANDING_CROP = 64

export function getReportedCalHeight(measuredHeight, inlineHeight) {
  const reportedHeight = Number.parseFloat(inlineHeight)
  return Number.isFinite(reportedHeight) && reportedHeight > 0
    ? Math.max(measuredHeight, reportedHeight)
    : measuredHeight
}

export function getCalEmbedLayout(frameWidth, iframeHeight, viewportWidth) {
  if (viewportWidth <= DESKTOP_BREAKPOINT || frameWidth <= 0 || iframeHeight <= 0) {
    return { scale: 1, nativeWidth: frameWidth, scaledHeight: iframeHeight }
  }

  const scale = Math.min(MAX_SCALE, Math.max(1, frameWidth / NATIVE_PANEL_WIDTH))
  return {
    scale,
    nativeWidth: frameWidth / scale,
    scaledHeight: Math.max(0, iframeHeight - DESKTOP_BRANDING_CROP) * scale,
  }
}
