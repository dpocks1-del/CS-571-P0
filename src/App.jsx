import { Routes, Route } from 'react-router-dom'

import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Catch-all: any unknown route renders the 404 page. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
