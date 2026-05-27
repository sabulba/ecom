# Auth Flow

## Providers
- Firebase Email/Password (`signInWithEmailAndPassword`)
- Google OAuth (`signInWithPopup` + `GoogleAuthProvider`)

## Registration
1. User fills form (email, password, firstName, lastName, phone)
2. `createUserWithEmailAndPassword` → Firebase Auth user created
3. User doc written to `tenants/{storeId}/users/{uid}` with `role: customer`, `status: active`
4. Google: `signInWithPopup` → user doc created with `setDoc({ merge: true })`

## Password Reset
- `sendPasswordResetEmail(auth, email)` — Firebase sends reset link
- Available from `/login` page via "Forgot password?" link

## Session
- Firebase session cookies stored as `session` HTTP-only cookie
- Next.js middleware reads cookie, redirects unauthenticated requests to `/login`
- Admin layout server component verifies with `adminAuth.verifySessionCookie()` and checks role

## Roles
| Role | Access |
|---|---|
| customer | Public pages + own orders |
| manager | Admin pages (no users management) |
| admin | All admin pages |
| superAdmin | All admin pages + cross-tenant access |

## Guards
- `middleware.ts` — edge check for session cookie, protects `/admin/*`
- `app/admin/layout.tsx` — server component, verifies role from Firestore
