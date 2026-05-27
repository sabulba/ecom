import { useAuthStore } from '@/store/authStore';
import type { AppUser } from '@/types';

const mockUser: AppUser = {
  id: 'uid1',
  email: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '123456789',
  role: 'customer',
  status: 'active',
  storeId: 'ecom-d2f6c',
  createdAt: Date.now(),
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: false });
  });

  it('isLoggedIn returns false when user is null', () => {
    expect(useAuthStore.getState().isLoggedIn()).toBe(false);
  });

  it('isLoggedIn returns true after setUser', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isLoggedIn()).toBe(true);
  });

  it('isAdmin returns false for customer role', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isAdmin()).toBe(false);
  });

  it('isAdmin returns true for admin role', () => {
    useAuthStore.getState().setUser({ ...mockUser, role: 'admin' });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
  });

  it('isAdmin returns true for superAdmin role', () => {
    useAuthStore.getState().setUser({ ...mockUser, role: 'superAdmin' });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
  });

  it('setUser to null clears the user', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('isManager returns true for manager role', () => {
    useAuthStore.getState().setUser({ ...mockUser, role: 'manager' });
    expect(useAuthStore.getState().isManager()).toBe(true);
  });
});
