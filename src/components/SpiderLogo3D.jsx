import { useEffect, useRef, useState } from 'react'
import SpiderMark from './SpiderMark.jsx'
import './SpiderLogo3D.css'

/**
 * The logo in three dimensions (src/three/spiderLogo.js), drawn into a canvas.
 *
 * three.js is a large library, so it is fetched only once this is close to the
 * window, and the flat SpiderMark stands in until the scene has drawn — and for
 * good on a browser without WebGL, or if the fetch fails.
 */
export default function SpiderLogo3D({ label }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    let stop = null
    let cancelled = false

    const load = () => {
      import('../three/spiderLogo.js')
        .then(({ mountSpiderLogo }) => {
          if (cancelled) return
          const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          stop = mountSpiderLogo(canvas, { still })
          setReady(true)
        })
        // No WebGL, or the chunk did not arrive: the flat spider stays.
        .catch(() => {})
    }

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near.disconnect()
        load()
      },
      { rootMargin: '600px' },
    )
    near.observe(canvas)

    return () => {
      cancelled = true
      near.disconnect()
      stop?.()
    }
  }, [])

  return (
    <span className={`spider-logo-3d${ready ? ' is-ready' : ''}`} role="img" aria-label={label}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {!ready && (
        <span className="spider-logo-3d-fallback" aria-hidden="true">
          <SpiderMark label="" />
        </span>
      )}
    </span>
  )
}
