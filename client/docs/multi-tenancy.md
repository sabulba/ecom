# Multi-Tenancy

## Strategy
Subdomain-based. Each store has a unique subdomain (e.g., `mystore.ecom.app`). The `storeId` is resolved at request time from the subdomain.

## Resolution Flow
1. `resolveStoreIdFromHostname(hostname)` in `lib/tenant.ts`
2. Extracts subdomain via `extractSubdomain(hostname)`
3. Queries `stores` collection where `subdomain == extracted && active == true`
4. Returns `storeId` (Firestore document ID)
5. Localhost fallback: returns `NEXT_PUBLIC_STORE_ID` from env

## StoreContext
- `StoreProvider` wraps the entire app in `app/layout.tsx`
- `storeId` resolved server-side in root layout and passed as prop
- Components access it via `useStore()` hook

## All Firestore Paths
All tenant data lives under `tenants/{storeId}/`:
```typescript
const { storeId } = useStore();
const ref = collection(db, 'tenants', storeId, 'products');
```

## Local Development
Set `NEXT_PUBLIC_STORE_ID=ecom-d2f6c` in `.env.local`.