'use client';
import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { getMessagingInstance, db } from '@/lib/firebase/firebase-client';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/storeContext';

export function useFCM() {
  const { user } = useAuthStore();
  const { storeId } = useStore();

  useEffect(() => {
    if (!user) return;

    async function registerToken() {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (token && user) {
          await updateDoc(doc(db, 'tenants', storeId, 'users', user.id), {
            fcmToken: token,
          });
        }
      } catch {
        // Permission denied or not supported — silently skip
      }
    }

    registerToken();
  }, [user, storeId]);
}
