import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders footer with all sections', () => {
    render(<Footer />);
    
    expect(screen.getByText(/online shopping/i)).toBeInTheDocument();
    expect(screen.getByText(/customer policies/i)).toBeInTheDocument();
    expect(screen.getByText(/experience app/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    
    expect(screen.getByText(/men/i)).toBeInTheDocument();
    expect(screen.getByText(/women/i)).toBeInTheDocument();
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    const socialLinks = document.querySelectorAll('a[href="#"]');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('renders copyright information', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2024/i)).toBeInTheDocument();
  });

  it('renders popular searches', () => {
    render(<Footer />);
    
    expect(screen.getByText(/popular searches/i)).toBeInTheDocument();
    expect(screen.getByText(/kurta pajama/i)).toBeInTheDocument();
  });
});




