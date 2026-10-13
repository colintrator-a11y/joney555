/**
 * Takes the loading screen in index.html away once the page is worth looking
 * at: web fonts resolved and the first image decoded, so the first thing a
 * visitor sees is the finished hero rather than fallback type reflowing into
 * place.
 *
 * Every wait is capped. A font that never resolves, an image behind a captive
 * portal, a browser without `document.fonts` — none of them may leave someone
 * staring at a spinning cube, so the timeout dismisses it regardless.
 */
// How long the loading screen is held even when there is nothing left to wait
// for. Long enough to watch the web being spun, rather than only long enough
// to avoid a flicker.
const MIN_MS = 5000
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
  // The hero is drawn, not photographed, so there is no image to wait for —
  // this stays for the first picture on the page, whatever it ends up being.
  const image = document.querySelector('main img')
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

  // The floor the whole screen is held to, whatever the network did.
  const remaining = MIN_MS - (performance.now() - started)
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining))

  boot.classList.add('is-done')
  // Out of the tree once it has faded: a hidden overlay still answers hit
  // tests in some browsers, and it must never swallow a click.
  setTimeout(() => boot.remove(), FADE_MS + 60)
}
