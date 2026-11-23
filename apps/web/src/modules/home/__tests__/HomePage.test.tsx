import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HOME_PAGE_COPY } from '../home.constants';
import { HomePage } from '../pages/HomePage';

describe('home module', () => {
  it('renders the informational shell without task workflows', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: HOME_PAGE_COPY.heading })).toBeVisible();
    expect(screen.getByText(HOME_PAGE_COPY.description)).toBeInTheDocument();
  });
});
