import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

const mockItem: CartItem = {
  productId: 'prod1',
  name: 'Test Product',
  price: 100,
  qty: 1,
  imageUrl: 'https://example.com/img.jpg',
  metaProps: {},
};

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts with empty cart', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('addItem adds a new product', () => {
    useCartStore.getState().addItem(mockItem);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('addItem increments qty if product already in cart', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem(mockItem);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2);
  });

  it('removeItem removes a product', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().removeItem('prod1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clearCart empties the cart', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('totalAmount calculates correctly', () => {
    useCartStore.getState().addItem({ ...mockItem, qty: 2, price: 50 });
    expect(useCartStore.getState().totalAmount()).toBe(100);
  });

  it('itemCount returns total quantity across all items', () => {
    useCartStore.getState().addItem({ ...mockItem, qty: 3 });
    expect(useCartStore.getState().itemCount()).toBe(3);
  });
});
