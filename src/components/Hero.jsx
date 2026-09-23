import { useState } from 'react'
import { profile, stats } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './Hero.css'

// Lives in public/ so it can be swapped without touching the build.
const AVATAR = `${import.meta.env.BASE_URL}avatar.jpg`

export default function Hero() {
  const t = useLocale()
  // If the portrait is ever missing we fall back to the monogram rather than
  // showing a broken image.
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <section className="hero" id="top">
      <div className="shell hero-inner">
        <div className="hero-main">
          <p className="hero-status">
            <span className="dot" aria-hidden="true" />
            {t.hero.status}
          </p>

          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-title">{t.hero.title}</p>
          <p className="hero-tagline">{t.hero.tagline}</p>
          <p className="hero-note">{t.hero.note}</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              {t.hero.cta}
            </a>
          </div>
        </div>

        <aside className="hero-portrait">
          <div className="portrait-frame">
            {hasPhoto ? (
              <img
                src={AVATAR}
                alt={`${profile.name}, ${t.hero.title}`}
                width="900"
                height="1125"
                onError={() => setHasPhoto(false)}
              />
            ) : (
              <span className="portrait-mark" aria-hidden="true">J</span>
            )}
          </div>
          <p className="portrait-caption">
            {t.hero.caption} · <span>{t.hero.captionValue}</span>
          </p>
        </aside>
      </div>

      <div className="shell">
        <ul className="hero-stats">
          {stats.map((stat) => (
            <li key={stat.id}>
              <strong>{stat.value}</strong>
              <span>{t.hero.stats[stat.id]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
