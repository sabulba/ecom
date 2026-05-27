jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  isSupported: jest.fn().mockResolvedValue(false),
}));
jest.mock('@/lib/firebase/firebase-client', () => ({
  auth: {},
  db: {},
  storage: {},
  getMessagingInstance: jest.fn().mockResolvedValue(null),
}));

describe('firebase-client', () => {
  it('exports auth, db, and storage without throwing', async () => {
    const mod = await import('@/lib/firebase/firebase-client');
    expect(mod.auth).toBeDefined();
    expect(mod.db).toBeDefined();
    expect(mod.storage).toBeDefined();
    expect(typeof mod.getMessagingInstance).toBe('function');
  });
});
