import { render, screen } from '@testing-library/react';
import { StoreProvider, useStore } from '@/store/storeContext';

function TestComponent() {
  const { storeId } = useStore();
  return <div data-testid="store-id">{storeId}</div>;
}

describe('StoreContext', () => {
  it('provides storeId to children', () => {
    render(
      <StoreProvider storeId="test-store">
        <TestComponent />
      </StoreProvider>
    );
    expect(screen.getByTestId('store-id').textContent).toBe('test-store');
  });

  it('throws when useStore is called outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useStore must be used within StoreProvider');
    consoleError.mockRestore();
  });
});