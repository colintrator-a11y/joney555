/**
 * The logo, built in three dimensions: the spider from the mark — two glossy
 * blue spheres, eight jointed legs, two lit eyes — on a web of light inside a
 * glowing ring, with the four bright points that travel round it.
 *
 * Everything is made here from geometry; there is no model file. The layout is
 * the mark's, seen from above: the abdomen is the larger sphere at the top, the
 * head the smaller one below it with the eyes, and the legs arch out to either
 * side and come down to black-tipped feet.
 *
 * Loaded on its own, only when the About section is close, so the page's first
 * paint never waits for three.js.
 */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// The logo's colours, sampled from the artwork.
const SHELL = '#0b48f0' // the spider's glass-blue body
const RING = '#2f8bff' // the ring's neon
const THREAD = '#c8def8' // the web: the silvery blue used for every web on the page
const EYE = '#bff4ff'

// Each right-side leg, as points from the shoulder out to the foot. The left
// side is the mirror. Written out rather than generated: the front pair reaches
// up past the head, the back pair trails down, as in the mark.
const LEGS = [
  [[0.42, 0.62, 0], [0.92, 1.22, 0.32], [1.42, 1.3, 0.3], [1.68, 0.78, 0.1]],
  [[0.62, 0.24, 0], [1.24, 0.62, 0.36], [1.86, 0.5, 0.3], [2.04, -0.02, 0.1]],
  [[0.6, -0.26, 0], [1.24, -0.18, 0.36], [1.86, -0.46, 0.3], [1.94, -0.98, 0.1]],
  [[0.36, -0.78, 0], [0.92, -0.9, 0.34], [1.34, -1.3, 0.24], [1.24, -1.76, 0.06]],
]

/** A soft round light, drawn once and used for every glow in the scene. */
function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const g = canvas.getContext('2d')
  const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.18, 'rgba(200,235,255,0.85)')
  gradient.addColorStop(0.45, 'rgba(60,140,255,0.28)')
  gradient.addColorStop(1, 'rgba(0,80,255,0)')
  g.fillStyle = gradient
  g.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * The colour a glowing material takes on the light page. By night these add
 * light to the dark sky; by day there is no dark to add to, and white light on
 * a pale page vanishes, so the same parts are painted in the day theme's
 * blues instead (see applyTheme in mountSpiderLogo).
 */
function byDay(material, colour) {
  material.userData.day = colour
  return material
}

