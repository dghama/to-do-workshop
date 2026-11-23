import { HOME_PAGE_COPY } from '../home.constants';

export function HomePage() {
  return (
    <section className="welcome-panel" aria-labelledby="welcome-title">
      <p className="eyebrow">{HOME_PAGE_COPY.eyebrow}</p>
      <h1 id="welcome-title">{HOME_PAGE_COPY.heading}</h1>
      <p>{HOME_PAGE_COPY.description}</p>
    </section>
  );
}
