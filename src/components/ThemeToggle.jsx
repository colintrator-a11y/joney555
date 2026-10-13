import { useCallback, useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { DOCK_BUTTON } from './Navbar.jsx'

/**
 * The very first paint is handled by the inline script in index.html; this
 * component only keeps the toggle in sync with what that script decided.
 */
function readTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const t = useLocale()
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      /* Private mode blocks storage; the choice simply does not persist. */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = theme === 'dark'
  const label = isDark ? t.a11y.toLight : t.a11y.toDark

  return (
    <button
      type="button"
      className={DOCK_BUTTON}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
