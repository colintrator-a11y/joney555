import { skillGroups } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './Skills.css'

const total = skillGroups.reduce((sum, group) => sum + group.items.length, 0)

export default function Skills() {
  const t = useLocale()

  return (
    <section className="section" id="skills">
      <div className="shell">
        <div className="section-head">
          <span className="eyebrow">{t.skills.eyebrow}</span>
          <h2>{t.skills.heading}</h2>
          <p className="note">{t.skills.note(total, skillGroups.length)}</p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div key={group.id} className="skill-group" data-tilt="soft" data-reveal>
              <h3>{t.skills.groups[group.id]}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item} className="chip">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
