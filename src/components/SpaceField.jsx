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
// Deep sky. A field of even dots reads as a screensaver; what makes a night
// sky is that it is not even — a band where the galaxy runs, a few stars near
// enough to burn, colour in them, and something crossing it now and then.
const BAND_SHARE = 0.34    // how many stars belong to the galactic band
const BAND_TILT = -0.42    // radians the band lies across the view
const BAND_SPREAD = 0.15   // how tightly they gather to it
// The band is swung below the middle of the view on purpose: run through the
// centre it lands exactly where the name is drawn, and the name disappears
// into it.
const BAND_DROP = 0.3
const GLINT_NEAR = 0.88    // a star this close earns diffraction spikes
const SHOOT_MIN_MS = 7000  // and how long between things crossing the sky
const SHOOT_VAR_MS = 11000
const SHOOT_LIFE_MS = 1100

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

// Daylight drifts. The night sky is a field seen from a ship; this is petals
// falling in still air, and it should look like it.
const DAY_SPEED = 0.3
// How far a petal turns towards a passing pointer, and how quickly it gets
// there. Small and slow: a nudge, not a flinch.
const TILT_MAX = 0.42
const TILT_EASE = 0.06

// Water. A petal on a surface does not travel in a line: it rides a swell,
// rocks as it goes, and comes back to rest where it was.
const BOB_AMP = 7          // px of sway at the near plane
const BOB_RATE = 0.00026   // radians per millisecond

// The ring a click sends out: a wave train, not a shove. A petal on water does
// not get pushed aside by a passing wave — it rides up the face of it, leans
// with the slope, slides back as the crest goes by and ends up where it
// started. So the ripple contributes an *offset* that oscillates, never a
// velocity that accumulates.
const RIPPLE_MS = 2900     // the train crosses the page slowly
const RIPPLE_REACH = 680     // px the front of the train travels
const RIPPLE_BAND = 170      // how far behind the front the swell still carries
const RIPPLE_WAVE = 230      // crest to crest: long swells, not chop
const RIPPLE_SWAY = 15       // px a petal rides, at the strongest
const RIPPLE_ROCK = 0.46     // radians it leans on the steepest face
const RIPPLE_LIFT = 0.16     // how much bigger it looks lifted on a crest

/**
 * One petal, drawn around the origin at unit size: a pointed tip at the top, a
 * fuller, rounder base at the bottom, and the two sides cut differently so it
 * curls rather than sitting flat — a petal off a flower, not a leaf shape.
 *
 * Unit coordinates on purpose. The caller scales the context instead of the
 * path, which means one cached gradient in the same coordinates paints every
 * petal on the page whatever its size.
 */
