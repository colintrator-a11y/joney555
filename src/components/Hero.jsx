import { useEffect, useRef, useState } from 'react'
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

// How long each word holds, and how long the secret one does.
const HOLD_MS = 10000
// Clicks further apart than this start the count again: four deliberate
// clicks, not four over the course of a visit.
const CLICK_GAP_MS = 1500

export default function Hero() {
  const t = useLocale()

  // The name, then the headline's stack, one after another.
  const words = [profile.name, ...t.hero.cycle]
  const [index, setIndex] = useState(0)
  const [secret, setSecret] = useState(false)
  const clicks = useRef({ count: 0, last: 0 })
  // Which rail channel just copied its address, for the label to say so.
  const [copied, setCopied] = useState(null)

  // A mailto link does nothing for a visitor with no mail app set up, so the
  // address goes on the clipboard as well as to the mail app: one of the two
  // always works. The link still follows, so nothing is taken away.
  const onChannelClick = (channel) => {
    if (channel.id !== 'email') return
    navigator.clipboard?.writeText(channel.value).then(
      () => {
        setCopied(channel.id)
        setTimeout(() => setCopied(null), 2200)
      },
      () => {},
    )
  }

  useEffect(() => {
    // The secret word holds for its ten seconds, then the name comes back and
    // the cycle starts again from the top.
    if (secret) {
      const back = setTimeout(() => {
        setSecret(false)
        setIndex(0)
      }, HOLD_MS)
      return () => clearTimeout(back)
    }
    // Movement off, the name stays the name: a heading that keeps changing by
    // itself is motion too.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    // A timeout per word rather than one interval, so every word — including
    // the name after the secret one — gets its whole ten seconds.
    const next = setTimeout(() => setIndex((current) => (current + 1) % words.length), HOLD_MS)
    return () => clearTimeout(next)
  }, [index, secret, words.length])

  const onNameClick = () => {
    const now = performance.now()
    const tally = clicks.current
    tally.count = now - tally.last < CLICK_GAP_MS ? tally.count + 1 : 1
    tally.last = now
    if (tally.count >= 4) {
      tally.count = 0
      setSecret(true)
    }
  }

  return (
    <section className="hero" id="top">
      {/* The rail from the reference: one column of ways to reach me, held at
          the left edge, with a line running down to the page below. */}
      <ul className="social-rail" aria-label={t.contact.form.directTitle}>
        {contactChannels.map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              className={copied === channel.id ? 'is-copied' : undefined}
              aria-label={`${t.contact.channels[channel.id]}: ${channel.value}`}
              onClick={() => onChannelClick(channel)}
              {...(channel.id === 'email' ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {CHANNEL_ICONS[channel.id]}
              </svg>
              {/* What the icon is and where it goes, sliding out on hover:
                  the mark alone does not say it can be clicked. */}
              <span className="social-rail-label" aria-hidden="true">
                <strong>{t.contact.channels[channel.id]}</strong>
                <span>{copied === channel.id ? t.contact.copied : channel.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {/* The label above is decoration to a screen reader; the copy is
          announced here instead. */}
      <p className="sr-only" aria-live="polite">{copied ? t.contact.copied : ''}</p>

      <div className="shell hero-inner">
        <p className="hero-status">
          <span className="dot" aria-hidden="true" />
          {t.hero.status}
        </p>

        {/* Clicks only count towards the secret; there is nothing here to
            operate, so it is not given a button's role. */}
        <div className="hero-name" onClick={onNameClick}>
          {/* The heading itself is live text and always the name; the canvas
              is the picture of it, and the words it cycles through are the
              headline's, which is printed in full just below. */}
          <h1 className="particle-name-text">{profile.name}</h1>
          <ParticleName
            text={secret ? t.hero.secret : words[index]}
            tone={secret ? 'wendy' : 'default'}
          />
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
