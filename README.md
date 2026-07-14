# React + Bootstrap + React Router — GitHub Pages Template

A **100% client-side** single-page app. No server, no Next.js — just React and
JavaScript, built with [Vite](https://vitejs.dev/), styled with
[Bootstrap 5](https://getbootstrap.com/), and routed with
[React Router](https://reactrouter.com/). Deploys as static files to GitHub
Pages.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

## Project structure

```
index.html              # single HTML entry point
vite.config.js          # base: './' so it works on any GH Pages subpath
src/
  main.jsx              # app entry — mounts React, imports Bootstrap, HashRouter
  App.jsx              # route table
  index.css            # your custom styles (override Bootstrap here)
  components/
    NavBar.jsx         # responsive Bootstrap navbar
  pages/
    Home.jsx
    About.jsx
    NotFound.jsx       # catch-all 404 route
.github/workflows/
  deploy.yml           # auto-deploy to GitHub Pages on push to main
```

## Why HashRouter?

GitHub Pages is a static file host with no server-side routing. With a normal
`BrowserRouter`, refreshing on `/about` or sharing a deep link would 404,
because there's no `about` file on the server. `HashRouter` keeps the route in
the URL hash (`/#/about`), which the server ignores — so every route and
refresh just works. That's why this template uses it.

## Deploying

### Option A — GitHub Actions (recommended)

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source →
   "GitHub Actions"**.
3. Every push to `main` builds and deploys automatically (see
   `.github/workflows/deploy.yml`).

### Option B — `gh-pages` branch (manual)

```bash
npm run deploy
```

This builds and pushes `dist/` to a `gh-pages` branch. Then set
**Settings → Pages → Source → "Deploy from a branch" → `gh-pages` / root**.

## Adding a page

1. Create `src/pages/MyPage.jsx`.
2. Add a route in `src/App.jsx`:
   ```jsx
   <Route path="/my-page" element={<MyPage />} />
   ```
3. (Optional) add a link in `src/components/NavBar.jsx`.
