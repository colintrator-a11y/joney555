import { useEffect, useRef } from 'react'
import './SpaceField.css'

/**
 * The sky the whole page sits on, and it has two of them.
 *
 * At night: stars at every depth, and a web that draws itself between the ones
 * that happen to be near each other — and towards the pointer, which is the
 * only thing on the page it reacts to. A click cuts a web where it lands.
 *
 * By day it is Wendy's: the same points of light, drawn as petals turning as
 * they drift, with no threads between them. A click opens a bloom instead of a
 * web. One canvas, one set of particles, two hands.
 *
 * One fixed canvas behind everything rather than a background per section, so
 * scrolling moves the page over a still sky instead of dragging a gradient
 * with it.
 */

// Stars per million pixels of viewport, so a laptop and a phone get a sky of
// the same density rather than the same count.
// Counted against the whole volume, not the screen: most of the box is off
// to the sides at any one depth, so the sky needs more of them than a flat
// field did to look as full.
const DENSITY = 185
const MAX_STARS = 430

// The field is three-dimensional: every star has a depth, and what reaches the
// screen is its projection. Near stars are bigger, brighter, and sweep past
// faster than far ones, which is what makes the web read as a volume rather
// than a pattern printed on the page.
const FOCAL = 760          // distance from the eye to the screen, in px
const NEAR = 120           // nearest a star comes before it is recycled
const FAR = 1900           // furthest a star is born
// Each star carries its own velocity, drawn once when it is born: some come
// towards the eye, some fall away, most mostly sideways. A single shared
// direction read as one sheet of points sliding the same way.
const DRIFT_XY = 0.09      // world px per frame, sideways
const DRIFT_Z = 0.34       // world px per frame, towards or away
const LINK_DISTANCE = 148  // in projected px, so the web thins with distance
const POINTER_DISTANCE = 210

// The web that snaps open where the page is clicked: spokes from the point,
// and spiral threads strung between them, sagging inwards the way a real orb
// web does. It draws itself outwards and fades as it goes.
const WEB_MS = 900
const WEB_RADIUS = 190
const WEB_SPOKES = 13
const WEB_RINGS = 3
const WEB_MAX = 3          // at once: a drummed mouse should not stack up
// The daylight bloom is thrown a shorter way than the web is cut: petals that
// travel as far as a web's spokes read as an explosion rather than a flower.
const BLOOM_RADIUS = 86

