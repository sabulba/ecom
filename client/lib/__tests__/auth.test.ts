jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'uid1', email: 'test@test.com' } }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'uid2', email: 'new@test.com' } }),
  signInWithPopup: jest.fn().mockResolvedValue({ user: { uid: 'uid3', email: 'google@test.com' } }),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signOut: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/firebase/firebase-client', () => ({
  auth: {},
}));

import {
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOut,
  sendPasswordReset,
} from '@/lib/auth/auth';

describe('auth helpers', () => {
  it('signInWithEmail calls signInWithEmailAndPassword', async () => {
    const result = await signInWithEmail('test@test.com', 'password');
    expect(result.user.uid).toBe('uid1');
  });

  it('registerWithEmail calls createUserWithEmailAndPassword', async () => {
    const result = await registerWithEmail('new@test.com', 'password');
    expect(result.user.email).toBe('new@test.com');
  });

  it('signInWithGoogle calls signInWithPopup', async () => {
    const result = await signInWithGoogle();
    expect(result.user.uid).toBe('uid3');
  });

  it('signOut calls firebase signOut', async () => {
    await expect(signOut()).resolves.toBeUndefined();
  });

  it('sendPasswordReset calls sendPasswordResetEmail', async () => {
    await expect(sendPasswordReset('test@test.com')).resolves.toBeUndefined();
  });
});
