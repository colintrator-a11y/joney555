import { useEffect, useRef } from 'react'
import './ParticleName.css'

/**
 * A word, built out of points of light.
 *
 * The word is drawn once into the canvas, that bitmap is sampled on a grid,
 * and every solid pixel becomes a home for a particle. The particles fly in
 * when the page opens, scatter away from the pointer, and are always pulled
 * back to the letter they belong to.
 *
 * When the word changes, the particles are not thrown away: each is given a
 * new home in the new word and travels to it, so one word flows into the next
 * instead of being cut. The swarm grows or shrinks to the size of the word it
 * is becoming.
 *
 * The real heading is live text beside it, hidden from view but not from a
 * screen reader or a search engine, so the page still says its own name
 * whichever word the dots are spelling.
 */

const GAP = 6 // sampling grid: smaller is denser, and costs more particles
const RETURN = 0.052 // how hard a particle is pulled home
const FRICTION = 0.86
const PUSH_RADIUS = 92
const PUSH_FORCE = 38

// Dark-mode ink, per tone. Near-white by default: the word is drawn over the
// galaxy's brightest part, and in accent blue it disappears into it.
const TONES = { default: '#eaf6ff', wendy: '#e3b6ff' }

export default function ParticleName({ text, tone = 'default' }) {
  const canvasRef = useRef(null)
  // The running effect hands these back, so a new word or tone reaches the
  // animation without tearing it down and starting the swarm again.
  const retarget = useRef(null)
  const retone = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return undefined

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let particles = []
    let word = text
    let wordTone = tone
    let width = 0
    let height = 0
    let ratio = 1
    let frame = 0
    let intro = 0
    const pointer = { x: -9999, y: -9999 }

    const ink = () =>
      document.documentElement.dataset.theme === 'light'
        ? getComputedStyle(document.documentElement).getPropertyValue('--accent-ink').trim() || '#7c2fcb'
        : TONES[wordTone] ?? TONES.default
    let colour = ink()

    const size = () => {
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
    }

    /** The points a word occupies at this size, in CSS pixels. */
    const sample = (value) => {
      // Drawn, read back as pixels, then cleared: what stays on screen is only
      // ever the particles. Longer words are set smaller so every one fits.
      const fontSize = Math.min(width / (value.length * 0.62), height * 0.92)
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `600 ${fontSize}px 'Space Grotesk', 'Segoe UI', system-ui, sans-serif`
      context.fillText(value, width / 2, height / 2)

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const step = GAP * ratio
      const points = []
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          // Alpha only: the colour was just a stencil.
          if (pixels[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 128) continue
          points.push({ x: x / ratio, y: y / ratio })
        }
      }
      context.clearRect(0, 0, width, height)

      // Shuffled, so the particles that move to the new word are not handed
      // their homes left to right — the flow comes from everywhere at once.
      for (let i = points.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[points[i], points[j]] = [points[j], points[i]]
      }
      return points
    }

    const spawn = (home, from) => ({
      x: from ? from.x : home.x + (Math.random() - 0.5) * width * 1.6,
      y: from ? from.y : home.y + (Math.random() - 0.5) * height * 6,
      homeX: home.x,
      homeY: home.y,
      vx: 0,
      vy: 0,
      // A little variation so the swarm does not arrive as one block.
      ease: RETURN * (0.6 + Math.random() * 0.8),
      size: Math.random() < 0.12 ? 2.4 : 1.6,
      fading: false,
    })

    /** First arrival: every particle comes in from far off. */
    const build = () => {
      size()
      particles = sample(word).map((home) => spawn(home))
      intro = 0
    }

    /**
     * A new word: the particles already on screen are given its homes and
     * travel there. A longer word gets new particles, born where existing ones
     * are, so nothing appears out of thin air; a shorter one sends the spare
     * particles to homes in it as well, where they fade out on arrival.
     */
    const flowTo = (value) => {
      const homes = sample(value)
      if (!homes.length) return
      const live = particles.filter((p) => !p.fading)
      const next = []
      for (let i = 0; i < homes.length; i += 1) {
        const p = live[i]
        if (p) {
          p.homeX = homes[i].x
          p.homeY = homes[i].y
          next.push(p)
        } else {
          next.push(spawn(homes[i], live[i % Math.max(live.length, 1)]))
        }
      }
      for (let i = homes.length; i < live.length; i += 1) {
        const p = live[i]
        const home = homes[i % homes.length]
        p.homeX = home.x
        p.homeY = home.y
        p.fading = true
        p.fade = 1
        next.push(p)
      }
      particles = next
    }

    let last = 0
    const draw = (now) => {
      // Frame-time, not frame-count: eased per frame, the swarm takes six
      // times as long to come together on a device drawing at ten frames a
      // second as on one drawing at sixty. Clamped, so a tab returning from
      // the background does not jump the particles home in one step.
      const step = last ? Math.min((now - last) / 16.67, 3) : 1
      last = now
      context.clearRect(0, 0, width, height)
      intro = Math.min(intro + 0.012 * step, 1)

      for (const p of particles) {
        if (still.matches) {
          p.x = p.homeX
          p.y = p.homeY
        } else {
          const dx = p.homeX - p.x
          const dy = p.homeY - p.y
          p.vx += dx * p.ease * step
          p.vy += dy * p.ease * step

          const px = p.x - pointer.x
          const py = p.y - pointer.y
          const distance = Math.hypot(px, py)
          if (distance < PUSH_RADIUS && distance > 0.01) {
            const force = ((PUSH_RADIUS - distance) / PUSH_RADIUS) * PUSH_FORCE
            p.vx += (px / distance) * force * 0.12
            p.vy += (py / distance) * force * 0.12
          }

          const drag = Math.pow(FRICTION, step)
          p.vx *= drag
          p.vy *= drag
          p.x += p.vx * step
          p.y += p.vy * step
        }

        // Spare particles fade as they arrive, rather than vanishing mid-air.
        if (p.fading) p.fade = Math.max(0, p.fade - 0.025 * step)

        const base = still.matches ? 1 : 0.45 + intro * 0.55
        context.globalAlpha = p.fading ? base * p.fade : base
        context.fillStyle = colour
        context.fillRect(p.x, p.y, p.size, p.size)
      }

      // The faded-out spares have no further part to play.
      if (particles.some((p) => p.fading && p.fade === 0)) {
        particles = particles.filter((p) => !(p.fading && p.fade === 0))
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

    // The display face the letters are cut from has to be loaded before they
    // are sampled, or the shapes come from the fallback.
    const ready = document.fonts?.ready ?? Promise.resolve()
    let cancelled = false
    let built = false
    ready.catch(() => {}).then(() => {
      if (cancelled) return
      build()
      built = true
      start()
    })

    retarget.current = (value) => {
      word = value
      // Before the font has loaded there is nothing to flow from yet; the
      // first build will simply use the latest word.
      if (built) flowTo(value)
    }
    retone.current = (value) => {
      wordTone = value
      colour = ink()
    }

    // Scrolled past, the swarm is still being animated for nobody. The sky is
    // fixed and stays; this one is in the flow and can stop.
    const watcher = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { rootMargin: '120px' },
    )
    watcher.observe(canvas)

    // A resize changes the size of every letter: the current word is laid out
    // again and the particles flow to their new places, rather than the whole
    // swarm being thrown back in from off the canvas.
    const onResize = () => {
      if (!built) return
      size()
      flowTo(word)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onTheme = () => { colour = ink() }

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    const themeWatch = new MutationObserver(onTheme)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelled = true
      retarget.current = null
      retone.current = null
      stop()
      watcher.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      themeWatch.disconnect()
    }
    // Built once. The word and tone change through the refs below, so the
    // swarm survives every change instead of being rebuilt from nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { retarget.current?.(text) }, [text])
  useEffect(() => { retone.current?.(tone) }, [tone])

  return <canvas ref={canvasRef} className="particle-name" aria-hidden="true" />
}
