import { useEffect, useRef } from 'react'
import './ParticleName.css'

/**
 * A word, built out of points of light.
 *
 * The word is drawn once into the canvas, that bitmap is sampled on a grid,
 * and every solid pixel becomes a home for a particle. The particles fly in
 * when the page opens, scatter away from the pointer — which, over the word,
 * also draws threads of light to the points around it — and are always pulled
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

const GAP = 5 // sampling grid: smaller is denser, and costs more particles
// On a phone the word is set small, and on the full grid a letter's stroke
// is only a dot or two wide: it reads as a dotted outline, not a letter. The
// grid shrinks with the type instead, so a stroke always carries a few dots
// across; on a wide screen the type is large and the full grid is used.
const MIN_GAP = 1.8
const DOTS_PER_EM = 26
const gapFor = (fontSize) => Math.min(GAP, Math.max(MIN_GAP, fontSize / DOTS_PER_EM))
const RETURN = 0.052 // how hard a particle is pulled home
const FRICTION = 0.86
const PUSH_RADIUS = 118
const PUSH_FORCE = 52
// Hovering the word: threads of light from the pointer to the points around
// it, a spotlight under it, and a burst of sparkle the moment it arrives.
const THREAD_REACH = 104 // how far a thread reaches from the pointer
const THREAD_MAX = 28 // threads at once, so a dense letter is not a solid fan
const BURST_REACH = 150 // how far the arrival burst is felt

// Dark-mode ink, per tone. Near-white by default: the word is drawn over the
// galaxy's brightest part, and in accent blue it disappears into it.
const TONES = { default: '#ffffff', wendy: '#f0d4ff' }
// The colour of the light that sweeps across the word, per tone.
const SHINE = { default: '#5cc2ff', wendy: '#ff8ae2' }
// By day the sweep is a bright cyan over the blue points: light on the day
// sky, as the night's sweep is on the dark one.
const DAY_SHINE = '#22b8f0'
const SWEEP_PERIOD = 4.2 // seconds between one sweep and the next
const SWEEP_WIDTH = 70 // half-width of the band of light, in CSS pixels
const TAU = Math.PI * 2

/**
 * A soft round glow in one colour, drawn once and stamped under every
 * particle: far cheaper per frame than a canvas shadow blur.
 */
function glowSprite(colour) {
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 32
  const g = sprite.getContext('2d')
  const gradient = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, colour)
  gradient.addColorStop(0.35, `${colour}88`)
  gradient.addColorStop(1, `${colour}00`)
  g.fillStyle = gradient
  g.fillRect(0, 0, 32, 32)
  return sprite
}

/**
 * A four-pointed star: a long cross of tapering rays, a shorter diagonal one,
 * and a bright core. Stamped over a particle at the peak of its flare.
 */
function sparkleSprite(colour) {
  const S = 64
  const c = S / 2
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = S
  const g = sprite.getContext('2d')
  const ray = (length, thickness, angle) => {
    g.save()
    g.translate(c, c)
    g.rotate(angle)
    const gradient = g.createLinearGradient(-length, 0, length, 0)
    gradient.addColorStop(0, `${colour}00`)
    gradient.addColorStop(0.5, '#ffffff')
    gradient.addColorStop(1, `${colour}00`)
    g.fillStyle = gradient
    g.beginPath()
    g.moveTo(-length, 0)
    g.lineTo(0, -thickness)
    g.lineTo(length, 0)
    g.lineTo(0, thickness)
    g.closePath()
    g.fill()
    g.restore()
  }
  ray(c, 1.6, 0)
  ray(c, 1.6, Math.PI / 2)
  ray(c * 0.45, 1.1, Math.PI / 4)
  ray(c * 0.45, 1.1, -Math.PI / 4)
  const core = g.createRadialGradient(c, c, 0, c, c, c * 0.35)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.4, `${colour}aa`)
  core.addColorStop(1, `${colour}00`)
  g.fillStyle = core
  g.fillRect(0, 0, S, S)
  return sprite
}

