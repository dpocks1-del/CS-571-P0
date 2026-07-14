import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Deployed at https://cs571-su26.github.io/p0/ — a GitHub Pages project
  // site served from the "/p0/" subpath, so asset URLs must be prefixed with
  // it. (If you rename the repo, update this to match "/<repo>/".)
  //
  // This pairs with HashRouter (see src/main.jsx): all routing lives in the
  // URL hash (#/about), so GitHub Pages never needs server-side rewrites.
  base: '/p0/',

  build: {
    // `npm run build` outputs to docs/ (instead of the default dist/) so you
    // can commit the build and serve it via GitHub Pages'
    // "Deploy from a branch -> main -> /docs" setting — you control exactly
    // when a build ships by committing docs/ and pushing.
    outDir: 'docs',
    emptyOutDir: true, // wipe docs/ before each build
  },
})
