import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { App } from './App';
import { routeDefinitions } from './routes';

describe('application shell', () => {
  it('renders the workshop shell without implementing task workflows', () => {
    render(<App router={createMemoryRouter(routeDefinitions, { initialEntries: ['/'] })} />);

    expect(screen.getByRole('link', { name: 'To-Do Workshop home' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ready for the next specification' })).toBeVisible();
    expect(
      screen.getByText(/Task workflows will be introduced through a future specification/),
    ).toBeInTheDocument();
  });
});
