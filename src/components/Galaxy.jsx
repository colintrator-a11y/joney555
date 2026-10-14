import { useEffect, useRef } from 'react'
import galaxy from '../assets/galaxy.webp'
import './Galaxy.css'

/**
 * The sky behind the hero: a photograph of a spiral galaxy, held still, with
 * stars twinkling inside its arms.
 *
 * The galaxy is an image rather than particles. Tens of thousands of points
 * can be made to turn, but not to look like this, and a photograph costs one
 * decode where the particles cost a frame of work for ever.
 *
 * What is animated is a canvas laid exactly over it: a hundred stars whose
 * positions are sampled from the picture's own brightness, so they sit along
 * the arms rather than scattered over the window, and a slow breath on the
 * core. Nothing moves; only brightness changes.
 */

// Where the core sits in the picture, as a fraction of its width and height.
// Measured from the file by brightness rather than guessed, so the glow lands
// on the core itself at any window shape.
const CORE = { u: 0.482, v: 0.39 }

const STARS = { desktop: 240, mobile: 120 }
const FLARES = { desktop: 28, mobile: 14 }

// A star is dim for most of its cycle and brightens briefly. Raising a sine to
// a power narrows the peak, and the exponent is what sets how many are lit
// at once. Over a hundred stars, at 7 about nineteen are visibly brightening
// at a time, at 13 about fourteen, at 18 about twelve. The sky is meant to be
// busy with them now, so with 240 stars and a wider peak, roughly fifty to
// sixty are lit at any moment.
const TWINKLE_MIN = 1600
const TWINKLE_MAX = 5000
const PEAK = 9

const TINTS = [
  [214, 238, 255],
  [255, 255, 255],
  [150, 220, 255],
  [196, 168, 255],
]

/**
 * Where the picture lands once `cover` has cropped it. The overlay is drawn in
 * these coordinates, which is the whole point: a star stays on its arm when
 * the window changes shape.
 */
function coverFit(imageW, imageH, width, height) {
  const scale = Math.max(width / imageW, height / imageH)
  const w = imageW * scale
  const h = imageH * scale
  return { x: (width - w) / 2, y: (height - h) / 2, w, h }
}

/**
 * Points on the picture, weighted by how bright it is there — which is to say
 * the arms and the core. Rejection sampling: cheap, and it needs no cumulative
 * table for a hundred points.
 */
function sampleArms(image, count) {
  const grid = document.createElement('canvas')
  grid.width = 160
  grid.height = Math.max(1, Math.round((160 * image.naturalHeight) / image.naturalWidth))
  const context = grid.getContext('2d', { willReadFrequently: true })
  if (!context) return []
  context.drawImage(image, 0, 0, grid.width, grid.height)
  const pixels = context.getImageData(0, 0, grid.width, grid.height).data

  const picks = []
  let guard = 0
  while (picks.length < count && guard < count * 400) {
    guard += 1
    const x = Math.floor(Math.random() * grid.width)
    const y = Math.floor(Math.random() * grid.height)
    const i = (y * grid.width + x) * 4
    const lum = (pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11) / 255
    // Squared, so the bright arms are favoured far more than the space between
    // them and the dark corners almost never take a star.
    if (Math.random() > lum * lum) continue
    picks.push({ u: (x + Math.random()) / grid.width, v: (y + Math.random()) / grid.height })
  }
  return picks
}

/**
 * One soft disc per colour, drawn once. A radial gradient built per star per
 * frame is a hundred and eleven gradients a frame for nothing: the shape never
 * changes, only how bright and how big it is drawn.
 */
function makeHalos() {
  return TINTS.map(([r, g, b]) => {
    const sprite = document.createElement('canvas')
    sprite.width = 64
    sprite.height = 64
    const paint = sprite.getContext('2d')
    if (!paint) return sprite
    const glow = paint.createRadialGradient(32, 32, 0, 32, 32, 32)
    glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`)
    glow.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.35)`)
    glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
    paint.fillStyle = glow
    paint.fillRect(0, 0, 64, 64)
    return sprite
  })
}

