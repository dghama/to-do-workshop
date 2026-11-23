import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('announces the supplied status to assistive technology', () => {
    render(<LoadingState label="Loading the application" />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading the application');
  });
});
