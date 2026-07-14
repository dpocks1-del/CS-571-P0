export default function About() {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h1 className="mb-3">About</h1>
        <p className="lead">
          Everything here runs entirely in the browser — no server, no Next.js,
          just React and JavaScript.
        </p>

        <ul className="list-group">
          <li className="list-group-item">⚡ Vite for dev server &amp; builds</li>
          <li className="list-group-item">🧭 React Router (HashRouter) for navigation</li>
          <li className="list-group-item">🎨 Bootstrap 5 for styling</li>
          <li className="list-group-item">🚀 Deploys as static files to GitHub Pages</li>
        </ul>
      </div>
    </div>
  )
}
