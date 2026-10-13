import { useEffect, useRef } from 'react'
import './Galaxy.css'

/**
 * The spiral galaxy the page is set in.
 *
 * Raw WebGL rather than a library: the whole thing is one buffer of points and
 * one draw call, and every particle's orbit is worked out in the vertex
 * shader, so the CPU does nothing per frame but hand over a clock reading.
 * Three.js would do the same job and cost more than the rest of the bundle.
 *
 * The structure is built once, on the CPU: particles are placed along
 * logarithmic spiral arms with scatter that widens as the arms travel out, so
 * the shape reads as an arm rather than a drawn curve. The shader then turns
 * each one about the centre at a rate that falls off with radius — real
 * galaxies rotate differentially, and a disc that turns rigidly looks like a
 * record.
 */

// Counted against the viewport, since a phone draws the same picture smaller.
const COUNT = { desktop: 46000, tablet: 14000, mobile: 4200 }

// One turn at the reference radius, in seconds. Slow enough to be majestic
// rather than seen moving.
const PERIOD = 165

// Four arms, wound as a true logarithmic spiral: the angle grows with the
// *logarithm* of the radius, which is the curve a real galaxy takes — tight
// where it leaves the bulge, opening as it travels out. Angle grown linearly
// with radius, as this did before, gives arms of even curvature that read as
// rings.
const ARMS = 4
const WIND = 1.85 // radians of sweep per e-fold of radius
const R_MIN = 0.055
const TILT = -15 * (Math.PI / 180)
const SQUASH = 0.4 // flatter: a disc seen at a shallow angle

// Star-forming knots strung along each arm. Most of an arm's light comes from
// a handful of these rather than from an even smear.
const KNOTS = 7
const KNOT_SHARE = 0.32

// The lane of dark dust that runs along the inner edge of an arm. Carved by
// leaving stars out of it, since light can only be added, never subtracted.
const LANE_AT = -0.1
const LANE_HALF = 0.035

const VERTEX = `
attribute vec2 aOrbit;      // radius, starting angle
attribute vec3 aColour;
attribute vec2 aDetail;     // size, twinkle seed

uniform float uTime;
uniform vec2 uViewport;     // half width, half height in px
uniform vec2 uParallax;
uniform float uScale;
uniform float uPixelRatio;
uniform float uMotion;

varying vec3 vColour;
varying float vFade;

void main() {
  float radius = aOrbit.x;

  // Differential rotation: the inner disc comes round sooner. Clamped near the
  // core, where the true curve goes to infinity and the particles would smear.
  float rate = 1.0 / (0.34 + 1.5 * radius);
  float wobble = sin(uTime * 1.7 + aDetail.y * 37.0) * 0.012 * uMotion;
  float angle = aOrbit.y + uTime * rate * uMotion + wobble;

  vec2 disc = vec2(cos(angle), sin(angle)) * radius;
  disc.y *= ${SQUASH.toFixed(2)};

  // The whole disc is tipped, so the spiral reads as a plate in space.
  float c = cos(${TILT.toFixed(4)});
  float s = sin(${TILT.toFixed(4)});
  vec2 tilted = vec2(disc.x * c - disc.y * s, disc.x * s + disc.y * c);

  vec2 px = tilted * uScale + uParallax;
  gl_Position = vec4(px / uViewport, 0.0, 1.0);

  // Twinkle, and the outer arms fading into the dark.
  float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aDetail.y) + aDetail.y * 90.0);
  vFade = twinkle * smoothstep(1.12, 0.78, radius);

  gl_PointSize = aDetail.x * uPixelRatio * (0.75 + 0.9 * (1.0 - radius));
  vColour = aColour;
}
`

