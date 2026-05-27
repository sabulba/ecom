import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '@/types';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      isLoggedIn: () => get().user !== null,
      isAdmin: () => ['admin', 'superAdmin'].includes(get().user?.role ?? ''),
      isManager: () => ['manager', 'admin', 'superAdmin'].includes(get().user?.role ?? ''),
    }),
    { name: 'ecom-auth-store' }
  )
);