import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import BookAppointment from './BookAppointment';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
  })),
});

// Mock fetch to avoid network calls
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  } as Response)
);

describe('BookAppointment Component', () => {
  it('renders the booking form', () => {
    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );
    expect(screen.getByText('Patient Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('10-digit mobile number')).toBeInTheDocument();
  });

  it('updates form data on input', () => {
    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('Enter full name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });
});
