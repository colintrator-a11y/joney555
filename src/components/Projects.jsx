import { useEffect, useMemo, useState } from 'react'
import { focusAreas, projects } from '../data/profile.js'
import { projectMedia } from '../data/projectMedia.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import Lightbox from './Lightbox.jsx'
import './Projects.css'

const ALL = 'all'

// How many rows are on the page to begin with, and how many each press of the
// button adds. The rest are a decision the visitor makes, not a download they
// are handed.
const PAGE = 6

// How a row is laid out follows from its media. Three or more images cannot be
// read side by side in half a row, so those projects put the media above the
// text at full width; otherwise the media sits beside it, in a column whose
// width follows the orientation of the first image. `layout: 'stacked'` forces
// the full-width form for media that needs it whatever the count — a flow
// diagram, say, whose labels vanish at half a row.
const rowLayout = (project) => {
  if (project.layout === 'stacked' || project.media.length > 2) return ' is-stacked'
  const [first] = project.media
  return first && first.width > first.height ? ' is-wide' : ''
}

const mediaLayout = (project) => {
  if (project.layout === 'stacked' || project.media.length > 2) return ' is-stacked'
  return project.media.length > 1 ? ' has-gallery' : ''
}

export default function Projects({ focus, onFocusChange }) {
  const t = useLocale()

  // Filters are keyed by category id and by the tag text itself, neither of
  // which is translated, so switching language keeps the current selection.
  const categories = useMemo(() => {
    const counts = new Map()
    const real = projects.filter((project) => !project.placeholder)
    real.forEach((project) => {
      counts.set(project.category, (counts.get(project.category) ?? 0) + 1)
    })
    return [[ALL, real.length], ...counts.entries()]
  }, [])

  // Sixty-nine tags in one flat alphabetical list means scrolling past fifty of
  // them to reach Shopify. The ones that appear on more than one project go in
  // a group at the top; the rest, each unique to a single project, follow.
  const skills = useMemo(() => {
    const counts = new Map()
    projects.forEach((project) => {
      project.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1))
    })
    const sorted = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    return {
      common: sorted.filter(([, count]) => count > 1),
      rest: sorted.filter(([, count]) => count === 1),
    }
  }, [])

  const [category, setCategory] = useState(ALL)
  const [skill, setSkill] = useState(ALL)
  const [preview, setPreview] = useState(null)
  const [limit, setLimit] = useState(PAGE)

  // A focus and a category narrow the same axis, so choosing one clears the
  // other rather than intersecting to nothing.
  const pickCategory = (id) => {
    onFocusChange(null)
    setCategory(id)
  }

  const inFocus = (project) => !focus || focusAreas[focus].includes(project.category)

  // Shown in the order profile.js declares them: the list is curated to the
  // headline, strongest mobile work first, and a sort here would undo that.

  const matching = projects
    .filter(
      (project) =>
        inFocus(project) &&
        (category === ALL || project.category === category) &&
        (skill === ALL || project.tags.includes(skill)),
    )

  const shown = matching.slice(0, limit)
  const remaining = matching.length - shown.length

  // Narrowing the list starts it again from the top: a page count carried over
  // from the last filter would show six of one set and twenty of the next.
  useEffect(() => { setLimit(PAGE) }, [category, skill, focus])

  const focusLabel = focus ? t.about.best.find((item) => item.id === focus)?.area : null
  const focusCount = focus ? projects.filter(inFocus).length : 0
  const filtered = category !== ALL || skill !== ALL || Boolean(focus)
  const previewProject = preview && projects.find((project) => project.id === preview.id)

  const openPreview = (project, index) => setPreview({ id: project.id, index })

  const shot = (project, index, className) => {
    const item = project.media[index]
    return (
      <img
        key={item.file}
        className={className}
        src={projectMedia[item.file]}
        alt={t.projects.mediaAlt(project.name)}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
        role="button"
        tabIndex={0}
        title={t.a11y.openPreview}
        onClick={() => openPreview(project, index)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPreview(project, index)
          }
        }}
      />
    )
  }

  return (
    <section className="section" id="work">
      <div className="shell">
        <div className="section-head">
          <span className="eyebrow">{t.projects.eyebrow}</span>
          <h2>{t.projects.heading}</h2>
          <p className="note">{t.projects.note(projects.length)}</p>
        </div>

        <div className="filters">
          <div className="filter-chips" role="group" aria-label={t.a11y.filter}>
            {/* The focus comes from the About list, so it has no chip of its
                own until it is set; shown here it can be seen and dismissed. */}
            {focus ? (
              <button
                type="button"
                data-press
                className="filter is-active"
                onClick={() => onFocusChange(null)}
                aria-pressed="true"
              >
                {focusLabel}
                <span>{focusCount}</span>
              </button>
            ) : null}
            {categories.map(([id, count]) => (
              <button
                key={id}
                type="button"
                data-press
                className={`filter${category === id && !focus ? ' is-active' : ''}`}
                onClick={() => pickCategory(id)}
                aria-pressed={category === id && !focus}
              >
                {id === ALL ? t.projects.all : t.projects.categories[id]}
                <span>{count}</span>
              </button>
            ))}
          </div>

          <div className="filter-skill">
            <label htmlFor="skill-filter">{t.projects.bySkill}</label>
            <select
              id="skill-filter"
              value={skill}
              onChange={(event) => setSkill(event.target.value)}
            >
              <option value={ALL}>{t.projects.allSkills}</option>
              <optgroup label={t.projects.skillsCommon}>
                {skills.common.map(([tag, count]) => (
                  <option key={tag} value={tag}>
                    {tag} ({count})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t.projects.skillsOther}>
                {skills.rest.map(([tag]) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </optgroup>
            </select>
            {filtered ? (
              <button
                type="button"
                data-press
                className="filter-reset"
                onClick={() => {
                  setCategory(ALL)
                  setSkill(ALL)
                  onFocusChange(null)
                }}
              >
                {t.projects.reset}
              </button>
            ) : null}
          </div>
        </div>

        {shown.length ? (
          <ol className="projects-list">
            {shown.map((project) => project.placeholder ? (
              // An empty slot: where a project belongs that the page cannot
              // show yet. Plain on purpose, so it is easy to find and hard to
              // mistake for a finished entry.
              <li key={project.id} data-reveal className={`project-row project-slot accent-${project.accent}`}>
                <div className="project-slot-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="project-content">
                  <p className="project-category">
                    {t.projects.categories[project.category]} · {t.projects.slot.from(project.company)}
                  </p>
                  <h3>{t.projects.slot.label}</h3>
                  {t.projects.items[project.id].map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="project-body">{paragraph}</p>
                  ))}
                  <p className="project-slot-stack">{t.projects.slot.stack}</p>
                  <ul className="project-tags">
                    {project.stack.map((tag) => (
                      <li key={tag} className="project-slot-tag">{tag}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={project.id} data-tilt="soft" data-reveal className={`card project-row accent-${project.accent}${rowLayout(project)}`}>
                <div className={`project-media${mediaLayout(project)}`}>
                  {shot(project, 0, 'media-lead')}
                  {project.media.length > 1 ? (
                    <div className="media-rest">
                      {project.media.slice(1).map((item, offset) => shot(project, offset + 1))}
                    </div>
                  ) : null}
                </div>

                <div className="project-content">
                  <p className="project-category">{t.projects.categories[project.category]}</p>
                  <h3>{project.name}</h3>
                  {t.projects.items[project.id].map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="project-body">{paragraph}</p>
                  ))}

                  <ul className="project-tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <button
                          type="button"
                          data-press
                          className={`tag-button${skill === tag ? ' is-active' : ''}`}
                          onClick={() => setSkill(skill === tag ? ALL : tag)}
                          aria-pressed={skill === tag}
                        >
                          {tag}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {project.links?.length ? (
                    <p className="project-links">
                      {project.links.map((link) => (
                        <a
                          key={link.kind}
                          className="project-link"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t.projects.links[link.kind]}
                          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                            <path
                              d="M7 17 17 7M9 7h8v8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      ))}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="projects-empty">{t.projects.empty}</p>
        )}

        {remaining > 0 ? (
          <div className="projects-more">
            <button type="button" className="btn btn-ghost" data-press onClick={() => setLimit((current) => current + PAGE)}>
              {t.projects.more(Math.min(PAGE, remaining))}
            </button>
            <p className="projects-progress" aria-live="polite">
              {/* Projects, not rows: an empty slot is not work, and the count
                  has to agree with the filter chips above. */}
              {t.projects.progress(
                shown.filter((project) => !project.placeholder).length,
                matching.filter((project) => !project.placeholder).length,
              )}
            </p>
          </div>
        ) : null}
      </div>

      {previewProject ? (
        <Lightbox
          project={previewProject}
          index={preview.index}
          onClose={() => setPreview(null)}
          onMove={(index) => setPreview((current) => ({ ...current, index }))}
        />
      ) : null}
    </section>
  )
}
