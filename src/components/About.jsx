import { certifications, orbitSkills, profile, stats } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './About.css'

export default function About({ onFocus }) {
  const t = useLocale()

  return (
    <section className="section" id="about">
      <div className="shell">
        <div className="section-head">
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2>{t.about.heading}</h2>
        </div>

        {/* The title, as one line of segments: the first is the role, the rest
            are what it is built on. Split here rather than typed with dividers
            so each piece can be styled and wrapped on its own. */}
        <p className="about-headline" data-reveal>
          {t.about.headline.split('|').map((part, index) => (
            <span key={part.trim()} className={index === 0 ? 'is-role' : undefined}>
              {part.trim()}
            </span>
          ))}
        </p>

        {/* The opening claim and the figure behind it, side by side: the lead
            reads as the statement, the note as its evidence. */}
        <div className="about-intro" data-reveal>
          {/* Lives in public/ so it can be swapped without touching the build. */}
          <figure className="about-portrait" data-tilt>
            <span className="about-portrait-frame">
              <img
                src={`${import.meta.env.BASE_URL}avatar.jpg`}
                alt={`${profile.name}, ${t.hero.title}`}
                width="900"
                height="1125"
                loading="lazy"
              />
            </span>

            {/* The stack, hung off the corners of the frame. Decorative: the
                same names are in the Skills section as text. */}
            <span className="about-orbit" aria-hidden="true">
              {orbitSkills.map((skill, index) => (
                <span key={skill} style={{ '--slot': index }}>{skill}</span>
              ))}
            </span>

            <figcaption>{t.hero.captionValue}</figcaption>
          </figure>

          <p className="about-lead">{t.about.lead}</p>
          {/* The same rounded figure the hero shows, read from the same
              place, so the two can never disagree. */}
          <p className="about-reach">
            {t.about.reach(stats.find((stat) => stat.id === 'projects').value)}
          </p>
        </div>

        <h3 className="about-subhead">{t.about.bestTitle}</h3>
        <ul className="about-best">
          {t.about.best.map((item) => (
            <li key={item.id}>
              {/* A real anchor: the jump to the work section is the browser's,
                  and the click only sets what it lands on. The whole card is
                  the link, so the target is a card rather than two words. */}
              <a className="card about-best-card" data-tilt data-reveal href="#work" onClick={() => onFocus(item.id)}>
                <strong>{item.area}</strong>
                <span>{item.detail}</span>
                <span className="about-best-go" aria-hidden="true">
                  {t.about.bestGo}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className={`about-close${certifications.length ? '' : ' is-single'}`}>
          <div className="card about-panel" data-tilt="soft" data-reveal>
            <h3>{t.about.approachTitle}</h3>
            <p>{t.about.approach}</p>
            <p className="about-closing">{t.about.closing}</p>
          </div>

          {/* Nothing to list means no panel, rather than a heading over an
              empty box. */}
          {certifications.length ? (
            <div className="card about-panel" data-tilt="soft" data-reveal>
              <h3>{t.about.certTitle}</h3>
              <ul className="cert-list">
                {certifications.map((certification) => {
                  const copy = t.about.certifications[certification.id]
                  return (
                    <li key={certification.id}>
                      <span className="cert-year">{certification.year}</span>
                      <span className="cert-body">
                        <strong>{copy.name}</strong>
                        <small>{copy.detail}</small>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
