import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') ?? '';
  const sessionCookie = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('session='))
    ?.split('=')
    .slice(1)
    .join('=')
    .trim();

  if (!sessionCookie) {
    redirect('/login?redirect=/admin');
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const storeId = process.env.NEXT_PUBLIC_STORE_ID ?? '';
    const userDoc = await adminDb
      .doc(`tenants/${storeId}/users/${decoded.uid}`)
      .get();

    const role = userDoc.data()?.role as string | undefined;
    if (!role || !['manager', 'admin', 'superAdmin'].includes(role)) {
      redirect('/');
    }
  } catch {
    redirect('/login?redirect=/admin');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
