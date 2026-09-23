import { certifications, projects } from '../data/profile.js'
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

        {/* The opening claim and the figure behind it, side by side: the lead
            reads as the statement, the note as its evidence. */}
        <div className="about-intro">
          <p className="about-lead">{t.about.lead}</p>
          {/* The project count follows the list rather than being typed in,
              so it cannot drift from the number in the hero. */}
          <p className="about-reach">{t.about.reach(projects.length)}</p>
        </div>

        <h3 className="about-subhead">{t.about.bestTitle}</h3>
        <ul className="about-best">
          {t.about.best.map((item) => (
            <li key={item.id}>
              {/* A real anchor: the jump to the work section is the browser's,
                  and the click only sets what it lands on. The whole card is
                  the link, so the target is a card rather than two words. */}
              <a className="card about-best-card" href="#work" onClick={() => onFocus(item.id)}>
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
          <div className="card about-panel">
            <h3>{t.about.approachTitle}</h3>
            <p>{t.about.approach}</p>
            <p className="about-closing">{t.about.closing}</p>
          </div>

          {/* Nothing to list means no panel, rather than a heading over an
              empty box. */}
          {certifications.length ? (
            <div className="card about-panel">
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