const FRAGMENT = `
precision mediump float;

varying vec3 vColour;
varying float vFade;

void main() {
  // A soft round grain: hard-edged squares read as pixels, not stars.
  vec2 d = gl_PointCoord - vec2(0.5);
  float r = length(d) * 2.0;
  float glow = 1.0 - smoothstep(0.0, 1.0, r);
  glow *= glow;

  // Premultiplied, and the alpha is the coverage — not 1.0. Written opaque,
  // every particle paints its own square over the page: the dim dust grains,
  // which are the largest points here, came out as dark boxes.
  float a = glow * vFade;
  gl_FragColor = vec4(vColour * a, a);
}
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Surfaced rather than swallowed: a silent failure here is a black page.
    console.error('galaxy shader:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/** A normal-ish random, for scatter that clusters instead of spreading flat. */
const bell = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5

function build(count) {
  const orbit = new Float32Array(count * 2)
  const colour = new Float32Array(count * 3)
  const detail = new Float32Array(count * 2)

  // Where each arm's knots sit. Drawn once per arm so that every particle in
  // a knot agrees on where it is.
  const knots = Array.from({ length: ARMS }, () =>
    Array.from({ length: KNOTS }, () => 0.16 + Math.pow(Math.random(), 0.8) * 0.82),
  )

  for (let i = 0; i < count; i += 1) {
    // Populations in the proportions a galaxy shows: a dense bulge, the arms
    // carrying most of the light, gas in violet patches, dust over all of it,
    // and only a few stars off the disc entirely.
    const roll = Math.random()
    let radius
    let thickness
    let size
    let tint
    let onArm = true

    if (roll < 0.2) {
      // The bulge: a ball of old stars, no spiral in it at all.
      radius = Math.pow(Math.random(), 2.6) * 0.26
      thickness = 0
      size = 0.6 + Math.random() * 1.1
      tint = [0.98, 0.95, 0.86]
      onArm = false
    } else if (roll < 0.8) {
      // The arms: knotted rather than smeared.
      const arm = Math.floor(Math.random() * ARMS)
      radius =
        Math.random() < KNOT_SHARE
          ? knots[arm][Math.floor(Math.random() * KNOTS)] + bell() * 0.15
          : R_MIN + Math.pow(Math.random(), 1.05) * (1 - R_MIN)
      radius = Math.min(Math.max(radius, R_MIN), 1.12)
      thickness = 0.09 + 0.19 * radius
      size = 0.5 + Math.random() * 1.0
      tint = Math.random() < 0.34 ? [0.55, 0.84, 1.0] : [0.88, 0.95, 1.0]
      detail[i * 2 + 1] = arm // stashed so the angle below uses the same arm
    } else if (roll < 0.9) {
      // Gas, lit from inside: violet on the leading edge of the arms, which is
      // where it is in the reference.
      radius = 0.18 + Math.pow(Math.random(), 1.2) * 0.84
      thickness = 0.1 + 0.14 * radius
      size = 1.4 + Math.random() * 3.0
      tint = Math.random() < 0.55 ? [0.46, 0.18, 0.8] : [0.22, 0.32, 0.86]
    } else if (roll < 0.985) {
      // Dust: wide, dim, and what gives an arm its body.
      radius = 0.14 + Math.pow(Math.random(), 1.4) * 0.88
      thickness = 0.12 + 0.16 * radius
      size = 7 + Math.random() * 15
      tint = [0.05, 0.09, 0.24]
    } else {
      // A few stars off the disc. Few on purpose: the sky behind the galaxy is
      // the starfield's job, not this one's.
      radius = Math.random() * 1.1
      thickness = 10
      size = 0.6 + Math.random() * 0.9
      tint = [0.55, 0.7, 0.95]
      onArm = false
    }

    let angle
    if (!onArm) {
      angle = Math.random() * Math.PI * 2
    } else {
      const arm = Math.floor(Math.random() * ARMS) * ((Math.PI * 2) / ARMS)
      // The logarithmic spiral itself.
      const sweep = WIND * Math.log(Math.max(radius, R_MIN) / R_MIN)
      let offset = bell() * thickness

      // The dust lane: anything that would land in it is nudged out, which
      // leaves a dark thread running along the inside of every arm.
      if (Math.abs(offset - LANE_AT) < LANE_HALF) offset += LANE_HALF * 2.2

      angle = arm + sweep + offset
    }

    orbit[i * 2] = radius
    orbit[i * 2 + 1] = angle
    colour[i * 3] = tint[0]
    colour[i * 3 + 1] = tint[1]
    colour[i * 3 + 2] = tint[2]
    detail[i * 2] = size
    detail[i * 2 + 1] = Math.random()
  }

  return { orbit, colour, detail }
}

export default function Galaxy() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    })
    if (!gl) return undefined

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarse = window.matchMedia('(pointer: coarse)')

    const program = gl.createProgram()
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return undefined
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('galaxy link:', gl.getProgramInfoLog(program))
      return undefined
    }
    gl.useProgram(program)

    const width = window.innerWidth
    const count = width < 640 ? COUNT.mobile : width < 1100 ? COUNT.tablet : COUNT.desktop
    const { orbit, colour, detail } = build(count)

    const buffers = []
    const attach = (name, data, size) => {
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
      const location = gl.getAttribLocation(program, name)
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
      buffers.push(buffer)
    }
    attach('aOrbit', orbit, 2)
    attach('aColour', colour, 3)
    attach('aDetail', detail, 2)

    const uniform = (name) => gl.getUniformLocation(program, name)
    const uTime = uniform('uTime')
    const uViewport = uniform('uViewport')
    const uParallax = uniform('uParallax')
    const uScale = uniform('uScale')
    const uPixelRatio = uniform('uPixelRatio')
    const uMotion = uniform('uMotion')

    // Light adds up: this is what makes a dense core burn and a thin arm
    // whisper, rather than every particle painting over the one behind it.
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)

    let ratio = 1
    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * ratio)
      canvas.height = Math.floor(h * ratio)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uViewport, w / 2, h / 2)
      gl.uniform1f(uPixelRatio, ratio)
      // The disc spans most of the window, as in the reference.
      gl.uniform1f(uScale, Math.min(w * 0.56, h * 1.15))
    }

    // Parallax is the galaxy's alone: the starfield in front of it stays put,
    // because a sky that slides with the cursor is distracting.
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    const onPointer = (event) => {
      if (coarse.matches) return
      target.x = ((event.clientX / window.innerWidth) * 2 - 1) * -7
      target.y = ((event.clientY / window.innerHeight) * 2 - 1) * -5
    }

    let frame = 0
    const started = performance.now()
    const draw = (now) => {
      // Time-based, so the rotation is the same on any refresh rate.
      const seconds = (now - started) / 1000
      eased.x += (target.x - eased.x) * 0.08
      eased.y += (target.y - eased.y) * 0.08

      gl.uniform1f(uTime, seconds * ((Math.PI * 2) / PERIOD))
      gl.uniform2f(uParallax, eased.x, eased.y)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, count)

      frame = requestAnimationFrame(draw)
    }

    const start = () => { if (!frame) frame = requestAnimationFrame(draw) }
    const stop = () => { cancelAnimationFrame(frame); frame = 0 }

    resize()
    gl.uniform1f(uMotion, still.matches ? 0 : 1)

    if (still.matches) {
      // One frame, held: the galaxy is still beautiful standing still.
      gl.uniform1f(uTime, 0)
      gl.uniform2f(uParallax, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, count)
    } else {
      start()
    }

    const onVisibility = () => (document.hidden ? stop() : !still.matches && start())
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      for (const buffer of buffers) gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      // Hand the context back rather than leaving it to the browser's limit of
      // sixteen; a hot reload would otherwise exhaust them.
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <div className="galaxy" aria-hidden="true">
      <span className="galaxy-haze" />
      <canvas ref={canvasRef} className="galaxy-disc" />
      <span className="galaxy-core" />
    </div>
  )
}
