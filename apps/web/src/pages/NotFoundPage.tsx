import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="welcome-panel" aria-labelledby="not-found-title">
      <p className="eyebrow">Not found</p>
      <h1 id="not-found-title">This page does not exist</h1>
      <Link className="text-link" to="/">
        Return to the application
      </Link>
    </section>
  );
}
