import { Link, Outlet } from 'react-router';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__content">
          <Link className="site-brand" to="/" aria-label="To-Do Workshop home">
            To-Do Workshop
          </Link>
        </div>
      </header>
      <main className="page-content" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
