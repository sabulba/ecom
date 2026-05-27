# ECOM Platform — Design Specification
**Date:** 2026-05-27  
**Project:** ecom  
**Firebase Project ID:** ecom-d2f6c  
**Git Repo:** https://github.com/sabulba/ecom  
**Status:** Approved

---

## 1. Overview

A full-featured, multi-tenant ecommerce platform built with Next.js 15 (App Router), React 19, TypeScript, Tailwind 4, and Firebase. The platform serves a public-facing storefront (landing, store, product, cart/checkout) and a full admin panel (orders, users, products, inventory, promotions, reports). Each store instance is identified by subdomain. Layout and UI patterns are derived from the `dbjourney-clone` reference project; admin patterns are derived from the `_ZOLIO` reference project.

---

## 2. Monorepo Structure

```
ecom/
├── client/                          # Next.js App Router application
│   ├── app/
│   │   ├── (public)/                # Landing, store, product, cart pages
│   │   ├── (auth)/                  # Login, register pages
│   │   ├── admin/                   # Admin layout + all admin pages
│   │   └── layout.tsx               # Root layout with StoreContext provider
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives
│   │   ├── layout/                  # Header, Footer, AdminSidebar, AnnouncementBar
│   │   ├── store/                   # ProductCard, FilterPanel, SearchBar
│   │   ├── cart/                    # CartDrawer, CartItem, CheckoutForm
│   │   └── admin/                   # DataTable, StatusBadge, EditDrawer, PromotionForm
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── firebase-admin.ts    # Firebase Admin SDK (server-side)
│   │   │   └── firebase-client.ts   # Firebase Client SDK (browser)
│   │   ├── payment/
│   │   │   └── payment.service.ts   # PaymentService interface + Tranzila implementation
│   │   ├── tenant.ts                # Subdomain → storeId resolution
│   │   └── utils.ts
│   ├── hooks/                       # useCart, useAuth, useProducts, useOrders, useFCM
│   ├── store/                       # Zustand stores: cartStore, authStore
│   ├── types/                       # Shared TypeScript interfaces
│   ├── middleware.ts                 # Auth + store guard (Next.js edge middleware)
│   └── docs/
│       ├── auth-flow.md
│       ├── multi-tenancy.md
│       ├── payment-flow.md
│       ├── data-model.md
│       └── admin-features.md
│
├── server/                          # Firebase Cloud Functions
│   ├── src/
│   │   ├── orders/                  # onOrderCreate, deductInventory
│   │   ├── notifications/           # sendPromotion (HTTP callable), FCM helpers
│   │   └── inventory/               # onLowStock trigger
│   ├── package.json
│   └── README.md
│
├── README.md                        # Project overview, env setup, deploy instructions
├── .env.local                       # NEXT_PUBLIC_STORE_ID (fallback), Firebase keys
└── firebase.json                    # Hosting + Functions config
```

---

## 3. Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js (latest stable) + React 19 + TypeScript | SSR for public pages, API routes, App Router |
| Styling | Tailwind 4 + shadcn/ui | Matches dbjourney-clone, accessible, variant-based |
| Client state | Zustand | Cart + auth UI state, localStorage persistence |
| Server state | TanStack Query | Admin real-time queries, mutations, caching |
| Forms | React Hook Form + Zod | Type-safe validation, used in dbjourney-clone |
| Firebase | Firestore, Auth, Storage, FCM, Functions | Full backend as spec'd |
| Payment | Tranzila iframe (abstracted) | Matches _ZOLIO, swappable via PaymentService interface |
| Charts | Recharts | Reports pages, matches dbjourney-clone dependency |
| Tables | TanStack Table | Admin data grids with sort/filter/paginate |
| Icons | lucide-react | Matches dbjourney-clone |
| Toasts | Sonner | Matches dbjourney-clone |
| Dark mode | next-themes + Tailwind | CSS custom properties via `.dark` class |

---

## 4. Multi-Tenancy: Subdomain-Based Resolution

**Strategy:** Each store instance is identified by its subdomain. The app resolves the `storeId` at runtime from the subdomain, not from a URL path prefix or env var.

**Resolution flow:**
1. On every request, extract subdomain from `hostname` (Next.js middleware or `headers()`)
2. Query root-level Firestore collection: `stores` where `subdomain == extractedSubdomain`
3. Resolved `storeId` is injected into a `StoreContext` (React context, available app-wide)
4. All Firestore paths are prefixed: `tenants/{storeId}/...`
5. On user login: verify `user.storeId === resolvedStoreId` (superAdmins bypass this check)