export default function SpaceField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return undefined

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stars = []
    let width = 0
    let height = 0
    let ratio = 1
    let frame = 0
    const pointer = { x: 0, y: 0, on: false }
    let webs = []

    // A web is cut once, at the click: the jitter in its spokes has to stay
    // the same for the life of the animation or it would shiver.
    const cutWeb = (x, y) => {
      const spokes = Array.from({ length: WEB_SPOKES }, (_, i) => {
        const angle = (i / WEB_SPOKES) * Math.PI * 2 + (Math.random() - 0.5) * 0.22
        return { angle, reach: 0.72 + Math.random() * 0.45 }
      })
      webs.push({ x, y, born: performance.now(), spokes })
      if (webs.length > WEB_MAX) webs = webs.slice(-WEB_MAX)
    }

    // The canvas is painted in the page's own colours, so the sky follows the
    // theme without a second palette to keep in step.
    const palette = () => {
      const styles = getComputedStyle(document.documentElement)
      return {
        star: styles.getPropertyValue('--ink-soft').trim() || '#a6b4cd',
        glow: styles.getPropertyValue('--glow').trim() || '61, 169, 252',
      }
    }
    let colours = palette()
    // Which sky this is. Read from the document rather than passed in, so the
    // toggle changes it without React re-rendering the canvas.
    const isNight = () => document.documentElement.dataset.theme !== 'light'
    let night = isNight()

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      // Capped: a 3x phone screen would otherwise paint nine times the pixels
      // for a difference nobody can see in a one-pixel star.
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const count = Math.min(MAX_STARS, Math.round(((width * height) / 1e6) * DENSITY))
      stars = Array.from({ length: count }, () => born(Math.random() * (FAR - NEAR) + NEAR))
    }

    // A star is placed in a box around the eye, wide enough that even the
    // nearest ones are born off the edges of the screen rather than popping
    // into the middle of it.
    function born(z) {
      const spread = 1.15
      // An angle for the sideways drift and an independent one for the depth,
      // so no two stars share a direction for long.
      const heading = Math.random() * Math.PI * 2
      const pace = 0.35 + Math.random() * 0.65
      return {
        x: (Math.random() - 0.5) * width * spread * (z / FOCAL),
        y: (Math.random() - 0.5) * height * spread * (z / FOCAL),
        z,
        vx: Math.cos(heading) * DRIFT_XY * pace,
        vy: Math.sin(heading) * DRIFT_XY * pace,
        // Signed: a star is as likely to be falling away as approaching.
        vz: (Math.random() - 0.5) * 2 * DRIFT_Z,
        twinkle: Math.random() * Math.PI * 2,
        // Day only: the angle a petal is lying at, and how fast it turns.
        spin: Math.random() * Math.PI * 2,
        spinV: (Math.random() - 0.5) * 0.012,
      }
    }

    const draw = (time) => {
      context.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      const screen = []
      for (const star of stars) {
        if (!still.matches) {
          star.x += star.vx
          star.y += star.vy
          star.z += star.vz
          star.spin += star.spinV

          // Out of the volume at either end: born again at the far side of it,
          // so the field neither empties nor crowds the eye.
          if (star.z <= NEAR) Object.assign(star, born(FAR))
          else if (star.z >= FAR) Object.assign(star, born(NEAR + 1))
          else {
            // Sideways it wraps rather than respawning: the box is measured at
            // this star's own depth, so a near one has further to travel.
            const halfW = (width * 1.15 * (star.z / FOCAL)) / 2
            const halfH = (height * 1.15 * (star.z / FOCAL)) / 2
            if (star.x > halfW) star.x = -halfW
            else if (star.x < -halfW) star.x = halfW
            if (star.y > halfH) star.y = -halfH
            else if (star.y < -halfH) star.y = halfH
          }
        }

        const scale = FOCAL / star.z
        const sx = cx + star.x * scale
        const sy = cy + star.y * scale
        // Depth as a 0–1 reading, used for size, brightness and the web.
        const near = Math.min(Math.max((FAR - star.z) / (FAR - NEAR), 0), 1)
        screen.push({ x: sx, y: sy, near })

        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) continue

        const pulse = still.matches ? 0.8 : 0.74 + Math.sin(time / 1500 + star.twinkle) * 0.26
        const size = 0.9 + near * 2.6

        if (night) {
          context.globalAlpha = (0.24 + near * 0.76) * pulse
          context.fillStyle = near > 0.72 ? `rgb(${colours.glow})` : colours.star
          context.beginPath()
          context.arc(sx, sy, size / 2, 0, Math.PI * 2)
          context.fill()
        } else {
          // A petal: an ellipse lying at its own angle, pinched at one end, so
          // the sky is full of things falling rather than things shining.
          const lean = pointer.on
            ? Math.max(0, 1 - Math.hypot(sx - pointer.x, sy - pointer.y) / POINTER_DISTANCE)
            : 0
          context.globalAlpha = (0.16 + near * 0.5) * pulse + lean * 0.3
          context.fillStyle = near > 0.72 || lean > 0.4 ? `rgb(${colours.glow})` : colours.star
          context.save()
          context.translate(sx, sy)
          context.rotate(star.spin + lean)
          context.beginPath()
          context.ellipse(0, 0, size * 1.7, size * 0.78, 0, 0, Math.PI * 2)
          context.fill()
          context.restore()
        }
      }

      // The web. Night only: by day the petals are not spun together.
      // Only near neighbours are joined, and a thread fades both with
      // the distance across the screen and with how far back in the field the
      // two stars sit — so the near web is bright and the far one is a haze.
      //
      // Bucketed by a grid one link-distance across: comparing every star with
      // every other is 34,000 pairs a frame at this count, where each one can
      // only reach the eight cells around its own.
      const cells = new Map()
      const key = (gx, gy) => `${gx},${gy}`
      if (night) {
      screen.forEach((point, index) => {
        const k = key(Math.floor(point.x / LINK_DISTANCE), Math.floor(point.y / LINK_DISTANCE))
        const bucket = cells.get(k)
        if (bucket) bucket.push(index)
        else cells.set(k, [index])
      })

      context.lineWidth = 0.75
      for (let i = 0; i < screen.length; i += 1) {
        const a = screen[i]
        const gx = Math.floor(a.x / LINK_DISTANCE)
        const gy = Math.floor(a.y / LINK_DISTANCE)
        for (let ox = 0; ox <= 1; ox += 1) {
          for (let oy = ox === 0 ? 0 : -1; oy <= 1; oy += 1) {
            const bucket = cells.get(key(gx + ox, gy + oy))
            if (!bucket) continue
            for (const j of bucket) {
              if (j <= i) continue // each pair once
              const b = screen[j]
              const distance = Math.hypot(a.x - b.x, a.y - b.y)
              if (distance > LINK_DISTANCE) continue
              // Threads only between stars at a similar depth: joining the
              // front of the field to the back is what made it look flat.
              const depth = 1 - Math.abs(a.near - b.near)
              if (depth < 0.32) continue
              const strength = (1 - distance / LINK_DISTANCE) * depth
              context.globalAlpha = strength * (0.16 + Math.max(a.near, b.near) * 0.62)
              context.strokeStyle = Math.max(a.near, b.near) > 0.7 ? `rgb(${colours.glow})` : colours.star
              context.beginPath()
              context.moveTo(a.x, a.y)
              context.lineTo(b.x, b.y)
              context.stroke()
            }
          }
        }
      }

      }

      // Threads to the pointer, lit rather than grey: the web notices you.
      if (night && pointer.on) {
        for (const point of screen) {
          const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y)
          if (distance > POINTER_DISTANCE) continue
          const strength = 1 - distance / POINTER_DISTANCE
          context.globalAlpha = strength * (0.2 + point.near * 0.5)
          context.strokeStyle = `rgb(${colours.glow})`
          context.lineWidth = 0.9
          context.beginPath()
          context.moveTo(point.x, point.y)
          context.lineTo(pointer.x, pointer.y)
          context.stroke()
        }
      }

      // The clicked webs, newest last so a fresh one draws over an old one.
      if (webs.length) {
        webs = webs.filter((web) => time - web.born < WEB_MS)
        for (const web of webs) {
          const t = (time - web.born) / WEB_MS

          if (!night) {
            // A bloom: petals thrown outwards from the point, turning as they
            // go. The petals are the whole of it — a ring drawn around them
            // read as a diagram of the effect rather than part of it.
            const spread = 1 - Math.pow(1 - t, 2.4)
            const fade = Math.pow(1 - t, 1.3)

            context.fillStyle = `rgb(${colours.glow})`
            for (const spoke of web.spokes) {
              const distance = BLOOM_RADIUS * spoke.reach * spread
              const px = web.x + Math.cos(spoke.angle) * distance
              const py = web.y + Math.sin(spoke.angle) * distance
              context.globalAlpha = fade * 0.85
              context.save()
              context.translate(px, py)
              // Turned by how far it has flown, so the petals tumble outwards.
              context.rotate(spoke.angle + spread * 2.4)
              context.beginPath()
              context.ellipse(0, 0, 9 * (1 - t * 0.4), 4 * (1 - t * 0.4), 0, 0, Math.PI * 2)
              context.fill()
              context.restore()
            }
            continue
          }

          // Fast out, slow to settle: the snap of a thread being pulled taut.
          const spread = 1 - Math.pow(1 - t, 3)
          // Held, then let go: at 1.6 the web was gone before the eye found it.
          const fade = Math.pow(1 - t, 1.1)
          const points = web.spokes.map((spoke) => ({
            angle: spoke.angle,
            length: WEB_RADIUS * spoke.reach * spread,
          }))

          context.strokeStyle = `rgb(${colours.glow})`

          // The spokes.
          context.globalAlpha = fade * 0.55
          context.lineWidth = 0.9
          context.beginPath()
          for (const point of points) {
            context.moveTo(web.x, web.y)
            context.lineTo(
              web.x + Math.cos(point.angle) * point.length,
              web.y + Math.sin(point.angle) * point.length,
            )
          }
          context.stroke()

          // The spiral threads, strung between neighbouring spokes and pulled
          // in towards the middle so each one hangs rather than cuts straight.
          context.globalAlpha = fade * 0.42
          context.lineWidth = 0.7
          context.beginPath()
          for (let ring = 1; ring <= WEB_RINGS; ring += 1) {
            const step = ring / WEB_RINGS
            for (let i = 0; i < points.length; i += 1) {
              const a = points[i]
              const b = points[(i + 1) % points.length]
              const ax = web.x + Math.cos(a.angle) * a.length * step
              const ay = web.y + Math.sin(a.angle) * a.length * step
              const bx = web.x + Math.cos(b.angle) * b.length * step
              const by = web.y + Math.sin(b.angle) * b.length * step
              // The control point sits between the two anchors but nearer the
              // centre: that is the sag.
              //
              // The midpoint has to be found by stepping from one angle to the
              // next, not by averaging them: the last thread runs from nearly
              // 2π back to nearly 0, and the mean of those is π — the far side
              // of the web, which is why that thread used to be slung straight
              // across the middle.
              const sweep = ((b.angle - a.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
              const mid = a.angle + sweep / 2
              const sag = ((a.length + b.length) / 2) * step * 0.82
              context.moveTo(ax, ay)
              context.quadraticCurveTo(
                web.x + Math.cos(mid) * sag,
                web.y + Math.sin(mid) * sag,
                bx,
                by,
              )
            }
          }
          context.stroke()

          // The point it was cut from.
          context.globalAlpha = fade * 0.8
          context.beginPath()
          context.arc(web.x, web.y, 1.6, 0, Math.PI * 2)
          context.fillStyle = `rgb(${colours.glow})`
          context.fill()
        }
      }

      context.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onPointer = (event) => {
      if (event.pointerType !== 'mouse') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.on = true
    }
    const onLeave = () => { pointer.on = false }

    // Any press anywhere, including a tap: the canvas itself takes no pointer
    // events, so this never stands between a visitor and a button.
    const onPress = (event) => {
      if (still.matches) return
      if (event.button !== undefined && event.button !== 0) return
      cutWeb(event.clientX, event.clientY)
      start() // a click on a hidden tab's page should not go unanswered
    }

    // A hidden tab should not be drawing a sky nobody is looking at.
    const onVisibility = () => (document.hidden ? stop() : start())
    const onTheme = () => {
      colours = palette()
      night = isNight()
    }

    resize()
    start()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPress, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    // The theme toggle rewrites the attribute these colours are read from.
    const themeWatch = new MutationObserver(onTheme)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPress)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      themeWatch.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="space-field" aria-hidden="true" />
}
