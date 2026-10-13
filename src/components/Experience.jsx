import { experience } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './Experience.css'

// "2025-01" -> a Date on the first of that month. Built from the parts rather
// than parsed from the string: `new Date('2025-01')` is read as UTC and lands
// in the previous month for anyone west of Greenwich.
const monthStart = (iso) => {
  const [year, month] = iso.split('-').map(Number)
  return new Date(year, month - 1, 1)
}

const MONTH_YEAR = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })

/** Whole months between two dates, counted inclusively as a job would be. */
const monthsBetween = (from, to) =>
  (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1

/** 22 -> "1 yr 10 mos", 12 -> "1 yr", 5 -> "5 mos". */
function duration(total, t) {
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts = []
  if (years) parts.push(`${years} ${years === 1 ? t.experience.year : t.experience.years}`)
  if (months) parts.push(`${months} ${months === 1 ? t.experience.month : t.experience.months}`)
  return parts.join(' ')
}

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
          {experience.map((job) => {
            const copy = t.experience.items[job.id]
            const from = monthStart(job.start)
            // An open-ended role is measured to today, so the current one
            // counts itself up without anyone editing the file.
            const to = job.end ? monthStart(job.end) : new Date()

            return (
              <li key={job.id} className="timeline-item">
                <div className="timeline-period">
                  <span className="timeline-dates">
                    {MONTH_YEAR.format(from)} — {job.end ? MONTH_YEAR.format(to) : t.experience.present}
                  </span>
                  <span className="timeline-length">{duration(monthsBetween(from, to), t)}</span>
                </div>

                <div className="card timeline-card" data-tilt="soft" data-reveal>
                  <h3>{copy.role}</h3>
                  <p className="timeline-company">{job.company}</p>
                  <p className="timeline-meta">
                    {copy.type} · {job.location}
                  </p>

                  <ul>
                    {copy.points.map((point) => (
                      <li key={point.slice(0, 24)}>{point}</li>
                    ))}
                  </ul>

                  {/* The same chips as the skills section: the technologies are
                      proper nouns and read as names, not sentences. */}
                  <ul className="timeline-skills">
                    {job.skills.map((skill) => (
                      <li key={skill} className="chip">{skill}</li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
