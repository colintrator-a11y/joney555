import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { projectMedia } from '../data/projectMedia.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './Lightbox.css'

const MIN_SCALE = 1
const MAX_SCALE = 5
const STEP = 0.25

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Full-size preview of a project's images, with zoom and pan.
 *
 * Rendered into document.body rather than in place: a hovered .project-row
 * carries a transform, which makes it the containing block for anything
 * position: fixed inside it, and the overlay would be trapped in the row.
 */
export default function Lightbox({ project, index, onClose, onMove }) {
  const t = useLocale()
  const closeRef = useRef(null)
  const stageRef = useRef(null)
  const imageRef = useRef(null)

  // Scale and pan live in one state object so every change can be expressed as
  // a pure updater. Held apart, a burst of clicks on + all read the same stale
  // scale from their closure and the zoom advances a single step.
  const [view, setView] = useState({ scale: MIN_SCALE, x: 0, y: 0 })

  // Set while the pointer is down, and read by the click handler so that
  // releasing a pan outside the image does not also count as "clicked away".
  const drag = useRef(null)
  const dragged = useRef(false)

  // Every finger currently on the image, by pointer id: one pans or swipes,
  // two pinch. A ref rather than state — it changes on every pointermove and
  // nothing in the markup reads it.
  const pointers = useRef(new Map())
  const pinch = useRef(null)
  const swipe = useRef(null)

  // The live view, for handlers that would otherwise close over a stale one
  // between renders during a gesture.
  const viewRef = useRef(view)
  viewRef.current = view

  const count = project.media.length
  const item = project.media[index]
  const zoomed = view.scale > MIN_SCALE

  const reset = useCallback(() => setView({ scale: MIN_SCALE, x: 0, y: 0 }), [])

  // Panning is bounded by how much of the image is off-screen at this scale,
  // so it can never be dragged out of view entirely.
  const limit = useCallback((next, atScale) => {
    const node = imageRef.current
    if (!node) return { x: 0, y: 0 }
    const max = {
      x: (node.clientWidth * (atScale - 1)) / 2,
      y: (node.clientHeight * (atScale - 1)) / 2,
    }
    return { x: clamp(next.x, -max.x, max.x), y: clamp(next.y, -max.y, max.y) }
  }, [])

  /**
   * `anchor` is the pointer's offset from the image's current visual centre.
   * Holding that point still across a scale change from s to s' means moving
   * the translation by anchor * (1 - s'/s) — so the pixel under the cursor is
   * the one that stays put, rather than the middle of the picture.
   */
  const zoom = useCallback(
    (resolve, anchor) => {
      setView((current) => {
        const scale = clamp(Number(resolve(current.scale).toFixed(2)), MIN_SCALE, MAX_SCALE)
        if (scale === current.scale) return current
        if (scale === MIN_SCALE) return { scale, x: 0, y: 0 }

        const ratio = scale / current.scale
        const next = anchor
          ? { x: current.x + anchor.x * (1 - ratio), y: current.y + anchor.y * (1 - ratio) }
          : { x: current.x, y: current.y }
        return { scale, ...limit(next, scale) }
      })
    },
    [limit],
  )

  const zoomBy = useCallback((delta, anchor) => zoom((scale) => scale + delta, anchor), [zoom])

  // The rect is the transformed one, so its centre is where the image sits now.
  const anchorAt = (point) => {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return undefined
    return { x: point.x - (rect.left + rect.width / 2), y: point.y - (rect.top + rect.height / 2) }
  }

  const anchorFrom = (event) => anchorAt({ x: event.clientX, y: event.clientY })

  const spread = ([a, b]) => Math.hypot(a.x - b.x, a.y - b.y)
  const middle = ([a, b]) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

  // A flick shorter than this is a tap that wandered, not a swipe.
  const SWIPE = 55

  const move = useCallback(
    (step) => {
      reset()
      onMove((index + step + count) % count)
    },
    [count, index, onMove, reset],
  )

  // A new image starts unzoomed.
  useEffect(() => { reset() }, [index, reset])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight' && count > 1) move(1)
      else if (event.key === 'ArrowLeft' && count > 1) move(-1)
      else if (event.key === '+' || event.key === '=') zoomBy(STEP)
      else if (event.key === '-' || event.key === '_') zoomBy(-STEP)
      else if (event.key === '0') reset()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [count, move, onClose, reset, zoomBy])

  useEffect(() => {
    // Hold the page still behind the overlay, and keep its width so the
    // disappearing scrollbar does not shift the layout underneath.
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`

    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [])

  useEffect(() => {
    // Attached by hand rather than through onWheel: React registers wheel
    // listeners as passive, and a passive listener cannot preventDefault, so
    // the page behind would scroll while the image zoomed.
    const node = stageRef.current
    if (!node) return undefined
    const onWheel = (event) => {
      event.preventDefault()
      const rect = imageRef.current?.getBoundingClientRect()
      const anchor = rect
        ? { x: event.clientX - (rect.left + rect.width / 2), y: event.clientY - (rect.top + rect.height / 2) }
        : undefined
      zoomBy(event.deltaY < 0 ? STEP : -STEP, anchor)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [zoomBy])

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 1) dragged.current = false

    // Two fingers: pinch, and neither of the one-finger gestures.
    if (pointers.current.size === 2) {
      const points = [...pointers.current.values()]
      pinch.current = { spread: spread(points) || 1, scale: viewRef.current.scale }
      drag.current = null
      swipe.current = null
      return
    }

    if (viewRef.current.scale > MIN_SCALE) {
      drag.current = { x: event.clientX - viewRef.current.x, y: event.clientY - viewRef.current.y }
    } else if (count > 1) {
      // Nothing to pan at fit size, so the same drag turns the page instead.
      swipe.current = { x: event.clientX, y: event.clientY }
    }
  }

  const onPointerMove = (event) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    }

    if (pinch.current && pointers.current.size >= 2) {
      const points = [...pointers.current.values()]
      const distance = spread(points)
      if (!distance) return
      dragged.current = true
      // Anchored on the midpoint between the fingers, so the picture grows
      // around what is being held rather than around its own centre.
      zoom(() => pinch.current.scale * (distance / pinch.current.spread), anchorAt(middle(points)))
      return
    }

    // Read the drag origin here, not inside the updater: React runs updaters
    // after the handler returns, and a pointerup arriving in the same task -
    // a quick flick - clears the ref before the updater ever looks at it.
    const origin = drag.current
    if (origin) {
      dragged.current = true
      const next = { x: event.clientX - origin.x, y: event.clientY - origin.y }
      setView((current) => ({ ...current, ...limit(next, current.scale) }))
      return
    }

    // A swipe in progress: enough movement that the release must not be read
    // as a tap on the image.
    if (swipe.current && Math.abs(event.clientX - swipe.current.x) > 8) dragged.current = true
  }

  const endPointer = (event, cancelled) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null

    const start = swipe.current
    if (start && !cancelled && count > 1) {
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      // Sideways and far enough: anything else is a tap or a scroll attempt.
      if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
    }

    swipe.current = null
    drag.current = null
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      onPointerDown={(event) => {
        // A press that starts anywhere but the image begins a fresh click:
        // without this the flag left over from the last pan would swallow the
        // first click on the surround, and the overlay would refuse to close.
        if (!event.target.closest('img')) dragged.current = false
      }}
      onClick={(event) => {
        // Anything that is not the image or a control is "outside".
        if (dragged.current) return
        if (!event.target.closest('img, button')) onClose()
      }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label={t.a11y.close}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {count > 1 ? (
        <button type="button" className="lightbox-step is-prev" onClick={() => move(-1)} aria-label={t.a11y.prevImage}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      <figure className="lightbox-figure">
        <div className="lightbox-stage" ref={stageRef}>
          <img
            ref={imageRef}
            className={zoomed ? 'is-zoomed' : ''}
            src={projectMedia[item.file]}
            alt={t.projects.mediaAlt(project.name)}
            width={item.width}
            height={item.height}
            draggable="false"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
            onClick={(event) => {
              // A drag ends in a click; that one must not toggle the zoom.
              if (dragged.current) return
              if (zoomed) reset()
              else zoom(() => 2, anchorFrom(event))
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(event) => endPointer(event, false)}
            onPointerCancel={(event) => endPointer(event, true)}
          />
        </div>

        <figcaption className="lightbox-bar">
          <span className="lightbox-title">{project.name}</span>
          {count > 1 ? <small className="lightbox-count">{index + 1} / {count}</small> : null}

          <span className="lightbox-zoom">
            <button
              type="button"
              onClick={() => zoomBy(-STEP)}
              disabled={view.scale <= MIN_SCALE}
              aria-label={t.a11y.zoomOut}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              className="lightbox-scale"
              onClick={reset}
              disabled={!zoomed}
              aria-label={t.a11y.resetZoom}
            >
              {Math.round(view.scale * 100)}%
            </button>

            <button
              type="button"
              onClick={() => zoomBy(STEP)}
              disabled={view.scale >= MAX_SCALE}
              aria-label={t.a11y.zoomIn}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </span>
        </figcaption>
      </figure>

      {count > 1 ? (
        <button type="button" className="lightbox-step is-next" onClick={() => move(1)} aria-label={t.a11y.nextImage}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
    </div>,
    document.body,
  )
}
