import { isAppUser, isOrder } from '@/types';

describe('type guards', () => {
  describe('isAppUser', () => {
    it('returns true for a valid AppUser', () => {
      const user = {
        id: 'uid1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123',
        role: 'customer',
        status: 'active',
        storeId: 'ecom-d2f6c',
        createdAt: Date.now(),
      };
      expect(isAppUser(user)).toBe(true);
    });

    it('returns false when role is missing', () => {
      expect(isAppUser({ email: 'test@test.com' })).toBe(false);
    });
  });

  describe('isOrder', () => {
    it('returns true for a valid Order', () => {
      const order = {
        id: 'order1',
        userId: 'uid1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        cartItems: [],
        totalAmount: 100,
        status: 'pending',
        createdAt: Date.now(),
      };
      expect(isOrder(order)).toBe(true);
    });

    it('returns false for invalid status', () => {
      expect(isOrder({ status: 'invalid' })).toBe(false);
    });
  });
});