// Share of the word's particles that flare into a star now and then.
const STAR_SHARE = 0.16
// One loose star around the word per this many square CSS pixels of canvas.
const DUST_AREA = 1300

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
    // The word's own box (set wherever its points are laid out), whether the
    // pointer is over it, and an eased 0–1 of that for the effects to fade by.
    const bounds = { x0: 0, y0: 0, x1: 0, y1: 0 }
    let over = false
    let hover = 0
    const measure = (homes) => {
      bounds.x0 = Infinity
      bounds.y0 = Infinity
      bounds.x1 = -Infinity
      bounds.y1 = -Infinity
      for (const h of homes) {
        bounds.x0 = Math.min(bounds.x0, h.x)
        bounds.y0 = Math.min(bounds.y0, h.y)
        bounds.x1 = Math.max(bounds.x1, h.x)
        bounds.y1 = Math.max(bounds.y1, h.y)
      }
    }

    const ink = () =>
      document.documentElement.dataset.theme === 'light'
        ? getComputedStyle(document.documentElement).getPropertyValue('--accent-ink').trim() || '#0a55c2'
        : TONES[wordTone] ?? TONES.default
    const isLight = () => document.documentElement.dataset.theme === 'light'
    let colour = ink()
    let shine = isLight() ? DAY_SHINE : SHINE[wordTone] ?? SHINE.default
    let glow = glowSprite(colour)
    let shineGlow = glowSprite(shine)
    let sparkle = sparkleSprite(shine)
    const recolour = () => {
      colour = ink()
      shine = isLight() ? DAY_SHINE : SHINE[wordTone] ?? SHINE.default
      glow = glowSprite(colour)
      shineGlow = glowSprite(shine)
      sparkle = sparkleSprite(shine)
    }

    // Loose stars scattered around the word, twinkling on their own.
    let dust = []
    const scatterDust = () => {
      const count = Math.round((width * height) / DUST_AREA)
      dust = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.5 + Math.random() * 1.1,
        phase: Math.random() * TAU,
        speed: 0.8 + Math.random() * 2.2,
        // A few of them flare, slowly, like the stars in the word.
        flare: Math.random() < 0.3 ? 0.25 + Math.random() * 0.5 : 0,
      }))
    }

    /**
     * How far into a flare a star is, 0 to 1: a sharp peak that comes round
     * every few seconds and is dark the rest of the time.
     */
    const flareAt = (t, rate, phase) => Math.pow(Math.max(0, Math.sin(t * rate + phase)), 18)

    const size = () => {
      const parent = canvas.parentElement
      width = parent.clientWidth
      // Tall enough for the type, short enough that the line below stays close.
      height = Math.min(Math.max(width * 0.3, 96), 330)
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
      const gap = gapFor(fontSize)
      // Small type is set a weight heavier, so a thin stroke still has body.
      const weight = fontSize < 110 ? 700 : 600
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `${weight} ${fontSize}px 'Space Grotesk', 'Segoe UI', system-ui, sans-serif`
      context.fillText(value, width / 2, height / 2)

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const step = gap * ratio
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
      points.gap = gap
      return points
    }

    // A particle's size follows the grid it sits on: neighbours nearly touch
    // whatever the grid, and a fine grid does not melt into one blob.
    const fit = (p, gap) => {
      p.size = p.grain * gap
      p.scale = gap / GAP
      return p
    }

    const spawn = (home, from, gap) => fit({
      x: from ? from.x : home.x + (Math.random() - 0.5) * width * 1.6,
      y: from ? from.y : home.y + (Math.random() - 0.5) * height * 6,
      homeX: home.x,
      homeY: home.y,
      vx: 0,
      vy: 0,
      // A little variation so the swarm does not arrive as one block.
      ease: RETURN * (0.6 + Math.random() * 0.8),
      // Big enough that neighbours nearly touch on the grid, so a letter
      // reads as a solid shape and not as a mesh over the sky (1.7 or 2.1
      // pixels on the full grid).
      grain: Math.random() < 0.15 ? 0.42 : 0.34,
      // Each particle twinkles and drifts on its own clock.
      phase: Math.random() * TAU,
      speed: 1.5 + Math.random() * 3,
      star: Math.random() < STAR_SHARE ? 0.35 + Math.random() * 0.6 : 0,
      fading: false,
    }, gap)

    /** First arrival: every particle comes in from far off. */
    const build = () => {
      size()
      const homes = sample(word)
      measure(homes)
      particles = homes.map((home) => spawn(home, null, homes.gap))
      scatterDust()
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
      measure(homes)
      const live = particles.filter((p) => !p.fading)
      // The old word bursts before it reforms, so the change reads as an
      // event rather than a slide.
      if (!still.matches) {
        for (const p of live) {
          const angle = Math.random() * TAU
          const kick = 6 + Math.random() * 10
          p.vx += Math.cos(angle) * kick
          p.vy += Math.sin(angle) * kick
        }
      }
      const next = []
      for (let i = 0; i < homes.length; i += 1) {
        const p = live[i]
        if (p) {
          p.homeX = homes[i].x
          p.homeY = homes[i].y
          fit(p, homes.gap)
          next.push(p)
        } else {
          next.push(spawn(homes[i], live[i % Math.max(live.length, 1)], homes.gap))
        }
      }
      for (let i = homes.length; i < live.length; i += 1) {
        const p = live[i]
        const home = homes[i % homes.length]
        p.homeX = home.x
        p.homeY = home.y
        fit(p, homes.gap)
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

      const t = now / 1000
      const light = isLight()

      // Over the word, with a margin, so the effect starts as the pointer
      // reaches the letters rather than only once it is on a point.
      const inside =
        pointer.x > bounds.x0 - 24 && pointer.x < bounds.x1 + 24 &&
        pointer.y > bounds.y0 - 24 && pointer.y < bounds.y1 + 24
      if (inside && !over && !still.matches) {
        // Arrival: the points nearest the pointer are thrown out a little and
        // flash, so moving onto the word is felt at once.
        for (const p of particles) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d = Math.hypot(dx, dy)
          if (d > BURST_REACH || d < 0.01) continue
          const kick = (1 - d / BURST_REACH) * (5 + Math.random() * 5)
          p.vx += (dx / d) * kick
          p.vy += (dy / d) * kick
          p.flash = Math.max(p.flash || 0, 1 - d / BURST_REACH)
        }
      }
      over = inside
      hover += ((over ? 1 : 0) - hover) * Math.min(1, 0.12 * step)
      const threads = []

      // The spotlight: a soft light under the pointer while it is on the word.
      if (hover > 0.02 && !still.matches) {
        const r = THREAD_REACH * 1.6
        const spot = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, r)
        spot.addColorStop(0, light ? `${shine}40` : `${shine}55`)
        spot.addColorStop(1, `${shine}00`)
        if (!light) context.globalCompositeOperation = 'lighter'
        context.globalAlpha = hover
        context.fillStyle = spot
        context.fillRect(pointer.x - r, pointer.y - r, r * 2, r * 2)
        context.globalCompositeOperation = 'source-over'
      }
      // The sweep runs along a slight diagonal, from off the left edge to off
      // the right, then rests before the next one.
      const sweepX = ((t % SWEEP_PERIOD) / SWEEP_PERIOD) * (width + SWEEP_WIDTH * 8) - SWEEP_WIDTH * 4

      // The loose stars first, so the word is drawn over them.
      if (!still.matches) {
        if (!light) context.globalCompositeOperation = 'lighter'
        context.fillStyle = light ? colour : '#ffffff'
        for (const d of dust) {
          const tw = 0.5 + 0.5 * Math.sin(t * d.speed + d.phase)
          context.globalAlpha = intro * tw * tw * (light ? 0.45 : 0.85)
          context.beginPath()
          context.arc(d.x, d.y, d.size, 0, TAU)
          context.fill()
          if (d.flare) {
            const f = flareAt(t, d.flare, d.phase)
            if (f > 0.02) {
              const r = 7 + d.size * 9 * f
              context.globalAlpha = intro * f
              context.drawImage(sparkle, d.x - r, d.y - r, r * 2, r * 2)
            }
          }
        }
        context.globalCompositeOperation = 'source-over'
      }

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
        if (p.flash) p.flash = Math.max(0, p.flash - 0.03 * step)

        const base = still.matches ? 1 : 0.5 + intro * 0.5
        const fade = p.fading ? p.fade : 1

        // Twinkle, drift, the passing sweep, and the light of the pointer.
        let twinkle = 1
        let x = p.x
        let y = p.y
        let highlight = 0
        let near = 0
        if (!still.matches) {
          // Shallow, so the letters stay solid: the deep twinkling is left to
          // the flaring stars and the loose ones around the word.
          twinkle = 0.85 + 0.15 * Math.sin(t * p.speed + p.phase)
          x += Math.sin(t * 0.9 + p.phase) * 0.7
          y += Math.cos(t * 1.1 + p.phase) * 0.7
          const d = p.homeX + p.homeY * 0.45 - sweepX
          highlight = Math.exp(-(d * d) / (2 * SWEEP_WIDTH * SWEEP_WIDTH))
          const reach = PUSH_RADIUS * 1.8
          const pd = Math.hypot(p.x - pointer.x, p.y - pointer.y)
          if (pd < reach) near = 1 - pd / reach
          // A thread to this point, if it is close and there is room for one.
          if (hover > 0.02 && pd < THREAD_REACH && threads.length < THREAD_MAX && !p.fading) {
            threads.push({ x, y, strength: 1 - pd / THREAD_REACH })
          }
        }
        const lit = Math.min(1, highlight + near * 0.8 * (0.6 + hover * 0.4) + (p.flash || 0))
        const alpha = base * fade
        const radius = p.size * (1 + lit * 0.7)

        // The halo, added onto the sky so the word brightens what is behind it
        // instead of being lost in it. Skipped on the light page, where adding
        // light only washes out.
        if (!light) {
          context.globalCompositeOperation = 'lighter'
          const halo = radius * 3.6
          context.globalAlpha = alpha * (0.22 + 0.12 * twinkle)
          context.drawImage(glow, x - halo, y - halo, halo * 2, halo * 2)
          if (lit > 0.04) {
            const big = halo * 1.5
            context.globalAlpha = alpha * lit * 0.75
            context.drawImage(shineGlow, x - big, y - big, big * 2, big * 2)
          }
          context.globalCompositeOperation = 'source-over'
        }

        // The point itself.
        context.globalAlpha = Math.min(1, alpha * (twinkle + lit * 0.4))
        context.fillStyle = lit > 0.35 ? (light ? shine : '#ffffff') : colour
        context.beginPath()
        context.arc(x, y, radius, 0, TAU)
        context.fill()

        // The arrival burst: each point it reached flashes into a star.
        if (p.flash > 0.05) {
          const r = (6 + 14 * p.flash) * Math.max(p.scale, 0.45)
          if (!light) context.globalCompositeOperation = 'lighter'
          context.globalAlpha = alpha * p.flash
          context.drawImage(sparkle, x - r, y - r, r * 2, r * 2)
          context.globalCompositeOperation = 'source-over'
        }

        // Now and then one of the word's own points flares into a star.
        if (p.star && !still.matches) {
          const f = flareAt(t, p.star, p.phase)
          if (f > 0.02) {
            // Scaled with the type: a full-size star over small letters
            // would hide the very letters it sits on.
            const r = (9 + 12 * f) * Math.max(p.scale, 0.45)
            if (!light) context.globalCompositeOperation = 'lighter'
            context.globalAlpha = alpha * f
            context.drawImage(sparkle, x - r, y - r, r * 2, r * 2)
            context.globalCompositeOperation = 'source-over'
          }
        }
      }

      // The threads, over the points: fine lines of light from the pointer to
      // each point it is near, brighter the closer the point, with a bright
      // bead where the pointer is.
      if (threads.length && hover > 0.02) {
        if (!light) context.globalCompositeOperation = 'lighter'
        context.strokeStyle = light ? shine : '#ffffff'
        context.lineWidth = 0.8
        for (const th of threads) {
          context.globalAlpha = hover * th.strength * (light ? 0.55 : 0.5)
          context.beginPath()
          context.moveTo(pointer.x, pointer.y)
          context.lineTo(th.x, th.y)
          context.stroke()
        }
        const bead = 14 + 4 * Math.sin(t * 6)
        context.globalAlpha = hover * 0.9
        context.drawImage(sparkle, pointer.x - bead / 2, pointer.y - bead / 2, bead, bead)
        context.globalCompositeOperation = 'source-over'
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
      recolour()
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
      scatterDust()
      flowTo(word)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onTheme = () => recolour()

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
