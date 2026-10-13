import { contactChannels, profile, stats } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import ParticleName from './ParticleName.jsx'
import './Hero.css'

// One line icon per channel, matching the rail in the reference: the mark,
// not a label, with the name carried by aria-label.
const CHANNEL_ICONS = {
  email: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="m3.8 7 7.1 5.2a2 2 0 0 0 2.2 0L20.2 7" />
    </>
  ),
  telegram: <path d="M21 4.5 2.8 11.3l5.6 1.8m12.6-8.6-3 14.4-5-4m8-10.4-9.6 9.2m0 0L8.4 13.1m2 5.2v-5.2" />,
  whatsapp: (
    <>
      <path d="M20.2 11.8a8.2 8.2 0 0 1-12 7.3L3.8 20.4l1.4-4.2a8.2 8.2 0 1 1 15-4.4Z" />
      <path d="M9 9.2c.3 2.2 2.6 4.6 4.9 5 .7.1 1.6-.5 1.8-1.2l-1.8-1-1 .8c-1-.5-1.9-1.4-2.3-2.4l.8-.9-1-1.8c-.7.2-1.5 1-1.4 1.5Z" />
    </>
  ),
}

export default function Hero() {
  const t = useLocale()

  return (
    <section className="hero" id="top">
      {/* The rail from the reference: one column of ways to reach me, held at
          the left edge, with a line running down to the page below. */}
      <ul className="social-rail" aria-label={t.contact.form.directTitle}>
        {contactChannels.map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              aria-label={t.contact.channels[channel.id]}
              title={t.contact.channels[channel.id]}
              {...(channel.id === 'email' ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {CHANNEL_ICONS[channel.id]}
              </svg>
            </a>
          </li>
        ))}
      </ul>

      <div className="shell hero-inner">
        <p className="hero-status">
          <span className="dot" aria-hidden="true" />
          {t.hero.status}
        </p>

        <div className="hero-name">
          {/* The heading itself is live text; the canvas is the picture of it. */}
          <h1 className="particle-name-text">{profile.name}</h1>
          <ParticleName text={profile.name} />
        </div>

        <p className="hero-headline">{t.hero.headline}</p>
        <p className="hero-stack">{t.hero.stack}</p>

        <div className="hero-actions">
          <a className="btn btn-primary" href="#work" data-press>
            {t.hero.cta}
          </a>
          <a className="btn btn-ghost" href="#contact" data-press>
            {t.nav.contact}
          </a>
        </div>

        <ul className="hero-stats">
          {stats.map((stat) => (
            <li key={stat.id} data-tilt="soft">
              <strong>{stat.value}</strong>
              <span>{t.hero.stats[stat.id]}</span>
            </li>
          ))}
        </ul>

        <a className="hero-scroll" href="#about">
          {t.hero.scroll}
          <span className="hero-scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
