# ECOM Client

Next.js (App Router) + React 19 + TypeScript frontend.

## Structure

```
app/
  (public)/     Public pages: landing, store, product, cart
  (auth)/       Login, register
  admin/        Admin panel (role-protected)
components/
  ui/           shadcn/ui primitives
  layout/       Header, Footer, AdminSidebar, AnnouncementBar
  providers/    QueryProvider, AuthProvider
lib/
  firebase/     firebase-admin.ts (server) + firebase-client.ts (browser)
  auth/         Auth helpers
  tenant.ts     Subdomain → storeId resolution
store/
  storeContext  Multi-tenancy context
  authStore     Zustand auth state
  cartStore     Zustand cart state (localStorage)
hooks/
  useFCM        FCM token registration
types/
  index.ts      All shared TypeScript interfaces
```

## Adding a New Page

1. Create `app/(public)/your-page/page.tsx` for public pages
2. Create `app/admin/your-page/page.tsx` for admin pages (role guard is automatic)
3. Use `useStore()` to get `storeId` for Firestore queries
4. Use `useAuthStore()` to get the current user

## Docs

- [Auth Flow](docs/auth-flow.md)
- [Multi-Tenancy](docs/multi-tenancy.md)
- [Payment Flow](docs/payment-flow.md)
- [Data Model](docs/data-model.md)
- [Admin Features](docs/admin-features.md)