**SuperAdmin store switching:**
- Users with `role: superAdmin` see a store picker UI after login
- Switching stores updates `storeId` in `StoreContext` without page reload

**Root Firestore collection:**
```
stores/
└── {storeId}
    ├── subdomain: string      # e.g. "mystore"
    ├── storeName: string
    └── active: boolean
```

**Local development:** `NEXT_PUBLIC_STORE_ID` in `.env.local` is used as fallback when no subdomain is present (localhost).

---

## 5. Firestore Data Model

All paths below are relative to `tenants/{storeId}/`.

```
tenants/{storeId}/
│
├── config/
│   └── settings
│       ├── storeName: string
│       ├── logo: string            # Storage URL
│       ├── currency: string        # e.g. "ILS"
│       ├── paymentMode: 'card' | 'cash' | 'none'
│       └── tranzilaSupplier: string
│
├── productModels/
│   └── {modelId}
│       ├── name: string            # e.g. "T-Shirt", "Electronics"
│       ├── baseFields: string[]    # Always: name, price, stock, images, description, category
│       └── metaFields: MetaField[]
│           # MetaField: { key, label, type: 'text'|'number'|'boolean'|'select', options?: string[] }
│
├── products/
│   └── {productId}
│       ├── name: string
│       ├── modelId: string         # ref to productModels
│       ├── price: number
│       ├── images: string[]        # Storage URLs
│       ├── description: string
│       ├── category: string
│       ├── baseProps: Record<string, any>
│       ├── metaProps: Record<string, any>   # Values for model's metaFields
│       ├── active: boolean
│       └── createdAt: number       # Date.now()
│
├── inventory/
│   └── {productId}                 # same ID as products/{productId}
│       ├── stock: number
│       ├── reserved: number
│       ├── threshold: number       # low-stock alert level
│       └── lastUpdated: number
│
├── orders/
│   └── {orderId}
│       ├── userId: string
│       ├── email: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── cartItems: CartItem[]
│       │   # CartItem: { productId, name, price, qty, metaProps }
│       ├── totalAmount: number
│       ├── status: 'pending'|'confirmed'|'shipped'|'delivered'|'cancelled'|'failed'
│       ├── paymentRef: string      # Tranzila transaction ref
│       ├── remark: string
│       └── createdAt: number
│
├── users/
│   └── {userId}                    # uid from Firebase Auth
│       ├── email: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── phone: string
│       ├── role: 'customer'|'manager'|'admin'|'superAdmin'
│       ├── status: 'pending'|'active'|'suspended'
│       ├── storeId: string
│       ├── fcmToken: string        # updated on each login
│       └── createdAt: number
│
└── promotions/
    └── {promotionId}
        ├── title: string
        ├── body: string
        ├── imageUrl: string        # Storage URL
        ├── targetAudience: 'all' | 'customers' | 'members' | string[]  # userId array
        ├── inApp: boolean
        ├── push: boolean
        ├── status: 'draft'|'sent'|'scheduled'
        ├── scheduledAt: number | null
        ├── sentAt: number | null
        └── reachCount: number
```

---

## 6. Authentication & Authorization

**Providers:** Firebase Email/Password + Google OAuth

**Registration flow:**
1. Email: `createUserWithEmailAndPassword` → collect firstName, lastName, phone → write to `users/{uid}`
2. Google: `signInWithPopup(GoogleAuthProvider)` → if new user, prompt for missing fields (phone) → write to `users/{uid}`
3. Default role: `customer`, status: `pending` (admin manually activates if needed)
4. Password reset: `sendPasswordResetEmail` available from login page — Firebase sends reset link to registered email

**Session strategy:** Firebase session cookies managed via Next.js middleware (`firebase-admin` verifies token server-side). Survives page refresh, works with SSR.

**Role access matrix:**

| Role | Public | Cart/Checkout | Admin | Users Mgmt | SuperAdmin |
|---|---|---|---|---|---|
| customer | ✓ | ✓ | ✗ | ✗ | ✗ |
| manager | ✓ | ✓ | ✓ (no users) | ✗ | ✗ |
| admin | ✓ | ✓ | ✓ | ✓ | ✗ |
| superAdmin | ✓ | ✓ | ✓ | ✓ | ✓ |

