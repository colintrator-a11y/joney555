import { useMemo } from 'react'

/**
 * The emblem in the About section: a web, spun from the middle out, with the
 * mark sitting at its centre the way its maker would.
 *
 * The same geometry the click effect draws on the canvas — spokes, and spiral
 * threads strung between them that hang rather than cut straight — so the
 * page's two webs are recognisably the same web. By day, in lilac, the same
 * figure reads as a flower rather than a trap.
 *
 * Drawn as SVG rather than a stack of rotated rings: a thread here is one
 * path, where in CSS it was a whole element, and the shape stays exact at any
 * size instead of depending on how the browser rounds a border radius.
 */

const SPOKES = 12
const RINGS = 5
const RADIUS = 92
const CENTRE = 100
// How far a thread sags between two spokes, as a fraction of its radius. A
// real orb web is strung slack; drawn taut it looks like a dartboard.
const SAG = 0.9

const point = (angle, radius) => [
  CENTRE + Math.cos(angle) * radius,
  CENTRE + Math.sin(angle) * radius,
]

export default function WebEmblem({ mark }) {
  const { spokes, threads } = useMemo(() => {
    // Starting a twelfth of a turn round puts a spoke either side of vertical
    // rather than one straight up the middle of the mark.
    const angles = Array.from(
      { length: SPOKES },
      (_, i) => (i / SPOKES) * Math.PI * 2 + Math.PI / SPOKES,
    )

    const spokeLines = angles.map((angle) => {
      const [x, y] = point(angle, RADIUS)
      return `M ${CENTRE} ${CENTRE} L ${x.toFixed(2)} ${y.toFixed(2)}`
    })

    // One path per ring: every segment of it is a curve from one spoke to the
    // next, pulled in towards the middle.
    const ringPaths = Array.from({ length: RINGS }, (_, ring) => {
      const radius = RADIUS * (0.26 + (ring / (RINGS - 1)) * 0.74)
      const [startX, startY] = point(angles[0], radius)
      let path = `M ${startX.toFixed(2)} ${startY.toFixed(2)}`
      for (let i = 0; i < angles.length; i += 1) {
        const from = angles[i]
        const to = angles[(i + 1) % angles.length] + (i === angles.length - 1 ? Math.PI * 2 : 0)
        const [cx, cy] = point((from + to) / 2, radius * SAG)
        const [x, y] = point(to, radius)
        path += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`
      }
      return { path, ring }
    })

    return { spokes: spokeLines, threads: ringPaths }
  }, [])

  return (
    <span className="web-emblem">
      <svg viewBox="0 0 200 200" aria-hidden="true" className="web-emblem-art">
        <g className="web-emblem-turn">
          <g className="web-emblem-spokes">
            {spokes.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          <g className="web-emblem-threads">
            {threads.map(({ path, ring }) => (
              <path key={ring} d={path} style={{ '--ring': ring }} />
            ))}
          </g>

          {/* Dew, caught on three of the threads. */}
          <g className="web-emblem-dew">
            {[
              [Math.PI / SPOKES, RADIUS * 0.63],
              [Math.PI * 1.08, RADIUS * 0.82],
              [Math.PI * 1.72, RADIUS * 0.45],
            ].map(([angle, radius], index) => {
              const [x, y] = point(angle, radius)
              return <circle key={angle} cx={x} cy={y} r="2.4" style={{ '--dew': index }} />
            })}
          </g>
        </g>
      </svg>

      <span className="web-emblem-mark">{mark}</span>
    </span>
  )
}
