/**
 * Takes the loading screen in index.html away once the page is worth looking
 * at: web fonts resolved and the portrait decoded, so the first thing a
 * visitor sees is the finished hero rather than fallback type reflowing into
 * place.
 *
 * Every wait is capped. A font that never resolves, an image behind a captive
 * portal, a browser without `document.fonts` — none of them may leave someone
 * staring at a spinning cube, so the timeout dismisses it regardless.
 */
const MIN_MS = 450
const MAX_MS = 3200
const FADE_MS = 500

const settle = (promise, ms) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]).catch(() => {})

function whenPainted() {
  // Two frames: the first is the one React's markup lands in, the second is
  // after the browser has actually drawn it.
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  )
}

function whenHeroReady() {
  const image = document.querySelector('.portrait-frame img')
  if (!image) return Promise.resolve()
  if (image.complete) return Promise.resolve()
  return new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true })
    image.addEventListener('error', resolve, { once: true })
  })
}

export default async function dismissBootScreen() {
  const boot = document.getElementById('boot')
  if (!boot) return

  const started = performance.now()

  await whenPainted()
  await settle(document.fonts?.ready ?? Promise.resolve(), MAX_MS)
  await settle(whenHeroReady(), MAX_MS - (performance.now() - started))

  // Below this the screen reads as a flicker rather than a transition.
  const remaining = MIN_MS - (performance.now() - started)
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining))

  boot.classList.add('is-done')
  // Out of the tree once it has faded: a hidden overlay still answers hit
  // tests in some browsers, and it must never swallow a click.
  setTimeout(() => boot.remove(), FADE_MS + 60)
}