function glow(texture, colour, size, opacity = 1, day = '#0b6cf0') {
  const sprite = new THREE.Sprite(
    byDay(
      new THREE.SpriteMaterial({
        map: texture,
        color: colour,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      day,
    ),
  )
  sprite.scale.setScalar(size)
  return sprite
}

/** The web behind the spider: spokes, sagging spiral threads, and the cross of light. */
/** A four-pointed glint, for the crossings of the web's threads. */
function glintTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const g = canvas.getContext('2d')
  const core = g.createRadialGradient(32, 32, 0, 32, 32, 14)
  core.addColorStop(0, 'rgba(255,255,255,1)')
  core.addColorStop(0.4, 'rgba(200,222,248,0.7)')
  core.addColorStop(1, 'rgba(90,160,255,0)')
  g.fillStyle = core
  g.fillRect(0, 0, 64, 64)
  for (const horizontal of [true, false]) {
    const ray = horizontal ? g.createLinearGradient(0, 0, 64, 0) : g.createLinearGradient(0, 0, 0, 64)
    ray.addColorStop(0, 'rgba(200,222,248,0)')
    ray.addColorStop(0.5, 'rgba(255,255,255,1)')
    ray.addColorStop(1, 'rgba(200,222,248,0)')
    g.fillStyle = ray
    if (horizontal) g.fillRect(0, 31, 64, 2.4)
    else g.fillRect(31, 0, 2.4, 64)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function buildWeb() {
  const points = []
  // Every crossing of a spiral thread and a spoke, for the glints.
  const junctions = []
  const SPOKES = 8
  const RINGS = 4
  const RADIUS = 2.45
  for (let i = 0; i < SPOKES; i += 1) {
    const a = (i / SPOKES) * Math.PI * 2 + Math.PI / 8
    points.push(0, 0, 0, Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 0)
  }
  // Each spiral thread is a shallow curve between two spokes, pulled inwards.
  for (let r = 1; r <= RINGS; r += 1) {
    const radius = (r / RINGS) * RADIUS * 0.96
    for (let i = 0; i < SPOKES; i += 1) {
      const a0 = (i / SPOKES) * Math.PI * 2 + Math.PI / 8
      junctions.push(new THREE.Vector3(Math.cos(a0) * radius, Math.sin(a0) * radius, 0))
      const a1 = ((i + 1) / SPOKES) * Math.PI * 2 + Math.PI / 8
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(Math.cos(a0) * radius, Math.sin(a0) * radius, 0),
        new THREE.Vector3(Math.cos((a0 + a1) / 2) * radius * 0.8, Math.sin((a0 + a1) / 2) * radius * 0.8, 0),
        new THREE.Vector3(Math.cos(a1) * radius, Math.sin(a1) * radius, 0),
      )
      const along = curve.getPoints(10)
      for (let k = 0; k < along.length - 1; k += 1) {
        points.push(along[k].x, along[k].y, 0, along[k + 1].x, along[k + 1].y, 0)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  const web = new THREE.LineSegments(
    geometry,
    byDay(
      new THREE.LineBasicMaterial({
        color: THREAD,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      '#3d7fd9',
    ),
  )
  web.position.z = -0.55
  return { web, junctions }
}

/** The ring the mark sits in: a neon band, a thinner one inside it, and their glow. */
function buildRing(texture) {
  const group = new THREE.Group()
  const neon = byDay(new THREE.MeshBasicMaterial({ color: RING }), '#0b6cf0')
  const band = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.075, 16, 160), neon)
  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.03, 12, 160),
    byDay(new THREE.MeshBasicMaterial({ color: RING, transparent: true, opacity: 0.55 }), '#5aa2f5'),
  )
  // The haze around the band: a wide, faint torus added on top of the sky.
  const haze = new THREE.Mesh(
    new THREE.TorusGeometry(2.72, 0.32, 16, 160),
    byDay(
      new THREE.MeshBasicMaterial({
        color: RING,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      '#cfe3ff',
    ),
  )
  group.add(haze, band, inner)

  // The four points of light that ride the ring.
  const orbs = []
  for (let i = 0; i < 4; i += 1) {
    const orb = new THREE.Group()
    orb.add(glow(texture, '#ffffff', 0.95, 1, '#22b8f0'), glow(texture, '#4aa8ff', 2.1, 0.55, '#0b6cf0'))
    group.add(orb)
    orbs.push(orb)
  }

  // The cross of light the mark is pinned on, thin and fading at its ends.
  const flare = new THREE.Group()
  for (const angle of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) {
    const long = angle % (Math.PI / 2) === 0
    const geometry = new THREE.PlaneGeometry(long ? 7.4 : 5.6, long ? 0.035 : 0.022)
    const colours = []
    const position = geometry.attributes.position
    // The fade is in the alpha, not the colour. Faded by darkening, the ends
    // still covered the page behind the canvas: dark lines over the night sky,
    // black ones on the pale day page.
    for (let i = 0; i < position.count; i += 1) {
      const fade = Math.max(0, 1 - Math.abs(position.getX(i)) / (long ? 3.7 : 2.8))
      colours.push(0.55, 0.8, 1, fade)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colours, 4))
    const line = new THREE.Mesh(
      geometry,
      byDay(
        new THREE.MeshBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: long ? 0.8 : 0.45,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
        '#7fb2ee',
      ),
    )
    line.rotation.z = angle
    flare.add(line)
  }
  flare.position.z = -0.6
  group.add(flare)

  return { group, orbs }
}

/** The spider: glass-blue spheres on dark joints, with lit eyes. */
function buildSpider(texture) {
  const spider = new THREE.Group()

  const shell = new THREE.MeshPhysicalMaterial({
    color: SHELL,
    roughness: 0.18,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    emissive: '#0638d6',
    emissiveIntensity: 0.32,
  })
  const joint = new THREE.MeshPhysicalMaterial({
    color: '#010205',
    roughness: 0.3,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })

  const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.8, 64, 48), shell)
  abdomen.position.set(0, 0.26, 0.05)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 36), shell)
  head.position.set(0, -0.66, 0.18)
  // The waist between them, dark, as the logo's is.
  const waist = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 18), joint)
  waist.position.set(0, -0.28, 0)
  spider.add(waist, abdomen, head)

  // Eyes: two small lit lenses on the front of the head, each with its glow.
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 20, 14),
      new THREE.MeshBasicMaterial({ color: EYE }),
    )
    eye.position.set(side * 0.18, -0.72, 0.62)
    const halo = glow(texture, '#7fdcff', 0.55, 1, '#38bdf8')
    halo.position.copy(eye.position).add(new THREE.Vector3(0, 0, 0.05))
    spider.add(eye, halo)
  }

  // The legs. Each is one smooth tube through its points, ringed with dark
  // joints at the knees and capped with a dark foot, inside a group pivoted
  // at the shoulder so it can step.
  const legs = []
  LEGS.forEach((leg, index) => {
    for (const side of [-1, 1]) {
      const pts = leg.map(([x, y, z]) => new THREE.Vector3(side * x, y, z))
      const root = pts[0].clone()
      const local = pts.map((p) => p.clone().sub(root))
      const pivot = new THREE.Group()
      pivot.position.copy(root)

      const curve = new THREE.CatmullRomCurve3(local, false, 'centripetal')
      pivot.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.12, 14, false), shell))

      // A dark band at each knee, and a dark tip at the foot.
      for (const at of [1, 2]) {
        const band = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 14), joint)
        band.position.copy(local[at])
        band.scale.set(1, 1, 0.85)
        pivot.add(band)
      }
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 14), joint)
      foot.position.copy(local[3])
      pivot.add(foot)

      spider.add(pivot)
      // Diagonal pairs step together, as a walking spider's do.
      legs.push({ pivot, side, phase: ((index + (side === 1 ? 2 : 0)) % 4) * (Math.PI / 2) })
    }
  })

  // A blue light under the body, so the spider seems lit from within the web.
  const under = glow(texture, '#2a7bff', 3.4, 0.35, '#cfe3ff')
  under.position.set(0, -0.1, -0.4)
  spider.add(under)

  return { spider, legs }
}

