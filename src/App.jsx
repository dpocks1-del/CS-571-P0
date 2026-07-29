import { Routes, Route } from 'react-router-dom'

import NavBar from './components/NavBar.jsx'
import Purchase from './pages/Purchase.jsx'
import Communications from './pages/Communications.jsx'
import List from './pages/List.jsx'
import NotFound from './pages/NotFound.jsx'
import CreateListing from './pages/CreateListing.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Purchase />} />
          <Route path="/list/create" element={<CreateListing />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/list" element={<List />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}