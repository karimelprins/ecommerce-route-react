import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="auth-page"><section className="empty-state"><span className="eyebrow">404</span><h1>Page not found</h1><p>The page you are looking for does not exist.</p><Link className="primary-button" to="/">Back home</Link></section></main>;
}
