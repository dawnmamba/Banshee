import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FieldLabel } from './FieldLabel';

describe('FieldLabel', () => {
  it('shows red asterisk when required', () => {
    render(
      <FieldLabel htmlFor="test" required>
        Email
      </FieldLabel>,
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-600');
  });

  it('omits asterisk when not required', () => {
    render(<FieldLabel htmlFor="test">Address</FieldLabel>);

    const label = screen.getByText('Address').closest('label');
    expect(label?.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
