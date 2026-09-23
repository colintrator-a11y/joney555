/**
 * Guards the one invariant the UI depends on: every id in src/data/profile.js
 * has a string in the locale file (and, if more locales are ever added, that
 * they all share one shape). A missing
 * key would render as `undefined` on the page rather than throwing, so this is
 * checked here instead of at runtime.
 *
 *   node scripts/check-locales.mjs
 */
import { localeList } from '../src/i18n/index.js'
import {
  certifications,
  navSections,
  projects,
  serviceIds,
  skillGroups,
  stats,
} from '../src/data/profile.js'

const shape = (value, path = '') => {
  if (Array.isArray(value)) return value.flatMap((item) => shape(item, `${path}[]`))
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((key) => shape(value[key], `${path}.${key}`))
  }
  return [`${path}:${typeof value}`]
}

const problems = []

const [base, ...rest] = localeList
const baseShape = shape(base)
const baseSet = new Set(baseShape)

for (const locale of rest) {
  const current = shape(locale)
  const currentSet = new Set(current)
  const missing = baseShape.filter((key) => !currentSet.has(key))
  const extra = current.filter((key) => !baseSet.has(key))
  if (missing.length) problems.push(`${locale.code}: missing ${missing.join(', ')}`)
  if (extra.length) problems.push(`${locale.code}: unexpected ${extra.join(', ')}`)
}

const coverage = {
  'nav': navSections,
  'hero.stats': stats.map((stat) => stat.id),
  'about.certifications': certifications.map((certification) => certification.id),
  'services.items': serviceIds,
  'skills.groups': skillGroups.map((group) => group.id),
  'projects.items': projects.map((project) => project.id),
  'projects.categories': [...new Set(projects.map((project) => project.category))],
}

for (const locale of localeList) {
  for (const [path, ids] of Object.entries(coverage)) {
    const node = path.split('.').reduce((object, key) => object?.[key], locale)
    for (const id of ids) {
      if (node?.[id] === undefined) problems.push(`${locale.code}: ${path}.${id} is missing`)
    }
  }

  // Lengths the layout assumes.
  const lengths = {
    'about.best': [locale.about.best.length, 4],
    'experience.points': [locale.experience.points.length, 4],
  }

  // A project's description is an array of paragraphs; a locale that dropped or
  // merged one would still pass the shape check, so compare against English.
  for (const project of projects) {
    const paragraphs = locale.projects.items[project.id]
    const expected = base.projects.items[project.id]?.length
    if (Array.isArray(paragraphs) && paragraphs.length !== expected) {
      lengths[`projects.items.${project.id}`] = [paragraphs.length, expected]
    }
  }
  for (const [path, [actual, expected]] of Object.entries(lengths)) {
    if (actual !== expected) problems.push(`${locale.code}: ${path} has ${actual}, expected ${expected}`)
  }
}

if (problems.length) {
  console.error(problems.map((problem) => `✗ ${problem}`).join('\n'))
  process.exit(1)
}

console.log(`✓ ${localeList.map((l) => l.code).join(', ')} — every id covered`)
