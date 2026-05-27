jest.mock('@/lib/firebase/firebase-admin', () => ({
  adminDb: {},
}));

import { extractSubdomain, resolveStoreIdFromHostname } from '@/lib/tenant';

describe('extractSubdomain', () => {
  it('extracts subdomain from hostname', () => {
    expect(extractSubdomain('mystore.ecom.app')).toBe('mystore');
  });

  it('returns empty string for localhost', () => {
    expect(extractSubdomain('localhost')).toBe('');
  });

  it('returns empty string for localhost with port', () => {
    expect(extractSubdomain('localhost:3000')).toBe('');
  });

  it('returns first segment for multi-part subdomain', () => {
    expect(extractSubdomain('store1.dev.ecom.app')).toBe('store1');
  });
});

describe('resolveStoreIdFromHostname', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NEXT_PUBLIC_STORE_ID: 'test-store-id' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns NEXT_PUBLIC_STORE_ID for localhost', async () => {
    const result = await resolveStoreIdFromHostname('localhost');
    expect(result).toBe('test-store-id');
  });

  it('returns NEXT_PUBLIC_STORE_ID for localhost with port', async () => {
    const result = await resolveStoreIdFromHostname('localhost:3000');
    expect(result).toBe('test-store-id');
  });
});
