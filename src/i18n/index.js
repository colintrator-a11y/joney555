import en from './en.js'

// The site is English only. The strings still live in one locale file, keyed by
// the ids in src/data/profile.js, so the copy stays apart from the structure.
export const locale = en

// A list so scripts/check-locales.mjs can keep checking id coverage.
export const localeList = [en]
