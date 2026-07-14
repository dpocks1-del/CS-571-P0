import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="p-5 mb-4 bg-body-tertiary rounded-3">
          <h1 className="display-5 fw-bold">Welcome 👋</h1>
          <p className="col-md-10 fs-5">
            This is a client-side-only React app built with Vite, React Router,
            and Bootstrap — ready to deploy to GitHub Pages.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setCount((c) => c + 1)}
          >
            Clicked {count} {count === 1 ? 'time' : 'times'}
          </button>
        </div>

        <p>
          Head over to the <Link to="/about">About page</Link> to see routing
          in action.
        </p>
      </div>
    </div>
  )
}
