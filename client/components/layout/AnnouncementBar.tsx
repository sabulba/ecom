'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-client';
import { useStore } from '@/store/storeContext';
import { X } from 'lucide-react';
import type { Promotion } from '@/types';

export function AnnouncementBar() {
  const { storeId } = useStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const q = query(
      collection(db, 'tenants', storeId, 'promotions'),
      where('inApp', '==', true),
      where('status', '==', 'sent')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setPromotions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Promotion)));
    });
    return () => unsubscribe();
  }, [storeId]);

  const visible = promotions.filter((p) => !dismissed.has(p.id));
  if (visible.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground">
      {visible.map((promo) => (
        <div key={promo.id} className="flex items-center justify-center gap-2 px-4 py-2 text-sm">
          <span>{promo.title} — {promo.body}</span>
          <button
            onClick={() => setDismissed((prev) => new Set([...prev, promo.id]))}
            className="ml-2 rounded-full p-0.5 hover:bg-primary-foreground/20"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