export default function Galaxy() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return undefined

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(max-width: 760px)')

    const halos = makeHalos()
    let stars = []
    let flares = []
    let fit = { x: 0, y: 0, w: 0, h: 0 }
    let width = 0
    let height = 0
    let frame = 0

    const image = new Image()

    const place = () => {
      if (!image.naturalWidth) return
      const count = small.matches ? STARS.mobile : STARS.desktop
      const flareCount = small.matches ? FLARES.mobile : FLARES.desktop
      const points = sampleArms(image, count + flareCount)

      stars = points.slice(0, count).map((point) => {
        const tone = Math.floor(Math.random() * TINTS.length)
        return {
        ...point,
        size: 1 + Math.random() * 2,
        tone,
        tint: TINTS[tone],
        base: 0.16 + Math.random() * 0.3,
        period: TWINKLE_MIN + Math.random() * (TWINKLE_MAX - TWINKLE_MIN),
        phase: Math.random() * Math.PI * 2,
        }
      })

      // The flares are the few near enough to show spikes.
      flares = points.slice(count).map((point) => {
        const tone = Math.floor(Math.random() * 2)
        return {
        ...point,
        size: 1.8 + Math.random() * 1.4,
        tone,
        tint: TINTS[tone],
        period: 5200 + Math.random() * 5200,
        phase: Math.random() * Math.PI * 2,
        }
      })
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (image.naturalWidth) {
        fit = coverFit(image.naturalWidth, image.naturalHeight, width, height)
      }
    }

    const at = (point) => ({ x: fit.x + point.u * fit.w, y: fit.y + point.v * fit.h })

    const draw = (now) => {
      context.clearRect(0, 0, width, height)
      // Light adds: a star over the picture should brighten it, not replace it.
      context.globalCompositeOperation = 'lighter'

      // The core's breath: a few per cent either way, over about ten seconds.
      const core = at(CORE)
      const breath = still.matches ? 1 : 1 + Math.sin((now / 10000) * Math.PI * 2) * 0.07
      const reach = Math.min(fit.w, fit.h) * 0.36 * breath
      const glow = context.createRadialGradient(core.x, core.y, 0, core.x, core.y, reach)
      glow.addColorStop(0, `rgba(255, 246, 232, ${0.55 * breath})`)
      glow.addColorStop(0.2, `rgba(214, 232, 255, ${0.36 * breath})`)
      glow.addColorStop(0.5, `rgba(130, 190, 255, ${0.16 * breath})`)
      glow.addColorStop(1, 'rgba(90, 150, 255, 0)')
      context.fillStyle = glow
      context.beginPath()
      context.arc(core.x, core.y, reach, 0, Math.PI * 2)
      context.fill()

      for (const star of stars) {
        const { x, y } = at(star)
        const wave = still.matches
          ? 0.45
          : Math.pow(Math.max(0, Math.sin((now / star.period) * Math.PI * 2 + star.phase)), PEAK)
        const alpha = Math.min(1, star.base + wave * 0.8)
        const [r, g, b] = star.tint

        const halo = star.size * (1.8 + wave * 2.6)
        context.globalAlpha = alpha * 0.5
        context.drawImage(halos[star.tone], x - halo, y - halo, halo * 2, halo * 2)
        context.globalAlpha = 1

        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        context.beginPath()
        context.arc(x, y, star.size / 2, 0, Math.PI * 2)
        context.fill()
      }

      for (const flare of flares) {
        const { x, y } = at(flare)
        const wave = still.matches
          ? 0.4
          : Math.pow(Math.max(0, Math.sin((now / flare.period) * Math.PI * 2 + flare.phase)), 4)
        const alpha = 0.26 + wave * 0.6
        const [r, g, b] = flare.tint
        const out = flare.size * (6 + wave * 9)

        context.globalAlpha = alpha * 0.45
        context.drawImage(halos[flare.tone], x - out, y - out, out * 2, out * 2)
        context.globalAlpha = 1

        // The cross a bright point makes through a lens, as tapered slivers:
        // a line of even width reads as a plus sign drawn on the sky.
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`
        const arm = out * 1.5
        const half = flare.size * 0.3
        context.beginPath()
        for (const turn of [0, Math.PI / 2]) {
          const ux = Math.cos(turn)
          const uy = Math.sin(turn)
          context.moveTo(x + ux * arm, y + uy * arm)
          context.lineTo(x - uy * half, y + ux * half)
          context.lineTo(x - ux * arm, y - uy * arm)
          context.lineTo(x + uy * half, y - ux * half)
        }
        context.fill()

        context.fillStyle = `rgba(255, 255, 255, ${alpha})`
        context.beginPath()
        context.arc(x, y, flare.size / 2, 0, Math.PI * 2)
        context.fill()
      }

      context.globalCompositeOperation = 'source-over'
      if (!still.matches) frame = requestAnimationFrame(draw)
    }

    const start = () => {
      if (!frame && !still.matches) frame = requestAnimationFrame(draw)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onResize = () => {
      resize()
      if (still.matches) draw(performance.now())
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    image.onload = () => {
      resize()
      place()
      // Movement off: one frame, with the stars sitting at a middling
      // brightness. The sky is a photograph in either case.
      if (still.matches) draw(performance.now())
      else start()
    }
    image.src = galaxy

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      image.onload = null
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // The sky is fixed, so its bright core sits behind whatever section is in
  // the middle of the window, not only behind the name. Lit for the hero, it
  // drowns the paragraphs below; so a veil comes over it as the hero scrolls
  // away, and lifts again on the way back up.
  const veilRef = useRef(null)
  useEffect(() => {
    const veil = veilRef.current
    if (!veil) return undefined
    let queued = 0
    const update = () => {
      queued = 0
      const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.6), 0), 1)
      veil.style.opacity = progress.toFixed(3)
    }
    const onScroll = () => { if (!queued) queued = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(queued)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="galaxy" aria-hidden="true" style={{ '--galaxy-plate': `url(${galaxy})` }}>
      <div className="galaxy-plate" />
      <canvas ref={canvasRef} className="galaxy-stars" />
      <div className="galaxy-shade" />
      <div ref={veilRef} className="galaxy-veil" />
    </div>
  )
}
