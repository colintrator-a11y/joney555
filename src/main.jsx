import React from 'react'
import { createRoot } from 'react-dom/client'

// Tokens and base styles first: component stylesheets are bundled in import
// order, and they need to be able to override the shared primitives (a
// component rule and a .btn rule have the same specificity, so order decides).
import './styles/global.css'
import './styles/tailwind.css'
import './styles/depth.css'
import App from './App.jsx'
// After the component stylesheets, which set their own cursors: with equal
// specificity, the last rule in the bundle is the one that applies.
import './styles/cursor.css'
import dismissBootScreen from './utils/bootScreen.js'
import initDepth from './utils/depth.js'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// The loader is markup in index.html, so it is on screen before this bundle
// exists; React only decides when it has seen enough to take it away.
dismissBootScreen()

// Tilt, press and reveal, delegated from the document so the work list keeps
// them through every filter change.
initDepth()
