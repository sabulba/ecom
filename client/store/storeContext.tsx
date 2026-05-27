'use client';
import { createContext, useContext, type ReactNode } from 'react';

interface StoreContextValue {
  storeId: string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ storeId, children }: { storeId: string; children: ReactNode }) {
  return (
    <StoreContext.Provider value={{ storeId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
