'use client';
import { useEffect, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase-client';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/storeContext';
import type { AppUser } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const { storeId } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(
          doc(db, 'tenants', storeId, 'users', firebaseUser.uid)
        );
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as AppUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, setUser, setLoading]);

  return <>{children}</>;
}
