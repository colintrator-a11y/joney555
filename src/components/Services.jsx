import { serviceIds } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './Services.css'

export default function Services() {
  const t = useLocale()

  return (
    <section className="section" id="services">
      <div className="shell">
        <div className="section-head">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2>{t.services.heading}</h2>
          <p className="note">{t.services.note}</p>
        </div>

        <ul className="services-grid">
          {serviceIds.map((id, index) => (
            <li key={id} className="card service-card" data-tilt data-reveal>
              <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{t.services.items[id].title}</h3>
              <p>{t.services.items[id].body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
