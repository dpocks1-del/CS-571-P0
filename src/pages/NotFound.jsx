import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container mt-5 text-center">
      <h1>404</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go back home
      </Link>
    </div>
  )
}