/**
 * Starts the scene on a canvas. Returns a stop function that releases
 * everything it made.
 */
export function mountSpiderLogo(canvas, { still = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95

  const scene = new THREE.Scene()
  // Reflections for the glass: a studio room, prefiltered once.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = environment
  // Enough of the room for highlights on the glass, not so much that the
  // blue washes out to the room's white.
  scene.environmentIntensity = 0.32

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0, 12.4)

  scene.add(new THREE.AmbientLight('#335', 0.6))
  const key = new THREE.DirectionalLight('#ffffff', 1.6)
  key.position.set(-3, 4, 6)
  const rim = new THREE.PointLight('#3d8bff', 40, 14)
  rim.position.set(2.5, -2, -2.5)
  const front = new THREE.PointLight('#8fd6ff', 14, 10)
  front.position.set(0, -1.5, 4)
  scene.add(key, rim, front)

  const texture = glowTexture()
  const world = new THREE.Group()
  const { web, junctions } = buildWeb()
  // A glint on each crossing, each with its own twinkle.
  const glintMap = glintTexture()
  const glints = junctions.map((at, i) => {
    const sprite = glow(glintMap, '#ffffff', 0.5, 1, '#0b6cf0')
    sprite.position.copy(at)
    sprite.userData.phase = i * 1.37
    web.add(sprite)
    return sprite
  })
  const { group: ring, orbs } = buildRing(texture)
  const { spider, legs } = buildSpider(texture)
  spider.position.z = 0.4
  spider.scale.setScalar(0.86)
  world.add(web, ring, spider)
  scene.add(world)

  const size = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  size()

  // The mark leans towards the pointer, a little, wherever it is on the page.
  const lean = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointer = (event) => {
    const rect = canvas.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth
    const dy = (event.clientY - (rect.top + rect.height / 2)) / window.innerHeight
    lean.tx = Math.max(-1, Math.min(1, dx * 2)) * 0.45
    lean.ty = Math.max(-1, Math.min(1, dy * 2)) * 0.35
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let frame = 0
  let running = false
  const start = performance.now()

  const render = (now) => {
    const t = (now - start) / 1000
    if (!still) {
      lean.x += (lean.tx - lean.x) * 0.05
      lean.y += (lean.ty - lean.y) * 0.05
      // An idle sway under the lean, so it is never quite at rest.
      world.rotation.y = lean.x + Math.sin(t * 0.6) * 0.12
      world.rotation.x = lean.y - 0.12 + Math.sin(t * 0.45) * 0.06
      ring.rotation.z = t * 0.12
      spider.position.y = Math.sin(t * 1.4) * 0.06
      spider.rotation.z = Math.sin(t * 0.7) * 0.04
      for (const leg of legs) {
        leg.pivot.rotation.z = leg.side * Math.sin(t * 3.2 + leg.phase) * 0.07
        leg.pivot.rotation.x = Math.max(0, Math.sin(t * 3.2 + leg.phase)) * 0.12
      }
    } else {
      world.rotation.x = -0.12
    }
    // The glints twinkle, and a slow wave of brightness runs round the web,
    // so the threads shimmer rather than sit still.
    glints.forEach((sprite, i) => {
      const twinkle = still ? 0.7 : 0.5 + 0.5 * Math.sin(t * 3.1 + sprite.userData.phase)
      const angle = Math.atan2(sprite.position.y, sprite.position.x)
      const wave = still ? 0 : Math.max(0, Math.cos(angle - t * 1.2)) ** 6
      sprite.material.opacity = 0.25 + 0.75 * Math.max(twinkle, wave)
      sprite.scale.setScalar(0.32 + 0.38 * twinkle + 0.3 * wave)
    })
    web.material.opacity = still ? 0.6 : 0.5 + 0.15 * Math.sin(t * 1.6)
    orbs.forEach((orb, i) => {
      const a = Math.PI / 4 + (i * Math.PI) / 2 + (still ? 0 : t * 0.35)
      orb.position.set(Math.cos(a) * 2.72, Math.sin(a) * 2.72, 0.1)
      orb.children[1].material.opacity = still ? 0.55 : 0.4 + 0.25 * Math.sin(t * 2 + i)
    })
    renderer.render(scene, camera)
  }

  const loop = (now) => {
    render(now)
    frame = requestAnimationFrame(loop)
  }
  const play = () => {
    if (running || still) return
    running = true
    frame = requestAnimationFrame(loop)
  }
  const pause = () => {
    running = false
    cancelAnimationFrame(frame)
  }

  // Only drawn while on screen; a still render otherwise stands in.
  const watcher = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()))
  watcher.observe(canvas)
  const onResize = () => {
    size()
    if (!running) render(performance.now())
  }
  window.addEventListener('resize', onResize)

  // Night and day. Each marked material keeps its night colour and blending
  // here, and by day takes its day colour with ordinary blending: added light
  // shows on the dark sky but not on the pale page.
  const themed = []
  scene.traverse((node) => {
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (!material?.userData.day || themed.some((t) => t.material === material)) continue
      themed.push({
        material,
        night: { colour: material.color.clone(), blending: material.blending },
        day: { colour: new THREE.Color(material.userData.day), blending: THREE.NormalBlending },
      })
    }
  })
  const applyTheme = () => {
    const light = document.documentElement.dataset.theme === 'light'
    for (const { material, night, day } of themed) {
      const look = light ? day : night
      material.color.copy(look.colour)
      material.blending = look.blending
      material.needsUpdate = true
    }
    // A little less exposure by day, so the glass blue is not lifted to pastel.
    renderer.toneMappingExposure = light ? 0.85 : 0.95
    if (!running) render(performance.now())
  }
  const themeWatch = new MutationObserver(applyTheme)
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  applyTheme()

  render(performance.now())

  return () => {
    pause()
    watcher.disconnect()
    themeWatch.disconnect()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointer)
    scene.traverse((node) => {
      node.geometry?.dispose()
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      materials.forEach((m) => m?.dispose())
    })
    texture.dispose()
    glintMap.dispose()
    environment.dispose()
    pmrem.dispose()
    renderer.dispose()
  }
}
