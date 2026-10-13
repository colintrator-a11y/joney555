import { useLocale } from '../i18n/LocaleContext.jsx'
import './Experience.css'

export default function Experience() {
  const t = useLocale()

  return (
    <section className="section" id="experience">
      <div className="shell">
        <div className="section-head">
          <span className="eyebrow">{t.experience.eyebrow}</span>
          <h2>{t.experience.heading}</h2>
        </div>

        <ol className="timeline">
          <li className="timeline-item">
            <div className="timeline-period">{t.experience.period}</div>
            <div className="card timeline-card" data-tilt="soft" data-reveal>
              <h3>{t.experience.role}</h3>
              <p className="timeline-company">{t.experience.company}</p>
              <ul>
                {t.experience.points.map((point) => (
                  <li key={point.slice(0, 24)}>{point}</li>
                ))}
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
