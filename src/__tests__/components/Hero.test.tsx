import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '@/components/Hero';

describe('Hero', () => {
  it('renders hero section with heading', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
    expect(screen.getByText(/discover premium/i)).toBeInTheDocument();
    expect(screen.getByText(/indian fashion/i)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
    expect(screen.getByText(/exquisite collection/i)).toBeInTheDocument();
  });

  it('renders Shop Now button', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument();
  });

  it('renders Explore Sarees button', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /explore sarees/i })).toBeInTheDocument();
  });

  it('has correct links', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
    const shopLink = screen.getByRole('link', { name: /shop now/i });
    expect(shopLink.getAttribute('href')).toBe('/products');
  });
});





