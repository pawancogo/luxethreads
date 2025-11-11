import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProductSkeleton from '@/components/ProductSkeleton';

describe('ProductSkeleton', () => {
  it('renders skeleton structure', () => {
    const { container } = render(<ProductSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('has image skeleton', () => {
    const { container } = render(<ProductSkeleton />);
    const imageSkeleton = container.querySelector('.aspect-\\[3\\/4\\]');
    expect(imageSkeleton).toBeInTheDocument();
  });

  it('has content skeleton elements', () => {
    const { container } = render(<ProductSkeleton />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});




