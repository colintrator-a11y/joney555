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

        <div className={`about-grid${certifications.length ? '' : ' is-single'}`}>
          <div className="about-copy">
            <p className="about-lead">{t.about.lead}</p>
            {/* The project count follows the list rather than being typed in,
                so it cannot drift from the number in the hero. */}
            <p>{t.about.reach(projects.length)}</p>

            <h3>{t.about.bestTitle}</h3>
            <ul className="about-best">
              {t.about.best.map((item) => (
                <li key={item.id}>
                  {/* A real anchor: the jump to the work section is the
                      browser's, and the click only sets what it lands on. */}
                  <a href="#work" onClick={() => onFocus(item.id)}>
                    <strong>{item.area}</strong>
                  </a>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>

            <h3>{t.about.approachTitle}</h3>
            <p>{t.about.approach}</p>

            <p className="about-closing">{t.about.closing}</p>
          </div>

          {/* Nothing to list means no column at all, rather than an empty
              box beside the copy. */}
          {certifications.length ? (
            <aside className="about-side">
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
          </aside>
          ) : null}
        </div>
      </div>
    </section>
  )
}
