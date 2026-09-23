import { useEffect, useState } from 'react'
import { navSections, profile } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './Navbar.css'

// A small head crop, so the nav does not pull the full-size portrait down for
// a 32px circle. The tab icon is the "J" mark in public/, not this.
const LOGO = `${import.meta.env.BASE_URL}logo.png`

export default function Navbar() {
  const t = useLocale()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="shell nav-inner">
        <a className="nav-brand" href="#top">
          <img className="nav-mark" src={LOGO} alt="" width="180" height="180" />
          <strong className="nav-brand-name">{profile.name}</strong>
        </a>

        <nav className="nav-links" aria-label={t.a11y.sections}>
          {navSections.map((section) => (
            <a key={section} href={`#${section}`}>
              {t.nav[section]}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
