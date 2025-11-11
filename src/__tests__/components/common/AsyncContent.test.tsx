import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AsyncContent } from '@/components/common/AsyncContent';

describe('AsyncContent', () => {
  it('renders loading state when isLoading is true', () => {
    render(
      <AsyncContent 
        data={null}
        isLoading={true}
        error={null}
      >
        {(data) => <div>Content</div>}
      </AsyncContent>
    );
    expect(document.querySelector('.animate-spin') || screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    render(
      <AsyncContent 
        data={null}
        isLoading={false}
        error={new Error('Test error')}
      >
        {(data) => <div>Content</div>}
      </AsyncContent>
    );
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('renders children when data is available', () => {
    render(
      <AsyncContent 
        data={['item1', 'item2']}
        isLoading={false}
        error={null}
      >
        {(data) => <div>{data.join(', ')}</div>}
      </AsyncContent>
    );
    expect(screen.getByText('item1, item2')).toBeInTheDocument();
  });

  it('renders empty state when data is empty array', () => {
    render(
      <AsyncContent 
        data={[]}
        isLoading={false}
        error={null}
      >
        {(data) => <div>Content</div>}
      </AsyncContent>
    );
    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
  });

  it('renders custom loading component', () => {
    render(
      <AsyncContent 
        data={null}
        isLoading={true}
        error={null}
        renderLoading={() => <div>Custom Loading</div>}
      >
        {(data) => <div>Content</div>}
      </AsyncContent>
    );
    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
  });

  it('renders custom error component', () => {
    render(
      <AsyncContent 
        data={null}
        isLoading={false}
        error={new Error('Test error')}
        renderError={() => <div>Custom Error</div>}
      >
        {(data) => <div>Content</div>}
      </AsyncContent>
    );
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });
});

