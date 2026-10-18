import { useEffect, useRef } from 'react'
import './ScrollProgress.css'

/**
 * A thin bar along the top of the window that fills as the page is read.
 * Set straight on the element's style from the scroll, once a frame at most,
 * rather than through React state: a re-render per scroll event would be
 * work for nothing.
 */
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined
    let queued = 0
    const update = () => {
      queued = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      bar.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => { if (!queued) queued = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(queued)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  )
}
