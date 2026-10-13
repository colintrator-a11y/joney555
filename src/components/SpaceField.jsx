import { useEffect, useRef } from 'react'
import './SpaceField.css'

/**
 * The sky the whole page sits on: drifting stars, and a web that draws itself
 * between the ones that happen to be near each other — and towards the
 * pointer, which is the only thing on the page it reacts to.
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
const APPROACH = 0.42      // px of depth per frame: a drift, not a flight
const LINK_DISTANCE = 148  // in projected px, so the web thins with distance
const POINTER_DISTANCE = 210
const PARALLAX = 0.016     // how far the field leans towards the pointer

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
      return {
        x: (Math.random() - 0.5) * width * spread * (z / FOCAL),
        y: (Math.random() - 0.5) * height * spread * (z / FOCAL),
        z,
        twinkle: Math.random() * Math.PI * 2,
      }
    }

    const draw = (time) => {
      context.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      // The whole field leans towards the pointer, so moving the mouse looks
      // into the volume from a slightly different place.
      const leanX = pointer.on ? (pointer.x - cx) * PARALLAX : 0
      const leanY = pointer.on ? (pointer.y - cy) * PARALLAX : 0

      const screen = []
      for (const star of stars) {
        if (!still.matches) {
          star.z -= APPROACH
          // Past the eye: born again at the back of the field.
          if (star.z <= NEAR) Object.assign(star, born(FAR))
        }

        const scale = FOCAL / star.z
        const sx = cx + (star.x - leanX) * scale
        const sy = cy + (star.y - leanY) * scale
        // Depth as a 0–1 reading, used for size, brightness and the web.
        const near = Math.min(Math.max((FAR - star.z) / (FAR - NEAR), 0), 1)
        screen.push({ x: sx, y: sy, near })

        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) continue

        const pulse = still.matches ? 0.8 : 0.74 + Math.sin(time / 1500 + star.twinkle) * 0.26
        context.globalAlpha = (0.24 + near * 0.76) * pulse
        context.fillStyle = near > 0.72 ? `rgb(${colours.glow})` : colours.star
        const size = 0.9 + near * 2.6
        context.beginPath()
        context.arc(sx, sy, size / 2, 0, Math.PI * 2)
        context.fill()
      }

      // The web. Only near neighbours are joined, and a thread fades both with
      // the distance across the screen and with how far back in the field the
      // two stars sit — so the near web is bright and the far one is a haze.
      //
      // Bucketed by a grid one link-distance across: comparing every star with
      // every other is 34,000 pairs a frame at this count, where each one can
      // only reach the eight cells around its own.
      const cells = new Map()
      const key = (gx, gy) => `${gx},${gy}`
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

      // Threads to the pointer, lit rather than grey: the web notices you.
      if (pointer.on) {
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

    // A hidden tab should not be drawing a sky nobody is looking at.
    const onVisibility = () => (document.hidden ? stop() : start())
    const onTheme = () => { colours = palette() }

    resize()
    start()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    // The theme toggle rewrites the attribute these colours are read from.
    const themeWatch = new MutationObserver(onTheme)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      themeWatch.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="space-field" aria-hidden="true" />
}
