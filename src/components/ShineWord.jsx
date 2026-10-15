import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './ShineWord.css'

/**
 * The word for a phone: real letters, lit from within.
 *
 * On a narrow screen the particle swarm has too few points to draw a letter
 * cleanly, so the word is set as type instead. Each letter glows on its own,
 * a wave of light runs through them letter by letter (the swarm's sweep, in
 * type), a halo breathes behind the word and stars twinkle round it.
 *
 * Every new word arrives with the next of a set of entrances — focusing in,
 * cascading, flipping, rising, decoding out of scrambled symbols, or being
 * typed — while the old word rises and dissolves.
 *
 * Decoration only, like the canvas: the heading beside it is the live text.
 */

// Largest the type is set; smaller when a long word has to fit the width.
const MAX_SIZE = 84
// Average advance of a letter in the display face, as a share of its size.
const ADVANCE = 0.6
const STARS = 5
// The entrances, taken in turn: one per word.
const ENTRANCES = ['focus', 'cascade', 'flip', 'rise', 'decode', 'type']
const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&01'
// Gap between one letter starting and the next, per entrance (ms).
const STAGGER = { focus: 45, cascade: 60, flip: 55, rise: 50, decode: 0, type: 85 }

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

/**
 * Scrambled symbols that settle into the word from left to right. Returns
 * the letters to show at this moment.
 */
function useDecode(text, active) {
  const [shown, setShown] = useState(active ? '' : text)
  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text)
      return undefined
    }
    const start = performance.now()
    const settle = 90 // ms between one letter settling and the next
    const lead = 260 // scrambling before the first letter settles
    let frame = 0
    let last = 0
    const tick = (now) => {
      // Re-rolled about every 50ms, not every frame: a flicker, not a blur.
      if (now - last > 50) {
        last = now
        const done = Math.floor((now - start - lead) / settle)
        let out = ''
        for (let i = 0; i < text.length; i += 1) {
          if (i < done || text[i] === ' ') out += text[i]
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        setShown(out)
        if (done >= text.length) return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, active])
  return shown
}

function Word({ text, entrance, size }) {
  const decoded = useDecode(text, entrance === 'decode')
  const letters = entrance === 'decode' ? decoded : text
  const stagger = STAGGER[entrance]
  // The light starts its run through the word once the entrance is over
  // (decoding settles one letter per 90ms, after 260ms of scrambling).
  const settled = entrance === 'decode' ? 560 + text.length * 90 : text.length * stagger + 700
  return (
    <span
      className={`shine-word__text shine-word__text--${entrance}`}
      style={{ fontSize: size, '--settled': `${settled}ms` }}
    >
      {[...letters].map((ch, i) => (
        <span
          key={i}
          className={`shine-word__letter${i === text.length - 1 ? ' shine-word__letter--last' : ''}`}
          style={{ '--i': i, '--stagger': `${stagger}ms` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

export default function ShineWord({ text, tone = 'default' }) {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(0)
  // The word on its way out, kept for the length of its exit.
  const [leaving, setLeaving] = useState(null)
  const shown = useRef(text)
  const turn = useRef(0)
  const [entrance, setEntrance] = useState(ENTRANCES[0])
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
    turn.current = (turn.current + 1) % ENTRANCES.length
    setEntrance(ENTRANCES[turn.current])
    const done = setTimeout(() => setLeaving(null), 600)
    return () => clearTimeout(done)
  }, [text])

  const fit = (word) =>
    width ? Math.min(MAX_SIZE, width / (Math.max(word.length, 4) * ADVANCE)) : MAX_SIZE * 0.6

  return (
    <div ref={boxRef} className={`shine-word shine-word--${tone}`} aria-hidden="true">
      {leaving && (
        <span className="shine-word__leaving" style={{ fontSize: fit(leaving) }}>
          {leaving}
        </span>
      )}
      {/* Keyed by the word, so each new one plays its entrance afresh. */}
      <Word key={text} text={text} entrance={entrance} size={fit(text)} />
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
