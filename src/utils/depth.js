/**
 * Runtime for the 3D layer in src/styles/depth.css.
 *
 * Delegated rather than wired component by component: the work list re-renders
 * on every filter change, so handlers bound to a card would have to be rebound
 * each time. One set of listeners on the document covers everything that is on
 * the page now and everything that arrives later.
 *
 * Tilt is for pointers that can hover. On a touch screen there is no hover to
 * tilt during — the finger is already on the thing — and a phone has the least
 * compositing power to spare, so it is left out there entirely.
 */

const TILT = {
  // Degrees at the far edge of a card. Small on purpose: past about 8° the
  // text on a card starts to look bent rather than the card tipped.
  default: 8,
  soft: 4,
}

const LIFT_PX = -6
const DEPTH_PX = 22
const REVEAL_STEP_MS = 70
const REVEAL_MAX_DELAY_MS = 280

const motionOk = () =>
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const canHover = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

/* -------------------------------- tilt --------------------------------- */

function startTilt() {
  let current = null
  let frame = 0
  let pending = null

  const clear = (node) => {
    node.classList.remove('is-tilting')
    node.style.removeProperty('--tilt-x')
    node.style.removeProperty('--tilt-y')
    node.style.removeProperty('--tilt-lift')
    node.style.removeProperty('--tilt-z')
  }

  const apply = () => {
    frame = 0
    if (!current || !pending) return
    const rect = current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    // -0.5…0.5 from the centre of the card, so the maths is the same whatever
    // the card's size, and the sign is what decides which way it tips.
    const px = (pending.x - rect.left) / rect.width - 0.5
    const py = (pending.y - rect.top) / rect.height - 0.5
    const max = TILT[current.dataset.tilt] ?? TILT.default

    // A pointer above the middle tips the top away: rotateX takes the
    // opposite sign to the vertical offset.
    current.style.setProperty('--tilt-x', `${(-py * max * 2).toFixed(2)}deg`)
    current.style.setProperty('--tilt-y', `${(px * max * 2).toFixed(2)}deg`)
    current.style.setProperty('--tilt-lift', `${LIFT_PX}px`)
    current.style.setProperty('--tilt-z', `${DEPTH_PX}px`)
  }

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return
      const node = event.target.closest?.('[data-tilt]')

      if (node !== current) {
        if (current) clear(current)
        current = node
        if (current) current.classList.add('is-tilting')
      }
      if (!current) return

      pending = { x: event.clientX, y: event.clientY }
      // One update per frame however many events the mouse sends.
      if (!frame) frame = requestAnimationFrame(apply)
    },
    { passive: true },
  )

  // Only the card's own pointerleave ends a tilt. Captured here, a leave fired
  // by a child — crossing from the heading to the paragraph inside a card —
  // would otherwise resolve to the same card through closest() and drop the
  // tilt while the pointer is still on it.
  document.addEventListener(
    'pointerleave',
    (event) => {
      if (event.target !== current) return
      clear(current)
      current = null
    },
    { capture: true, passive: true },
  )

  // A card can also be left by the page scrolling out from under the pointer.
  window.addEventListener(
    'scroll',
    () => {
      if (!current) return
      clear(current)
      current = null
    },
    { passive: true },
  )
}

/* ------------------------------- reveal -------------------------------- */

function startReveal() {
  if (!('IntersectionObserver' in window)) {
    for (const node of document.querySelectorAll('[data-reveal]')) {
      node.classList.add('is-revealed')
    }
    return
  }

  const seen = new WeakSet()

  const observer = new IntersectionObserver(
    (entries) => {
      // Entries arrive in document order within a batch; a group that comes
      // into view together is staggered rather than snapping as one.
      let step = 0
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const node = entry.target
        node.style.setProperty(
          '--reveal-delay',
          `${Math.min(step * REVEAL_STEP_MS, REVEAL_MAX_DELAY_MS)}ms`,
        )
        node.classList.add('is-revealed')
        observer.unobserve(node)
        step += 1
      }
    },
    // A little way into the viewport, so a card is already settling by the
    // time it is properly in the reader's view.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )

  const watch = (node) => {
    if (seen.has(node)) return
    seen.add(node)
    // Anything already on screen when this runs — the hero — should not fly
    // in; it was there before the script was.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
      node.classList.add('is-revealed')
      return
    }
    observer.observe(node)
  }

  const scan = (root) => {
    if (root.nodeType !== 1) return
    if (root.matches?.('[data-reveal]')) watch(root)
    for (const node of root.querySelectorAll?.('[data-reveal]') ?? []) watch(node)
  }

  scan(document.body)

  // The work list rebuilds itself on every filter change, and those cards
  // arrive already in view.
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) scan(node)
    }
  }).observe(document.body, { childList: true, subtree: true })
}

export default function initDepth() {
  if (typeof window === 'undefined') return
  // Tells the stylesheet it may hide things until they are revealed. Without
  // it — script blocked, or an old browser — the page stays plainly visible.
  document.documentElement.classList.add('depth-ready')

  if (!motionOk()) return
  startReveal()
  if (canHover()) startTilt()
}
