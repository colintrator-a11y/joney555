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
const COUNT = { desktop: 26000, tablet: 9000, mobile: 3400 }

// One turn at the reference radius, in seconds. Slow enough to be majestic
// rather than seen moving.
const PERIOD = 150

const ARMS = 5
const TWIST = 5.4 // how far an arm wraps over the disc's radius
const TILT = -15 * (Math.PI / 180)
const SQUASH = 0.56 // a disc seen at an angle, not face on

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
  float angle = aOrbit.y + uTime * rate * uMotion;

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
  vFade = twinkle * smoothstep(1.05, 0.72, radius);

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

  for (let i = 0; i < count; i += 1) {
    // Populations, in the proportions a galaxy actually shows: a dense core, a
    // majority in the arms, a scattering of violet, and dust over all of it.
    const roll = Math.random()
    let radius
    let spread
    let size
    let tint

    if (roll < 0.26) {
      // The bulge: dense, small, and it is what makes the centre burn.
      radius = Math.pow(Math.random(), 2.8) * 0.3
      spread = 0.6
      size = 0.7 + Math.random() * 1.5
      tint = [0.95, 0.97, 1.0]
    } else if (roll < 0.72) {
      // The arms: the bulk of the galaxy, fine and close together.
      // Biased inwards: an exponent under one pushes the particles to the
      // rim, which left a dark gap around the bulge and a ring at the edge.
      radius = 0.06 + Math.pow(Math.random(), 1.7) * 0.94
      spread = 0.3
      size = 0.6 + Math.random() * 1.3
      tint = Math.random() < 0.35 ? [0.45, 0.78, 1.0] : [0.76, 0.92, 1.0]
    } else if (roll < 0.85) {
      // Gas, in patches along the arms rather than sprinkled over the disc:
      // violet where it is lit from inside, which is the colour the reference
      // carries through its arms.
      radius = 0.14 + Math.pow(Math.random(), 1.4) * 0.8
      spread = 0.22
      size = 2.5 + Math.random() * 7
      tint = Math.random() < 0.5 ? [0.3, 0.16, 0.52] : [0.2, 0.26, 0.6]
    } else if (roll < 0.95) {
      // Dust: wide, dim, and what gives the arms their body.
      radius = 0.12 + Math.pow(Math.random(), 1.5) * 0.86
      spread = 0.34
      size = 9 + Math.random() * 20
      tint = [0.045, 0.085, 0.22]
    } else {
      // Loose field stars, off the arms entirely.
      radius = Math.random() * 1.06
      spread = 10
      size = 0.6 + Math.random() * 1.0
      tint = [0.5, 0.68, 0.95]
    }

    // A logarithmic arm: angle grows with radius, and the scatter grows with
    // it too, so the arms are tight at the core and frayed at the rim.
    const arm = Math.floor(Math.random() * ARMS) * ((Math.PI * 2) / ARMS)
    const wander = bell() * spread * (0.35 + radius)
    const spiral = arm + radius * TWIST + wander + Math.random() * 0.04
    // Towards the middle the arms give way to the bulge, which has no spiral
    // in it at all; left on the arms it reads as spokes through the centre.
    const bulge = Math.max(0, 1 - radius / 0.3) ** 1.6
    const angle = spiral * (1 - bulge) + Math.random() * Math.PI * 2 * bulge

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
      gl.uniform1f(uScale, Math.min(w * 0.5, h * 0.92))
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
