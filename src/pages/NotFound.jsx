import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-4">Sorry, that page doesn&apos;t exist.</p>
      <Link className="btn btn-primary" to="/">
        Go home
      </Link>
    </div>
  )
}
