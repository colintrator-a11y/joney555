import { useEffect, useState } from 'react'
import { navSections, profile } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'
// The spider in its ring: the same mark as the tab icon and the loader.
import LOGO from '../assets/logo.webp'

// How far below the top of the window a section counts as "the one being
// read": the dock's own height plus a little, so a heading that has just
// slipped under the pill is not still the active one.
const SPY_OFFSET = 96

const icon = (paths) => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
)

// One per entry in navSections. Drawn rather than imported: six line icons are
// smaller than any icon package, and they inherit the dock's colour.
const ICONS = {
  about: icon(<><circle cx="12" cy="8" r="3.4" /><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" /></>),
  services: icon(<><path d="m14.7 6.3 3 3" /><path d="M20.5 7.5a3.9 3.9 0 0 1-5.2 3.7L7 19.5a2 2 0 0 1-2.8-2.8l8.3-8.3a3.9 3.9 0 0 1 5-5l-2.8 2.8 2.3 2.3 2.8-2.8c.4.6.7 1.4.7 2.3Z" /></>),
  skills: icon(<><path d="m8.5 8.5-3.5 3.5 3.5 3.5" /><path d="m15.5 8.5 3.5 3.5-3.5 3.5" /><path d="m13.5 5.5-3 13" /></>),
  work: icon(<><rect x="3" y="7.5" width="18" height="12" rx="2.2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" /><path d="M3 12.5h18" /></>),
  experience: icon(<><circle cx="12" cy="12" r="8.2" /><path d="M12 7.6V12l2.8 1.8" /></>),
  contact: icon(<><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="m3.8 7 7.1 5.2a2 2 0 0 0 2.2 0L20.2 7" /></>),
}

// Shared by every circle in the dock, including the theme toggle.
export const DOCK_BUTTON =
  'group relative grid h-9 w-9 place-items-center rounded-full text-[var(--ink-soft)] ' +
  // Hover only lightens: the buttons hold still, since a tilt towards the
  // pointer read as the icons slipping out of line.
  'transition-[background-color,color,box-shadow] duration-200 ' +
  'hover:bg-[var(--bg-sunken)] hover:text-[var(--ink)] '  +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-[var(--accent)] sm:h-10 sm:w-10'

// Hover label. Hidden from assistive tech, which reads the aria-label instead,
// and never shown on a touch screen, where there is no hover to show it on.
function Tip({ children }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-[calc(100%+10px)] left-1/2 hidden -translate-x-1/2
                 scale-95 rounded-md bg-[var(--ink)] px-2 py-1 text-[0.68rem] font-medium whitespace-nowrap
                 text-[var(--bg)] opacity-0 shadow-md transition duration-150
                 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100
                 group-focus-visible:opacity-100 sm:block"
    >
      {children}
    </span>
  )
}

export default function Navbar() {
  const t = useLocale()
  const [active, setActive] = useState(null)

  useEffect(() => {
    // Which section is being read. Measured on scroll rather than with an
    // observer: the sections are different heights, so "the last one whose top
    // has passed the dock" matches what the eye sees better than whichever
    // happens to intersect most.
    const onScroll = () => {
      let current = null
      for (const id of navSections) {
        const node = document.getElementById(id)
        if (node && node.getBoundingClientRect().top <= SPY_OFFSET) current = id
      }
      // The last section cannot reach the top of a short page; at the bottom
      // it is the one being looked at whatever the measurement says.
      const atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      setActive(atEnd ? navSections[navSections.length - 1] : current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    // Sticky rather than fixed: the pill still takes its own height in the
    // flow, so nothing has to be padded out of the way underneath it.
    <header className="nav-shell sticky top-3 z-50 flex justify-center px-3">
      <nav
        aria-label={t.a11y.sections}
        className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border
                   border-[var(--line)] bg-[var(--bg-raised)]/85 px-1.5 py-1.5
                   shadow-[0_16px_44px_-18px_rgba(0,0,0,0.85),0_0_28px_-10px_rgba(var(--glow),0.55)]
                   ring-1 ring-[rgba(var(--glow),0.22)] backdrop-blur-xl
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden sm:gap-1 sm:px-2"
      >
        <a href="#top" aria-label={profile.name} className={DOCK_BUTTON}>
          <img src={LOGO} alt="" width="24" height="24" className="h-[24px] w-[24px] rounded-full" />
          <Tip>{profile.name}</Tip>
        </a>

        <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-[var(--line)]" />

        {navSections.map((section) => (
          <a
            key={section}
            href={`#${section}`}
            aria-label={t.nav[section]}
            aria-current={active === section ? 'true' : undefined}
            className={
              active === section
                ? `${DOCK_BUTTON} bg-[var(--accent)] text-[#04111f] shadow-[0_0_24px_-2px_rgba(var(--glow),0.95)] hover:bg-[var(--accent)] hover:text-[#04111f]`
                : DOCK_BUTTON
            }
          >
            {ICONS[section]}
            <Tip>{t.nav[section]}</Tip>
          </a>
        ))}

        <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-[var(--line)]" />

        <ThemeToggle />
      </nav>
    </header>
  )
}
