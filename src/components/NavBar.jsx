import { NavLink, Link } from 'react-router-dom'

// A responsive Bootstrap navbar. NavLink automatically adds an "active" class
// to the link matching the current route — we hook Bootstrap's `active` class
// into that so the current page is highlighted.
export default function NavBar() {
  const linkClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' active' : '')

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          My App
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={linkClass} to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/about">
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
