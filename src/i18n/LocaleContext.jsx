import { createContext, useContext } from 'react'
import { locale } from './index.js'

const LocaleContext = createContext(locale)

// Kept as a provider so components read their strings the same way they always
// have; there is only one locale to provide.
export function LocaleProvider({ children }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

/** Returns the site's strings. */
export function useLocale() {
  return useContext(LocaleContext)
}
