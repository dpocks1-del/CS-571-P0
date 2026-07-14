import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

// Bootstrap CSS + JS bundle (JS enables dropdowns, the collapsing navbar, etc.)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Your own styles load AFTER Bootstrap so they can override it.
import './index.css'

import App from './App.jsx'

// HashRouter is used on purpose: GitHub Pages is a static file host with no
// server-side routing. With HashRouter every route lives in the URL hash
// (e.g. /#/about), so a full-page refresh or a deep link never 404s.
// If you later move to a host that supports SPA rewrites, swap HashRouter
// for BrowserRouter.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