**Guards (Next.js middleware):**
- `authMiddleware` — verifies Firebase session cookie, redirects to `/login`
- `adminGuard` — reads `role` from Firestore, blocks `role < manager` from `/admin/*`
- `storeGuard` — validates `user.storeId === resolvedStoreId` (superAdmin bypasses)

---

## 7. Public Pages

All public pages use **Next.js Server Components** with **Firebase Admin SDK** for initial data fetch (SSR for SEO). Interactive elements (cart, auth) are Client Components.

| Route | Description | SSR Data |
|---|---|---|
| `/` | Landing page | Featured products, active in-app promotions, store config |
| `/store` | All products + filters | Product list, available categories, model metaFields for dynamic filters |
| `/store/[productId]` | Single product detail | Product + inventory stock + related products |
| `/cart` | Cart review | Client-only (Zustand) |
| `/cart/checkout` | Checkout form + payment | Client-only |
| `/payment-result` | Payment callback page | Client-only, reads `?status=&orderId=` |

**Public layout (from dbjourney-clone):**
```
AnnouncementBar (active promotions)
Header (sticky, z-50): Logo | Search | Auth icons | Cart icon (badge)
[Page Content]
Footer (dark inverted): Logo | Social links | Payment badges | Legal links
```

**Store page filters:**
- Category (from product data)
- Price range (slider)
- Dynamic filters from `productModel.metaFields` (e.g., size, color — resolved per store's models)
- In-stock only toggle

---

## 8. Admin Pages

All admin pages use **Client Components** with **Firebase Client SDK** and **TanStack Query** for real-time data. Protected by `adminGuard`.

**Admin layout:** Persistent sidebar + top bar, no public header/footer.

### 5.1 Orders Management (`/admin/orders`)
- TanStack Table: orderId, customer name, item count, total, status badge, date
- Real-time via `onSnapshot`, filterable by date range and status
- Row expand: full cart items, payment ref, remark
- Status update actions per row
- CSV export (full or filtered)

### 5.2 Users Management (`/admin/users`)
- Search by name/email/phone; sort any column
- Status control: `pending → active → suspended`
- Edit drawer: update role, status, contact fields
- Per-user link to their order history

### 5.3 Products Management (`/admin/products`)
- Grid + list view toggle
- Filter by modelId, active/inactive status
- Create/edit product: select model → fill baseProps → fill dynamic metaProps
- Soft delete (`active: false`)
- Bulk activate/deactivate

### 5.4 Product Model Designer (`/admin/product-models`)
- Define reusable product schemas
- Fixed baseFields: name, price, stock, images, description, category
- Add custom metaFields: key, label, type (`text|number|boolean|select`), options (for select)
- Example: model "T-Shirt" → metaFields `[{key:'size', type:'select', options:['S','M','L','XL']}, {key:'color', type:'text'}]`
- Edit blocked on models with existing products (schema stability)
- Delete blocked if any products reference the model

### 5.5 Promotions Management (`/admin/promotions`)
- Create promotion: title, body, image upload (Firebase Storage), target audience
- Toggle `inApp` (shown as announcement bar banner) and `push` (FCM) independently
- Schedule or send immediately
- History table: sent date, reach count, status
- Deactivate active in-app promotions

### 5.6 Inventory Management (`/admin/inventory`)
- Table: product name, model, stock, reserved, available
- Color-coded stock badges: red (<1), orange (<5), yellow (<10), green (healthy) — from _ZOLIO
- Inline editable stock with dirty-check before save — from _ZOLIO
- Per-product low-stock threshold setting
- Expandable row: orders that consumed this product's stock

---

## 9. Reports

### 6.1 Sales Report (`/admin/reports/sales`)
- Date range picker → queries `orders` within range
- Recharts line chart: revenue over time (daily/weekly/monthly toggle)
- Summary cards: total revenue, order count, avg order value, top product
- Breakdown table by product / category / customer
- CSV export

### 6.2 Inventory Report (`/admin/reports/inventory`)
- Current stock snapshot across all products
- Recharts bar chart: stock by category
- Low-stock alert list (below threshold)
- Turnover rate: sold qty vs current stock
- CSV export

---

## 10. Cloud Functions (`server/`)

| Function | Trigger | Purpose |
|---|---|---|
| `onOrderCreate` | Firestore onCreate `tenants/{id}/orders/{orderId}` | Send order confirmation email to customer |
| `deductInventory` | Firestore onCreate `tenants/{id}/orders/{orderId}` | Reduce stock in `inventory/{productId}` for each cart item. Stock availability is validated BEFORE order creation in the checkout API route using a Firestore transaction — this function is a secondary deduction step, not the gatekeeper. |
| `sendPromotion` | HTTP callable | Fan-out FCM push to matching user tokens; write promotion record |
| `onLowStock` | Firestore onUpdate `tenants/{id}/inventory/{productId}` | Alert admin if stock drops below `threshold` |
| `onUserRegister` | Firebase Auth onCreate | Initialize user doc in `tenants/{storeId}/users/{uid}` with default role/status |

---

## 11. Payment Flow (Tranzila)

```
CheckoutForm submitted
    → Cloud Function / API route creates order { status: 'pending' }
    → Returns orderId
    → payment.service.ts renders Tranzila iframe
        (URL: https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=X&orderId=Y)
    → Customer completes card entry in iframe
    → Success → /payment-result?status=success&orderId=Y
        → updateDoc order: { status: 'confirmed', paymentRef: tranzilaRef }
        → Clear Zustand cart
        → Toast success
    → Fail → /payment-result?status=fail&orderId=Y
        → updateDoc order: { status: 'failed' }
        → Toast error, cart preserved
```

**PaymentService interface** (`lib/payment/payment.service.ts`):
```typescript
interface PaymentService {
  initiate(order: Order, config: PaymentConfig): PaymentSession
  onSuccess(orderId: string): Promise<void>
  onFailure(orderId: string): Promise<void>
}
```
Switching to Stripe = new class implementing `PaymentService`. No checkout component changes required.

**Payment modes** (from store `config/settings.paymentMode`):
- `card` — Tranzila iframe shown
- `cash` — Order created immediately, no iframe
- `none` — Order created immediately (admin/demo mode)

---

## 12. FCM & Promotions Flow

1. On login → client requests FCM permission → `getToken(messaging)` → saves to `users/{uid}.fcmToken`
2. Admin submits promotion in `/admin/promotions`
3. Calls `sendPromotion` Cloud Function with `{ title, body, imageUrl, targetAudience, inApp, push }`
4. Function queries matching users' `fcmToken` values → `messaging.sendEachForMulticast()`
5. If `inApp: true` → writes `promotions/{id}` with `status: 'sent'`
6. Public landing page subscribes to `promotions` where `inApp == true && status == 'sent'` via `onSnapshot` → renders `AnnouncementBar`
7. Admin can deactivate: sets `status: 'inactive'` → `AnnouncementBar` removes it in real-time

---

## 13. Layout Design (from dbjourney-clone)

**Color system:** Tailwind 4 CSS custom properties (OkLch color space)
- Semantic tokens: `--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`
- Dark mode via `.dark` class with separate overrides
- Chart palette: 5-color set for Recharts

**Public header (sticky, z-50):**
- Left: Hamburger (mobile) | Logo
- Center: Search bar (desktop)
- Right: Search icon (mobile) | Auth icon | Cart icon with item count badge

**Public footer (dark inverted):**
- Centered logo, social links
- Region/currency selector
- Payment method badges
- Legal links

**Admin sidebar (persistent desktop, drawer mobile):**
- Store logo + name at top
- Nav links: Dashboard, Orders, Users, Products, Models, Promotions, Inventory, Reports
- User avatar + logout at bottom

---

## 14. Documentation Plan

| File | Content |
|---|---|
| `README.md` | Project overview, env setup, local dev, deploy instructions |
| `client/README.md` | Client app setup, folder conventions, adding new pages |
| `server/README.md` | Cloud Functions setup, local emulator, deploy |
| `client/docs/auth-flow.md` | Auth providers, guards, session cookie strategy |
| `client/docs/multi-tenancy.md` | Subdomain resolution, StoreContext, superAdmin switching |
| `client/docs/payment-flow.md` | Tranzila integration, PaymentService interface, switching providers |
| `client/docs/data-model.md` | Full Firestore schema with field types |
| `client/docs/admin-features.md` | Admin page specs, role access matrix |

All documentation is written alongside implementation — not after.

---

## 15. Reference Projects

| Reference | Path | Used For |
|---|---|---|
| dbjourney-clone | `C:\Users\roy_b\Downloads\dbjourney-clone` | Layout structure, Tailwind/shadcn patterns, header/footer design |
| _ZOLIO | `C:\Users\roy_b\PROJECTS\_ZOLIO` | Admin page patterns, Firebase integration, inventory, auth, Tranzila payment |