function petalPath(context) {
  context.beginPath()
  context.moveTo(0, -1)
  // The full side: wide, and widest below the middle, where a petal carries
  // its weight.
  context.bezierCurveTo(0.52, -0.46, 0.62, 0.34, 0.06, 1)
  // The curled side: narrower, and pulled back across the axis near the base,
  // which is what gives the petal its turn.
  context.bezierCurveTo(-0.5, 0.42, -0.42, -0.4, 0, -1)
  context.closePath()
}

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
    let ripples = []
    // Something crossing the sky, now and then. One at a time: two at once
    // reads as a effect rather than an event.
    let shoot = null
    let nextShoot = performance.now() + SHOOT_MIN_MS

    // A web is cut once, at the click: the jitter in its spokes has to stay
    // the same for the life of the animation or it would shiver.
    const cutWeb = (x, y) => {
      const spokes = Array.from({ length: WEB_SPOKES }, (_, i) => {
        const angle = (i / WEB_SPOKES) * Math.PI * 2 + (Math.random() - 0.5) * 0.22
        return { angle, reach: 0.72 + Math.random() * 0.45 }
      })
      const born = performance.now()
      webs.push({ x, y, born, spokes })
      if (webs.length > WEB_MAX) webs = webs.slice(-WEB_MAX)
      // Day only: at night the stars are not floating on anything.
      if (!night) {
        ripples.push({ x, y, born })
        if (ripples.length > WEB_MAX) ripples = ripples.slice(-WEB_MAX)
      }
    }

    // The canvas is painted in the page's own colours, so the sky follows the
    // theme without a second palette to keep in step.
    const palette = () => {
      const styles = getComputedStyle(document.documentElement)
      return {
        star: styles.getPropertyValue('--ink-soft').trim() || '#a6b4cd',
        glow: styles.getPropertyValue('--glow').trim() || '61, 169, 252',
        // Not a token: nothing else on the page is this colour, and a sky
        // with no warm light in it looks printed rather than seen.
        warm: '#ffd9a8',
      }
    }
    let colours = palette()
    // Which sky this is. Read from the document rather than passed in, so the
    // toggle changes it without React re-rendering the canvas.
    const isNight = () => document.documentElement.dataset.theme !== 'light'
    let night = isNight()

    // Pale at the tip, deep at the base, like the petal it is drawn from.
    // Built once per palette rather than per petal per frame: there are four
    // hundred of them and sixty frames a second.
    const makePetalFill = () => {
      const fill = context.createLinearGradient(0, -1, 0, 1)
      fill.addColorStop(0, `rgba(${colours.glow}, 0.15)`)
      fill.addColorStop(0.38, `rgba(${colours.glow}, 0.62)`)
      fill.addColorStop(1, `rgba(${colours.glow}, 1)`)
      return fill
    }
    let petalFill = makePetalFill()

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

      // Most of the sky is scattered; a share of it gathers into the band,
      // which is laid across the view at an angle and given a little depth of
      // its own so it reads as something far away rather than a drawn line.
      let bx = (Math.random() - 0.5) * width * spread * (z / FOCAL)
      let by = (Math.random() - 0.5) * height * spread * (z / FOCAL)
      let inBand = false
      if (Math.random() < BAND_SHARE) {
        const along = (Math.random() - 0.5) * width * spread * (z / FOCAL) * 1.4
        const across = (Math.random() + Math.random() - 1) * height * BAND_SPREAD * (z / FOCAL)
        bx = along * Math.cos(BAND_TILT) - across * Math.sin(BAND_TILT)
        by = along * Math.sin(BAND_TILT) + across * Math.cos(BAND_TILT)
        by += height * BAND_DROP * (z / FOCAL)
        inBand = true
      }

      return {
        x: bx,
        y: by,
        z,
        vx: Math.cos(heading) * DRIFT_XY * pace,
        vy: Math.sin(heading) * DRIFT_XY * pace,
        // Signed: a star is as likely to be falling away as approaching.
        vz: (Math.random() - 0.5) * 2 * DRIFT_Z,
        twinkle: Math.random() * Math.PI * 2,
        // Day only: the angle a petal is lying at, and how fast it turns.
        spin: Math.random() * Math.PI * 2,
        spinV: (Math.random() - 0.5) * 0.012,
        tilt: 0,
        glint: 0,
        // Starlight is not one colour. Most are cold, a few run warm, and the
        // nearest are the ones that show it.
        warm: Math.random() < 0.16,
        // Band stars are the far ones seen edge-on: smaller and dimmer, so
        // the band reads as a haze rather than a second field of points.
        inBand,
        // Water: each petal rides its own swell.
        waveF: 0.7 + Math.random() * 0.8,
        waveA: 0.55 + Math.random() * 0.9,
      }
    }

    const draw = (time) => {
      context.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      if (!night) ripples = ripples.filter((r) => time - r.born < RIPPLE_MS)

      const screen = []
      for (const star of stars) {
        if (!still.matches) {
          // Petals fall slower than stars sweep past.
          const pace = night ? 1 : DAY_SPEED
          star.x += star.vx * pace
          star.y += star.vy * pace
          star.z += star.vz * pace
          star.spin += star.spinV * (night ? 1 : 0.28)

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
        // Not const: by day the swell and any passing ripple are added to
        // these before anything is drawn or measured.
        let sx = cx + star.x * scale
        let sy = cy + star.y * scale
        // Depth as a 0–1 reading, used for size, brightness and the web.
        const near = Math.min(Math.max((FAR - star.z) / (FAR - NEAR), 0), 1)
        screen.push({ x: sx, y: sy, near })

        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) continue

        const pulse = still.matches ? 0.8 : 0.74 + Math.sin(time / 1500 + star.twinkle) * 0.26
        const size = 0.9 + near * 2.6

        if (night) {
          context.globalAlpha = (0.24 + near * 0.76) * pulse * (star.inBand ? 0.62 : 1)
          context.fillStyle = star.warm
            ? colours.warm
            : near > 0.72
              ? `rgb(${colours.glow})`
              : colours.star
          context.beginPath()
          context.arc(sx, sy, (size * (star.inBand ? 0.6 : 1)) / 2, 0, Math.PI * 2)
          context.fill()

          // The nearest few burn: a soft halo and the cross a bright point
          // makes through a lens.
          if (near > GLINT_NEAR && !star.inBand) {
            const burn = (near - GLINT_NEAR) / (1 - GLINT_NEAR)
            const reach = size * (2.2 + burn * 5.5)
            context.globalAlpha = burn * 0.5 * pulse
            context.lineWidth = 0.7
            context.strokeStyle = context.fillStyle
            context.beginPath()
            context.moveTo(sx - reach, sy)
            context.lineTo(sx + reach, sy)
            context.moveTo(sx, sy - reach)
            context.lineTo(sx, sy + reach)
            context.stroke()

            context.globalAlpha = burn * 0.16 * pulse
            context.beginPath()
            context.arc(sx, sy, size * 2.6, 0, Math.PI * 2)
            context.fill()
          }
        } else {
          // A petal lying at its own angle, so the sky is full of things
          // falling rather than things shining. One colour throughout —
          // depth and the pointer change how present a petal is, never what
          // colour it is, or the sky looks like two sets of confetti.
          // The swell: an offset rather than a change of course, so a petal
          // rides up and down without wandering off across the page.
          const swell = time * BOB_RATE * star.waveF + star.twinkle
          const bobX = Math.sin(swell) * BOB_AMP * star.waveA * (0.35 + near * 0.65)
          const bobY = Math.cos(swell * 0.82) * BOB_AMP * 0.62 * star.waveA * (0.35 + near * 0.65)

          // Any passing wave train. Each one adds a ride along the line back
          // to where it was cut, a lean with the slope of the water, and a
          // little lift on the crest. All three are read from the wave at this
          // instant, so when it has gone the petal is exactly where it was.
          let ride = 0
          let rock = 0
          let lift = 0
          let rideX = 0
          let rideY = 0

          if (!still.matches) {
            for (const ripple of ripples) {
              const age = (time - ripple.born) / RIPPLE_MS
              const front = RIPPLE_REACH * (1 - Math.pow(1 - age, 2.2))
              const dx = sx - ripple.x
              const dy = sy - ripple.y
              const distance = Math.hypot(dx, dy) || 0.001
              const behind = distance - front
              // The train only carries behind its own front, and fades out
              // over a few wavelengths rather than stopping at an edge.
              const envelope =
                Math.exp(-((behind / RIPPLE_BAND) ** 2)) *
                (1 - age) *
                (1 - Math.min(distance / RIPPLE_REACH, 1) * 0.55)
              if (envelope < 0.01) continue

              const phase = (behind / RIPPLE_WAVE) * Math.PI * 2
              // Displacement follows the wave; the slope it is lying on is
              // that wave's derivative, a quarter turn out of step — which is
              // what makes a float rock as the crest goes under it.
              ride += Math.cos(phase) * envelope
              rock += Math.sin(phase) * envelope
              lift += Math.max(0, Math.cos(phase)) * envelope
              rideX += (dx / distance) * envelope
              rideY += (dy / distance) * envelope
            }

            if (ride || rock) {
              const spread = Math.hypot(rideX, rideY) || 1
              sx += (rideX / spread) * ride * RIPPLE_SWAY
              sy += (rideY / spread) * ride * RIPPLE_SWAY
            }
          }

          sx += bobX
          sy += bobY

          const lean = pointer.on
            ? Math.max(0, 1 - Math.hypot(sx - pointer.x, sy - pointer.y) / POINTER_DISTANCE)
            : 0
          // Eased towards the target rather than set to it: a petal should
          // turn as the pointer passes, not flick to a new angle every frame.
          star.tilt += (lean * TILT_MAX - star.tilt) * TILT_EASE
          star.glint += (lean - star.glint) * TILT_EASE

          context.globalAlpha = (0.18 + near * 0.5) * pulse + star.glint * 0.26 + lift * 0.12
          context.save()
          context.translate(sx, sy)
          context.rotate(star.spin + star.tilt + Math.sin(swell * 1.1) * 0.22 + rock * RIPPLE_ROCK)
          // The gradient is written in the same unit space as the path, so
          // scaling the context carries both.
          // Lifted on a crest it is nearer the eye, so a touch larger.
          const riding = size * 3.1 * (1 + lift * RIPPLE_LIFT)
          context.scale(riding, riding)
          context.fillStyle = petalFill
          petalPath(context)
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

      // A meteor, every so often, falling along the band rather than across
      // it — the sky it belongs to is the one being drawn.
      if (night && !still.matches) {
        if (!shoot && time > nextShoot) {
          const from = Math.random() < 0.5
          shoot = {
            born: time,
            x: from ? -80 : width * (0.2 + Math.random() * 0.6),
            y: from ? height * (0.1 + Math.random() * 0.4) : -80,
            angle: BAND_TILT + Math.PI + (Math.random() - 0.5) * 0.3 + (from ? Math.PI : 0),
            reach: 420 + Math.random() * 520,
          }
        }

        if (shoot) {
          const age = (time - shoot.born) / SHOOT_LIFE_MS
          if (age >= 1) {
            shoot = null
            nextShoot = time + SHOOT_MIN_MS + Math.random() * SHOOT_VAR_MS
          } else {
            // Bright head, tail stretched behind it, both fading out together.
            const travelled = shoot.reach * (1 - Math.pow(1 - age, 2))
            const hx = shoot.x + Math.cos(shoot.angle) * travelled
            const hy = shoot.y + Math.sin(shoot.angle) * travelled
            const tail = 120 + 90 * Math.sin(Math.PI * age)
            const tx = hx - Math.cos(shoot.angle) * tail
            const ty = hy - Math.sin(shoot.angle) * tail
            const fade = Math.sin(Math.PI * age)

            const trail = context.createLinearGradient(tx, ty, hx, hy)
            trail.addColorStop(0, `rgba(${colours.glow}, 0)`)
            trail.addColorStop(1, `rgba(${colours.glow}, ${0.85 * fade})`)
            context.globalAlpha = 1
            context.strokeStyle = trail
            context.lineWidth = 1.6
            context.beginPath()
            context.moveTo(tx, ty)
            context.lineTo(hx, hy)
            context.stroke()

            context.globalAlpha = fade
            context.fillStyle = '#ffffff'
            context.beginPath()
            context.arc(hx, hy, 1.7, 0, Math.PI * 2)
            context.fill()
          }
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

            for (const spoke of web.spokes) {
              const distance = BLOOM_RADIUS * spoke.reach * spread
              const px = web.x + Math.cos(spoke.angle) * distance
              const py = web.y + Math.sin(spoke.angle) * distance
              context.globalAlpha = fade * 0.85
              context.save()
              context.translate(px, py)
              // Turned by how far it has flown, so the petals tumble outwards.
              // Pointing the way it flew, and turning a little as it goes.
              context.rotate(spoke.angle + Math.PI / 2 + spread * 1.6)
              context.scale(11 * (1 - t * 0.35), 11 * (1 - t * 0.35))
              context.fillStyle = petalFill
              petalPath(context)
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
      petalFill = makePetalFill()
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

  return (
    <>
      {/* The deep sky: clouds of light the stars sit in. CSS rather than
          canvas — these are three enormous soft gradients, and painting them
          every frame would cost more than everything else here put together,
          where the compositor can keep them as layers and simply move them. */}
      <div className="space-deep" aria-hidden="true">
        <span className="space-cloud is-one" />
        <span className="space-cloud is-two" />
        <span className="space-cloud is-three" />
      </div>
      <canvas ref={canvasRef} className="space-field" aria-hidden="true" />
    </>
  )
}
