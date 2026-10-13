import { useMemo } from 'react'
import body from '../assets/spider-body.webp'
import './SpiderMark.css'

/**
 * The spider, on its own: the artwork's two spheres for a body, and eight legs
 * drawn around them so they can move.
 *
 * The legs have to be drawn rather than kept as part of the picture — a
 * painted leg cannot be lifted. Each is a path with a knee, rooted at the
 * shoulder, inside a group that rocks a few degrees about the body. The groups
 * are given alternating phases, so the legs on one side lift while the ones
 * opposite them are down, which is how a spider actually carries itself.
 */

// Each leg, as offsets from the shoulder: where it leaves the body, where its
// knee rides, and where its foot lands. Written out rather than computed from
// an angle because a spider's legs are not evenly spaced — the front pair is
// long and reaches high, the back pair is short and trails.
const LEGS = [
  { root: [16, -8], knee: [56, -34], foot: [82, 6] },
  { root: [19, 0], knee: [64, -16], foot: [95, 28] },
  { root: [19, 10], knee: [61, 10], foot: [90, 52] },
  { root: [15, 19], knee: [48, 30], foot: [73, 64] },
]

// The shoulder: the middle of the cephalothorax, which is the upper of the
// artwork's two spheres.
const CENTRE = 100
const SHOULDER_Y = 72

export default function SpiderMark({ label }) {
  const legs = useMemo(() => {
    const out = []
    for (const side of [-1, 1]) {
      LEGS.forEach((leg, index) => {
        const px = (pair) => CENTRE + side * pair[0]
        const py = (pair) => SHOULDER_Y + pair[1]
        out.push({
          key: `${side}-${index}`,
          // Two straight segments meeting at a knee, not one smooth arc: the
          // arc read as a rib, and what makes a leg look like a leg is the
          // joint halfway along it.
          thigh: `M${px(leg.root).toFixed(1)} ${py(leg.root).toFixed(1)} L${px(leg.knee).toFixed(1)} ${py(leg.knee).toFixed(1)}`,
          shin: `M${px(leg.knee).toFixed(1)} ${py(leg.knee).toFixed(1)} L${px(leg.foot).toFixed(1)} ${py(leg.foot).toFixed(1)}`,
          root: [px(leg.root), py(leg.root)],
          knee: [px(leg.knee), py(leg.knee)],
          foot: [px(leg.foot), py(leg.foot)],
          // Diagonal pairs move together, as a walking spider's do.
          step: (index + (side === 1 ? 2 : 0)) % 4,
        })
      })
    }
    return out
  }, [])

  return (
    <span className="spider-mark" role="img" aria-label={label}>
      <svg className="spider-mark-legs" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          {/* The artwork's legs are glossy capsules: a bright edge along the
              top, full colour through the middle, and a dark underside. Three
              stops rather than two, because what reads as 3D is the highlight
              sitting off-centre. */}
          <linearGradient id="spider-leg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0" stopColor="#bfe6ff" />
            <stop offset="0.28" stopColor="#4aa6f5" />
            <stop offset="0.72" stopColor="#1559b8" />
            <stop offset="1" stopColor="#0a2b63" />
          </linearGradient>
        </defs>

        {legs.map((leg) => (
          <g key={leg.key} className="spider-leg" style={{ '--step': leg.step }}>
            {/* Each segment is built up the way the artwork paints it: a dark
                casing, the blue capsule inside it, and a specular line along
                the top. The thigh is heavier than the shin, as it tapers. */}
            <path d={leg.thigh} className="spider-leg-shade is-thigh" />
            <path d={leg.shin} className="spider-leg-shade" />
            <path d={leg.thigh} className="spider-leg-lit is-thigh" />
            <path d={leg.shin} className="spider-leg-lit" />
            <path d={leg.thigh} className="spider-leg-gloss is-thigh" />
            <path d={leg.shin} className="spider-leg-gloss" />

            {/* The dark joints: one where the leg leaves the body, one at the
                knee, and a claw at the foot. */}
            <circle cx={leg.root[0]} cy={leg.root[1]} r="4" className="spider-leg-joint" />
            <circle cx={leg.knee[0]} cy={leg.knee[1]} r="3.4" className="spider-leg-joint" />
            <circle cx={leg.foot[0]} cy={leg.foot[1]} r="1.7" className="spider-leg-claw" />
          </g>
        ))}
      </svg>

      <img className="spider-mark-body" src={body} alt="" width="240" height="339" />
    </span>
  )
}
