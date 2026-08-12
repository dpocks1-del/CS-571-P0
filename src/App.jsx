import { Routes, Route, useLocation } from 'react-router-dom'

import NavBar from './components/NavBar.jsx'
import Purchase from './pages/Purchase.jsx'
import Communications from './pages/Communications.jsx'
import List from './pages/List.jsx'
import NotFound from './pages/NotFound.jsx'
import CreateListing from './pages/CreateListing.jsx'
import { MessagesProvider } from './contexts/MessagesContext.jsx'
import EditListing from './pages/EditListing'

export default function App() {
  const location = useLocation()
  const isCommunications =
    location.pathname === '/communications'

  return (
    <MessagesProvider>
      <div
        style={{
          minHeight: isCommunications ? '100dvh' : '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <NavBar />

        <main
          style={
            isCommunications
              ? {
                  /*
                   * Communications gets the remaining viewport height
                   * and handles its own scrolling internally.
                   */
                  flex: '1 1 0',
                  minHeight: 0,
                  width: '100%',
                  paddingTop: '24px',
                  paddingRight: '12px',
                  paddingBottom: 0,
                  paddingLeft: '12px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }
              : {
                  /*
                   * All other pages use normal document scrolling.
                   */
                  width: '100%',
                  paddingTop: '24px',
                  paddingRight: '12px',
                  paddingBottom: '24px',
                  paddingLeft: '12px',
                  boxSizing: 'border-box',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }
          }
        >
          <Routes>
            <Route path="/" element={<Purchase />} />
            <Route path="/list/create" element={<CreateListing />} />
            <Route path="/list/:itemId/edit" element={<EditListing />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route
              path="/communications"
              element={<Communications />}
            />
            <Route path="/list" element={<List />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </MessagesProvider>
  )
}