import { useEffect, useRef } from 'react'
import './ParticleName.css'

/**
 * The name, built out of points of light.
 *
 * The word is drawn once into an off-screen canvas, that bitmap is sampled on
 * a grid, and every solid pixel becomes a particle with a home to return to.
 * The particles fly in when the page opens and scatter away from the pointer,
 * always pulled back to the letter they belong to.
 *
 * The real heading is live text beside it, hidden from view but not from a
 * screen reader or a search engine, so the page still says its own name.
 */

const GAP = 6 // sampling grid: smaller is denser, and costs more particles
const RETURN = 0.052 // how hard a particle is pulled home
const FRICTION = 0.86
const PUSH_RADIUS = 92
const PUSH_FORCE = 38

export default function ParticleName({ text }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return undefined

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let particles = []
    let width = 0
    let height = 0
    let ratio = 1
    let frame = 0
    let intro = 0
    const pointer = { x: -9999, y: -9999 }

    const ink = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent-ink').trim() || '#7cc8ff'
    let colour = ink()

    const build = () => {
      const parent = canvas.parentElement
      width = parent.clientWidth
      // Tall enough for the type, short enough that the line below stays close.
      height = Math.min(Math.max(width * 0.3, 120), 330)
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      // Draw the word once, read it back as pixels, then clear it: what stays
      // on screen is only ever the particles.
      const size = Math.min(width / (text.length * 0.55), height * 0.98)
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `400 ${size}px 'Instrument Serif', Georgia, serif`
      context.fillText(text, width / 2, height / 2)

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const step = GAP * ratio
      particles = []
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          // Alpha only: the colour was just a stencil.
          if (pixels[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 128) continue
          const homeX = x / ratio
          const homeY = y / ratio
          particles.push({
            x: homeX + (Math.random() - 0.5) * width * 1.6,
            y: homeY + (Math.random() - 0.5) * height * 6,
            homeX,
            homeY,
            vx: 0,
            vy: 0,
            // A little variation so the swarm does not arrive as one block.
            ease: RETURN * (0.6 + Math.random() * 0.8),
            size: Math.random() < 0.12 ? 2.4 : 1.6,
          })
        }
      }
      context.clearRect(0, 0, width, height)
      intro = 0
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      // No canvas shadow: it is applied per fill, which means a blur for each
      // of the two thousand squares below. The halo is a CSS filter on the
      // element instead — once, on the composited layer.
      intro = Math.min(intro + 0.012, 1)

      for (const p of particles) {
        if (still.matches) {
          p.x = p.homeX
          p.y = p.homeY
        } else {
          const dx = p.homeX - p.x
          const dy = p.homeY - p.y
          p.vx += dx * p.ease
          p.vy += dy * p.ease

          const px = p.x - pointer.x
          const py = p.y - pointer.y
          const distance = Math.hypot(px, py)
          if (distance < PUSH_RADIUS && distance > 0.01) {
            const force = ((PUSH_RADIUS - distance) / PUSH_RADIUS) * PUSH_FORCE
            p.vx += (px / distance) * force * 0.12
            p.vy += (py / distance) * force * 0.12
          }

          p.vx *= FRICTION
          p.vy *= FRICTION
          p.x += p.vx
          p.y += p.vy
        }

        context.globalAlpha = still.matches ? 1 : 0.45 + intro * 0.55
        context.fillStyle = colour
        context.fillRect(p.x, p.y, p.size, p.size)
      }

      context.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    const start = () => { if (!frame) frame = requestAnimationFrame(draw) }
    const stop = () => { cancelAnimationFrame(frame); frame = 0 }

    const onPointer = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }

    // The serif the letters are cut from has to be loaded before they are
    // sampled, or the shapes come from the fallback face.
    const ready = document.fonts?.ready ?? Promise.resolve()
    let cancelled = false
    ready.catch(() => {}).then(() => {
      if (cancelled) return
      build()
      start()
    })

    // Scrolled past, the swarm is still being animated for nobody. The sky is
    // fixed and stays; this one is in the flow and can stop.
    const watcher = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { rootMargin: '120px' },
    )
    watcher.observe(canvas)

    const onResize = () => { build() }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onTheme = () => { colour = ink() }

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    const themeWatch = new MutationObserver(onTheme)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelled = true
      stop()
      watcher.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      themeWatch.disconnect()
    }
  }, [text])

  return <canvas ref={canvasRef} className="particle-name" aria-hidden="true" />
}
