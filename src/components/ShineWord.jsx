import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './ShineWord.css'

/**
 * The word for a phone: real letters, lit from within.
 *
 * On a narrow screen the particle swarm has too few points to draw a letter
 * cleanly, so the word is set as type instead: bright, glowing, with the
 * same band of light sweeping across it as the swarm has on a wide screen,
 * and a few stars twinkling round it. A new word focuses in out of a blur
 * while the old one rises and fades.
 *
 * Decoration only, like the canvas: the heading beside it is the live text.
 */

// Largest the type is set; smaller when a long word has to fit the width.
const MAX_SIZE = 84
// Average advance of a letter in the display face, as a share of its size.
const ADVANCE = 0.6
const STARS = 5

/** A few stars placed round the edges of the word, never over its middle. */
function scatterStars() {
  return Array.from({ length: STARS }, (_, i) => {
    const side = i % 2 === 0
    return {
      left: side ? 4 + Math.random() * 30 : 66 + Math.random() * 30,
      top: Math.random() < 0.5 ? Math.random() * 22 : 74 + Math.random() * 22,
      size: 9 + Math.random() * 9,
      delay: Math.random() * 3.2,
      duration: 2.4 + Math.random() * 2,
    }
  })
}

export default function ShineWord({ text, tone = 'default' }) {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(0)
  // The word on its way out, kept for the length of its exit.
  const [leaving, setLeaving] = useState(null)
  const shown = useRef(text)
  const stars = useMemo(scatterStars, [text])

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return undefined
    setWidth(box.clientWidth)
    const watch = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    watch.observe(box)
    return () => watch.disconnect()
  }, [])

  useEffect(() => {
    if (shown.current === text) return undefined
    setLeaving(shown.current)
    shown.current = text
    const done = setTimeout(() => setLeaving(null), 600)
    return () => clearTimeout(done)
  }, [text])

  const fit = (word) =>
    width ? Math.min(MAX_SIZE, width / (Math.max(word.length, 4) * ADVANCE)) : MAX_SIZE * 0.6

  return (
    <div ref={boxRef} className={`shine-word shine-word--${tone}`} aria-hidden="true">
      {leaving && (
        <span className="shine-word__text shine-word__text--out" style={{ fontSize: fit(leaving) }}>
          {leaving}
        </span>
      )}
      {/* Keyed by the word, so each new one plays its entrance afresh. */}
      <span key={text} className="shine-word__text shine-word__text--in" style={{ fontSize: fit(text) }}>
        {text}
      </span>
      {stars.map((star, i) => (
        <svg
          key={`${text}-${i}`}
          className="shine-word__star"
          viewBox="0 0 24 24"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          <path d="M12 0c.6 6.4 1.9 9.4 2.7 9.3C17 9.6 18.6 11.2 24 12c-5.4.8-7 2.4-9.3 2.7-.8-.1-2.1 2.9-2.7 9.3-.6-6.4-1.9-9.4-2.7-9.3C7 14.4 5.4 12.8 0 12c5.4-.8 7-2.4 9.3-2.7.8.1 2.1-2.9 2.7-9.3Z" />
        </svg>
      ))}
    </div>
  )
}
