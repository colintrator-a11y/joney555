import { navSections, profile } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import logo from '../assets/logo.webp'
import './Footer.css'

export default function Footer() {
  const t = useLocale()

  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-mark">
          <img src={logo} alt="" width="44" height="44" loading="lazy" />
          <p className="footer-brand">
            <strong>{profile.name}</strong>
            <span>{t.footer.role}</span>
          </p>
        </div>

        <nav className="footer-links" aria-label={t.a11y.footer}>
          {navSections.map((section) => (
            <a key={section} href={`#${section}`}>{t.nav[section]}</a>
          ))}
        </nav>

        <p className="footer-meta">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
