import { adminDb } from './firebase/firebase-admin';

export function extractSubdomain(hostname: string): string {
  if (hostname.startsWith('localhost')) return '';
  const parts = hostname.split('.');
  return parts.length > 1 ? parts[0] : '';
}

export async function resolveStoreIdFromHostname(hostname: string): Promise<string | null> {
  if (hostname.startsWith('localhost')) {
    return process.env.NEXT_PUBLIC_STORE_ID ?? null;
  }

  const subdomain = extractSubdomain(hostname);
  if (!subdomain) return process.env.NEXT_PUBLIC_STORE_ID ?? null;

  const snapshot = await adminDb
    .collection('stores')
    .where('subdomain', '==', subdomain)
    .where('active', '==', true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}