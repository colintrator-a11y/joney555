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
const DENSITY = 95
const MAX_STARS = 260
const LINK_DISTANCE = 132
const POINTER_DISTANCE = 190
const DRIFT = 0.052

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
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.75 + 0.25, // depth: size, brightness and speed
        vx: (Math.random() - 0.5) * DRIFT,
        vy: (Math.random() - 0.5) * DRIFT,
        twinkle: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (time) => {
      context.clearRect(0, 0, width, height)

      for (const star of stars) {
        if (!still.matches) {
          star.x += star.vx
          star.y += star.vy
          // Off one edge, back on the other: the sky never runs out.
          if (star.x < -8) star.x = width + 8
          if (star.x > width + 8) star.x = -8
          if (star.y < -8) star.y = height + 8
          if (star.y > height + 8) star.y = -8
        }

        const pulse = still.matches ? 0.75 : 0.72 + Math.sin(time / 1400 + star.twinkle) * 0.28
        context.globalAlpha = star.z * pulse * 0.6
        context.fillStyle = colours.star
        const size = star.z * 1.7
        context.fillRect(star.x, star.y, size, size)
      }

      // The web. Only near neighbours are joined, and the line fades with the
      // distance, so the pattern reads as threads rather than a mesh.
      //
      // Bucketed by a grid one link-distance across: comparing every star with
      // every other is 34,000 pairs a frame at this count, where each star
      // can only possibly reach the eight cells around its own.
      const cells = new Map()
      const key = (cx, cy) => `${cx},${cy}`
      for (const star of stars) {
        const k = key(Math.floor(star.x / LINK_DISTANCE), Math.floor(star.y / LINK_DISTANCE))
        const bucket = cells.get(k)
        if (bucket) bucket.push(star)
        else cells.set(k, [star])
      }

      context.strokeStyle = colours.star
      context.lineWidth = 0.6
      for (const star of stars) {
        const cx = Math.floor(star.x / LINK_DISTANCE)
        const cy = Math.floor(star.y / LINK_DISTANCE)
        for (let ox = 0; ox <= 1; ox += 1) {
          for (let oy = ox === 0 ? 0 : -1; oy <= 1; oy += 1) {
            const bucket = cells.get(key(cx + ox, cy + oy))
            if (!bucket) continue
            for (const other of bucket) {
              // Each pair once: the half-neighbourhood above plus this test.
              if (other === star || (ox === 0 && oy === 0 && other.x < star.x)) continue
              const distance = Math.hypot(star.x - other.x, star.y - other.y)
              if (distance > LINK_DISTANCE) continue
              context.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.16
              context.beginPath()
              context.moveTo(star.x, star.y)
              context.lineTo(other.x, other.y)
              context.stroke()
            }
          }
        }
      }

      // Threads to the pointer, lit rather than grey: the web notices you.
      if (pointer.on) {
        for (const star of stars) {
          const distance = Math.hypot(star.x - pointer.x, star.y - pointer.y)
          if (distance > POINTER_DISTANCE) continue
          const strength = 1 - distance / POINTER_DISTANCE
          context.globalAlpha = strength * 0.5
          context.strokeStyle = `rgb(${colours.glow})`
          context.lineWidth = 0.8
          context.beginPath()
          context.moveTo(star.x, star.y)
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
