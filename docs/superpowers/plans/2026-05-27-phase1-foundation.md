# ECOM Platform — Phase 1: Foundation & Infrastructure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the full monorepo skeleton — Next.js client, Firebase Cloud Functions server, multi-tenancy infrastructure, auth, base layout, and all shared types — so that Phases 2–4 can build features without any infrastructure decisions pending.

**Architecture:** Hybrid SSR + CSR Next.js App Router app. Public pages use Server Components with Firebase Admin SDK for SEO. Admin pages use Client Components with Firebase Client SDK + TanStack Query. Tenant identity is resolved from subdomain at request time and injected via StoreContext.

**Tech Stack:** Next.js (latest) + React 19 + TypeScript, Tailwind 4 + shadcn/ui, Zustand 5, TanStack Query 5, Firebase 11 (client + admin), React Hook Form + Zod, Jest + React Testing Library.

---

## File Map

### Root
```
ecom/
├── README.md
├── .gitignore
└── firebase.json
```

### client/
```
client/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.ts
├── components.json                       # shadcn config
├── jest.config.ts
├── jest.setup.ts
├── middleware.ts                          # auth + store guard
├── app/
│   ├── globals.css                        # Tailwind 4 + theme tokens
│   ├── layout.tsx                         # Root layout — StoreProvider + QueryProvider + AuthProvider
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (public)/
│       └── page.tsx                       # Placeholder landing (Phase 2 fills it)
├── components/
│   ├── layout/
│   │   ├── Header.tsx                     # Public sticky header
│   │   ├── Footer.tsx                     # Public footer (dark inverted)
│   │   ├── AnnouncementBar.tsx            # In-app promotions bar
│   │   └── AdminSidebar.tsx              # Persistent admin nav
│   └── providers/
│       ├── QueryProvider.tsx              # TanStack Query client
│       └── AuthProvider.tsx              # Firebase auth state listener
├── lib/
│   ├── firebase/
│   │   ├── firebase-admin.ts
│   │   └── firebase-client.ts
│   ├── auth/
│   │   └── auth.ts                        # signIn, signUp, signOut, Google, resetPassword
│   └── tenant.ts                          # resolveStoreId(hostname)
├── store/
│   ├── storeContext.tsx                   # StoreContext + StoreProvider + useStore
│   ├── authStore.ts                       # Zustand auth store
│   └── cartStore.ts                       # Zustand cart store (localStorage persisted)
├── types/
│   └── index.ts                           # All shared interfaces
├── hooks/
│   └── useFCM.ts                          # FCM token registration
└── docs/
    ├── auth-flow.md
    ├── multi-tenancy.md
    ├── payment-flow.md
    ├── data-model.md
    └── admin-features.md
```

### server/
```
server/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts                           # Exports placeholder (Phase 4 fills functions)
```

---

## Task 1: Initialize Monorepo + Git

**Files:**
- Create: `ecom/.gitignore`
- Create: `ecom/firebase.json`
- Create: `ecom/.firebaserc`

- [ ] **Step 1: Initialize git repo**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git init
git remote add origin https://github.com/sabulba/ecom.git
```

- [ ] **Step 2: Create .gitignore**

Create `C:\Users\roy_b\PROJECTS\ECOM\.gitignore`:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
client/.next/
client/out/

# Firebase
.firebase/
server/lib/

# Environment
.env
.env.local
.env.*.local
!.env.example

# Build
dist/

# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

- [ ] **Step 3: Create firebase.json**

Create `C:\Users\roy_b\PROJECTS\ECOM\firebase.json`:
```json
{
  "hosting": {
    "public": "client/out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  },
  "functions": {
    "source": "server",
    "runtime": "nodejs20"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

- [ ] **Step 4: Create .firebaserc**

Create `C:\Users\roy_b\PROJECTS\ECOM\.firebaserc`:
```json
{
  "projects": {
    "default": "ecom-d2f6c"
  }
}
```

- [ ] **Step 5: Create root README**

Create `C:\Users\roy_b\PROJECTS\ECOM\README.md`:
```markdown
# ECOM Platform

Multi-tenant ecommerce platform. Next.js (App Router) + Firebase + TypeScript.

## Structure
- `client/` — Next.js frontend (public store + admin panel)
- `server/` — Firebase Cloud Functions

## Quick Start

### Prerequisites
- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- Authenticated: `firebase login`

### Client
```bash
cd client
npm install
cp .env.example .env.local   # fill in Firebase keys
npm run dev
```

### Server (Cloud Functions)
```bash
cd server
npm install
npm run build
firebase deploy --only functions
```

## Environment Variables
See `client/.env.example` for required variables.

## Deploy
```bash
firebase deploy
```

## Tech Stack
- Next.js (latest) + React 19 + TypeScript
- Tailwind 4 + shadcn/ui
- Firebase (Firestore, Auth, Storage, FCM, Functions)
- Zustand (client state) + TanStack Query (server state)
- React Hook Form + Zod

## Docs
- [Auth Flow](client/docs/auth-flow.md)
- [Multi-Tenancy](client/docs/multi-tenancy.md)
- [Payment Flow](client/docs/payment-flow.md)
- [Data Model](client/docs/data-model.md)
- [Admin Features](client/docs/admin-features.md)
```

---

## Task 2: Bootstrap Next.js Client App

**Files:**
- Create: `client/package.json`
- Create: `client/tsconfig.json`
- Create: `client/next.config.ts`
- Create: `client/postcss.config.ts`
- Create: `client/.env.example`

- [ ] **Step 1: Create client/package.json**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\package.json`:
```json
{
  "name": "ecom-client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "firebase": "^11.0.0",
    "firebase-admin": "^13.0.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.56.0",
    "@tanstack/react-table": "^8.20.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "recharts": "^2.13.0",
    "sonner": "^1.7.0",
    "lucide-react": "^0.460.0",
    "next-themes": "^0.4.0",
    "clsx": "^2.1.1",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^2.5.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.5.2",
    "ts-jest": "^29.2.0",
    "@types/jest": "^29.5.0"
  }
}
```

- [ ] **Step 2: Create client/tsconfig.json**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create client/next.config.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create client/postcss.config.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\postcss.config.ts`:
```typescript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

- [ ] **Step 5: Create .env.example**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\.env.example`:
```bash
# Firebase Client SDK (public — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecom-d2f6c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Firebase Admin SDK (secret — never expose)
FIREBASE_PROJECT_ID=ecom-d2f6c
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Multi-tenancy: fallback storeId for localhost dev
NEXT_PUBLIC_STORE_ID=ecom-d2f6c
```

- [ ] **Step 6: Install dependencies**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npm install
```

Expected: `node_modules/` populated, no peer dependency errors.

---

## Task 3: Configure Tailwind 4 + shadcn/ui

**Files:**
- Create: `client/app/globals.css`
- Create: `client/components.json`

- [ ] **Step 1: Create globals.css with Tailwind 4 + OkLch theme tokens**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0 0);
  --color-secondary-foreground: oklch(0.205 0 0);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-accent: oklch(0.97 0 0);
  --color-accent-foreground: oklch(0.205 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-border: oklch(0.922 0 0);
  --color-input: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);

  /* chart colors */
  --color-chart-1: oklch(0.646 0.222 41.116);
  --color-chart-2: oklch(0.6 0.118 184.704);
  --color-chart-3: oklch(0.398 0.07 227.392);
  --color-chart-4: oklch(0.828 0.189 84.429);
  --color-chart-5: oklch(0.769 0.188 70.08);

  /* radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --radius-xl: 0.75rem;
}

.dark {
  @theme {
    --color-background: oklch(0.145 0 0);
    --color-foreground: oklch(0.985 0 0);
    --color-card: oklch(0.205 0 0);
    --color-card-foreground: oklch(0.985 0 0);
    --color-primary: oklch(0.922 0 0);
    --color-primary-foreground: oklch(0.205 0 0);
    --color-secondary: oklch(0.269 0 0);
    --color-secondary-foreground: oklch(0.985 0 0);
    --color-muted: oklch(0.269 0 0);
    --color-muted-foreground: oklch(0.708 0 0);
    --color-accent: oklch(0.269 0 0);
    --color-accent-foreground: oklch(0.985 0 0);
    --color-destructive: oklch(0.704 0.191 22.216);
    --color-border: oklch(1 0 0 / 10%);
    --color-input: oklch(1 0 0 / 15%);
    --color-ring: oklch(0.556 0 0);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: Create components.json (shadcn config)**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 3: Create lib/utils.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Install core shadcn components**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npx shadcn@latest add button input label card badge separator sheet dialog dropdown-menu table tabs select textarea toast avatar
```

Expected: `components/ui/` populated with component files.

---

## Task 4: Define Shared TypeScript Types

**Files:**
- Create: `client/types/index.ts`
- Create: `client/lib/__tests__/types.test.ts`

- [ ] **Step 1: Write type guard tests**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\__tests__\types.test.ts`:
```typescript
import { isAppUser, isOrder } from '@/types';

describe('type guards', () => {
  describe('isAppUser', () => {
    it('returns true for a valid AppUser', () => {
      const user = {
        id: 'uid1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123',
        role: 'customer',
        status: 'active',
        storeId: 'ecom-d2f6c',
        createdAt: Date.now(),
      };
      expect(isAppUser(user)).toBe(true);
    });

    it('returns false when role is missing', () => {
      expect(isAppUser({ email: 'test@test.com' })).toBe(false);
    });
  });

  describe('isOrder', () => {
    it('returns true for a valid Order', () => {
      const order = {
        id: 'order1',
        userId: 'uid1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        cartItems: [],
        totalAmount: 100,
        status: 'pending',
        createdAt: Date.now(),
      };
      expect(isOrder(order)).toBe(true);
    });

    it('returns false for invalid status', () => {
      expect(isOrder({ status: 'invalid' })).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npm test -- --testPathPattern=types.test
```

Expected: FAIL — `isAppUser` not defined.

- [ ] **Step 3: Create types/index.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\types\index.ts`:
```typescript
export interface MetaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
}

export interface ProductModel {
  id: string;
  name: string;
  metaFields: MetaField[];
}

export interface Product {
  id: string;
  name: string;
  modelId: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  baseProps: Record<string, unknown>;
  metaProps: Record<string, unknown>;
  active: boolean;
  createdAt: number;
}

export interface InventoryItem {
  stock: number;
  reserved: number;
  threshold: number;
  lastUpdated: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
  metaProps: Record<string, unknown>;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'failed';

export interface Order {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  cartItems: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentRef?: string;
  remark?: string;
  createdAt: number;
}

export type UserRole = 'customer' | 'manager' | 'admin' | 'superAdmin';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  storeId: string;
  fcmToken?: string;
  createdAt: number;
}

export interface StoreConfig {
  storeName: string;
  logo: string;
  currency: string;
  paymentMode: 'card' | 'cash' | 'none';
  tranzilaSupplier: string;
}

export interface Store {
  id: string;
  subdomain: string;
  storeName: string;
  active: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  targetAudience: 'all' | 'customers' | string[];
  inApp: boolean;
  push: boolean;
  status: 'draft' | 'sent' | 'scheduled' | 'inactive';
  scheduledAt?: number;
  sentAt?: number;
  reachCount: number;
}

export interface PaymentConfig {
  mode: 'card' | 'cash' | 'none';
  tranzilaSupplier: string;
}

export interface PaymentSession {
  iframeUrl: string;
  orderId: string;
}

// Type guards
export function isAppUser(obj: unknown): obj is AppUser {
  if (typeof obj !== 'object' || obj === null) return false;
  const u = obj as Record<string, unknown>;
  return (
    typeof u.email === 'string' &&
    typeof u.role === 'string' &&
    ['customer', 'manager', 'admin', 'superAdmin'].includes(u.role as string)
  );
}

export function isOrder(obj: unknown): obj is Order {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed'];
  return (
    typeof o.status === 'string' &&
    validStatuses.includes(o.status as OrderStatus)
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npm test -- --testPathPattern=types.test
```

Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/types/ client/lib/__tests__/
git commit -m "feat: add shared TypeScript interfaces and type guards"
```

---

## Task 5: Configure Jest

**Files:**
- Create: `client/jest.config.ts`
- Create: `client/jest.setup.ts`

- [ ] **Step 1: Create jest.config.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\jest.config.ts`:
```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(config);
```

- [ ] **Step 2: Create jest.setup.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\jest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Run full test suite**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npm test
```

Expected: PASS — types tests pass, jest setup confirmed.

---

## Task 6: Firebase SDK Configuration

**Files:**
- Create: `client/lib/firebase/firebase-admin.ts`
- Create: `client/lib/firebase/firebase-client.ts`
- Create: `client/lib/__tests__/firebase-client.test.ts`

- [ ] **Step 1: Write Firebase client initialization test**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\__tests__\firebase-client.test.ts`:
```typescript
describe('firebase-client', () => {
  it('exports auth, db, and storage without throwing', async () => {
    // Dynamic import to allow Jest module mocking
    const mod = await import('@/lib/firebase/firebase-client');
    expect(mod.auth).toBeDefined();
    expect(mod.db).toBeDefined();
    expect(mod.storage).toBeDefined();
    expect(typeof mod.getMessagingInstance).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=firebase-client.test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create lib/firebase/firebase-client.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\firebase\firebase-client.ts`:
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};
```

- [ ] **Step 4: Create lib/firebase/firebase-admin.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\firebase\firebase-admin.ts`:
```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function initAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = initAdmin();

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
```

- [ ] **Step 5: Run Firebase client test**

```bash
npm test -- --testPathPattern=firebase-client.test
```

Expected: PASS.

- [ ] **Step 6: Copy .env.example to .env.local and fill Firebase keys**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
copy .env.example .env.local
```

Then open `.env.local` and fill in the Firebase project values from the Firebase console for project `ecom-d2f6c`.

- [ ] **Step 7: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/lib/firebase/ client/lib/__tests__/firebase-client.test.ts
git commit -m "feat: add Firebase admin and client SDK configuration"
```

---

## Task 7: Multi-Tenancy — Subdomain Resolution + StoreContext

**Files:**
- Create: `client/lib/tenant.ts`
- Create: `client/lib/__tests__/tenant.test.ts`
- Create: `client/store/storeContext.tsx`
- Create: `client/store/__tests__/storeContext.test.tsx`

- [ ] **Step 1: Write subdomain resolution tests**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\__tests__\tenant.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern=tenant.test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create lib/tenant.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\tenant.ts`:
```typescript
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
```

- [ ] **Step 4: Run tenant tests**

```bash
npm test -- --testPathPattern=tenant.test
```

Expected: PASS — 5 tests pass (localhost tests pass; Firestore tests are skipped since they only run for non-localhost).

- [ ] **Step 5: Write StoreContext tests**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\store\__tests__\storeContext.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react';
import { StoreProvider, useStore } from '@/store/storeContext';

function TestComponent() {
  const { storeId } = useStore();
  return <div data-testid="store-id">{storeId}</div>;
}

describe('StoreContext', () => {
  it('provides storeId to children', () => {
    render(
      <StoreProvider storeId="test-store">
        <TestComponent />
      </StoreProvider>
    );
    expect(screen.getByTestId('store-id').textContent).toBe('test-store');
  });

  it('throws when useStore is called outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useStore must be used within StoreProvider');
    consoleError.mockRestore();
  });
});
```

- [ ] **Step 6: Run StoreContext tests to confirm they fail**

```bash
npm test -- --testPathPattern=storeContext.test
```

Expected: FAIL — module not found.

- [ ] **Step 7: Create store/storeContext.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\store\storeContext.tsx`:
```typescript
'use client';
import { createContext, useContext, type ReactNode } from 'react';

interface StoreContextValue {
  storeId: string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ storeId, children }: { storeId: string; children: ReactNode }) {
  return (
    <StoreContext.Provider value={{ storeId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
```

- [ ] **Step 8: Run StoreContext tests**

```bash
npm test -- --testPathPattern=storeContext.test
```

Expected: PASS — 2 tests pass.

- [ ] **Step 9: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/lib/tenant.ts client/lib/__tests__/tenant.test.ts client/store/storeContext.tsx client/store/__tests__/storeContext.test.tsx
git commit -m "feat: add subdomain-based tenant resolution and StoreContext"
```

---

## Task 8: Zustand Stores — Auth + Cart

**Files:**
- Create: `client/store/authStore.ts`
- Create: `client/store/cartStore.ts`
- Create: `client/store/__tests__/authStore.test.ts`
- Create: `client/store/__tests__/cartStore.test.ts`

- [ ] **Step 1: Write authStore tests**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\store\__tests__\authStore.test.ts`:
```typescript
import { useAuthStore } from '@/store/authStore';
import type { AppUser } from '@/types';

const mockUser: AppUser = {
  id: 'uid1',
  email: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '123456789',
  role: 'customer',
  status: 'active',
  storeId: 'ecom-d2f6c',
  createdAt: Date.now(),
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: false });
  });

  it('isLoggedIn returns false when user is null', () => {
    expect(useAuthStore.getState().isLoggedIn()).toBe(false);
  });

  it('isLoggedIn returns true after setUser', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isLoggedIn()).toBe(true);
  });

  it('isAdmin returns false for customer role', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().isAdmin()).toBe(false);
  });

  it('isAdmin returns true for admin role', () => {
    useAuthStore.getState().setUser({ ...mockUser, role: 'admin' });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
  });

  it('isAdmin returns true for superAdmin role', () => {
    useAuthStore.getState().setUser({ ...mockUser, role: 'superAdmin' });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
  });

  it('setUser to null clears the user', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
```

- [ ] **Step 2: Write cartStore tests**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\store\__tests__\cartStore.test.ts`:
```typescript
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

const mockItem: CartItem = {
  productId: 'prod1',
  name: 'Test Product',
  price: 100,
  qty: 1,
  imageUrl: 'https://example.com/img.jpg',
  metaProps: {},
};

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts with empty cart', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('addItem adds a new product', () => {
    useCartStore.getState().addItem(mockItem);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('addItem increments qty if product already in cart', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem(mockItem);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2);
  });

  it('removeItem removes a product', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().removeItem('prod1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clearCart empties the cart', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('totalAmount calculates correctly', () => {
    useCartStore.getState().addItem({ ...mockItem, qty: 2, price: 50 });
    expect(useCartStore.getState().totalAmount()).toBe(100);
  });

  it('itemCount returns total quantity across all items', () => {
    useCartStore.getState().addItem({ ...mockItem, qty: 3 });
    expect(useCartStore.getState().itemCount()).toBe(3);
  });
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern="authStore.test|cartStore.test"
```

Expected: FAIL — modules not found.

- [ ] **Step 4: Create store/authStore.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\store\authStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '@/types';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      isLoggedIn: () => get().user !== null,
      isAdmin: () => ['admin', 'superAdmin'].includes(get().user?.role ?? ''),
      isManager: () => ['manager', 'admin', 'superAdmin'].includes(get().user?.role ?? ''),
    }),
    { name: 'ecom-auth-store' }
  )
);
```

- [ ] **Step 5: Create store/cartStore.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\store\cartStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === newItem.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? { ...i, qty: i.qty + newItem.qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
      totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'ecom-cart-store' }
  )
);
```

- [ ] **Step 6: Run store tests**

```bash
npm test -- --testPathPattern="authStore.test|cartStore.test"
```

Expected: PASS — 13 tests pass.

- [ ] **Step 7: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/store/authStore.ts client/store/cartStore.ts client/store/__tests__/
git commit -m "feat: add Zustand auth and cart stores with full test coverage"
```

---

## Task 9: Firebase Auth Helpers

**Files:**
- Create: `client/lib/auth/auth.ts`
- Create: `client/lib/__tests__/auth.test.ts`

- [ ] **Step 1: Write auth helper tests**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\__tests__\auth.test.ts`:
```typescript
import {
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOut,
  sendPasswordReset,
} from '@/lib/auth/auth';

// Mock firebase/auth
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
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=auth.test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create lib/auth/auth.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\lib\auth\auth.ts`:
```typescript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase-client';

const googleProvider = new GoogleAuthProvider();

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}
```

- [ ] **Step 4: Run auth tests**

```bash
npm test -- --testPathPattern=auth.test
```

Expected: PASS — 5 tests pass.

- [ ] **Step 5: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/lib/auth/ client/lib/__tests__/auth.test.ts
git commit -m "feat: add Firebase auth helpers (email, Google, password reset)"
```

---

## Task 10: Next.js Middleware (Auth + Store Guard)

**Files:**
- Create: `client/middleware.ts`

- [ ] **Step 1: Create middleware.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\middleware.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/store', '/store/', '/payment-result'];
const AUTH_PATHS = ['/login', '/register'];
const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;
  const isAuthenticated = Boolean(sessionCookie);

  // Redirect authenticated users away from auth pages
  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Note: Full role-based admin guard (reading Firestore `user.role`) is enforced on the admin layout server component, not in edge middleware, to avoid cold-start latency and keep middleware lightweight.

- [ ] **Step 2: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/middleware.ts
git commit -m "feat: add Next.js edge middleware for auth and admin route protection"
```

---

## Task 11: Providers — QueryProvider + AuthProvider

**Files:**
- Create: `client/components/providers/QueryProvider.tsx`
- Create: `client/components/providers/AuthProvider.tsx`

- [ ] **Step 1: Create components/providers/QueryProvider.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components\providers\QueryProvider.tsx`:
```typescript
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

- [ ] **Step 2: Create components/providers/AuthProvider.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components\providers\AuthProvider.tsx`:
```typescript
'use client';
import { useEffect, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase-client';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/storeContext';
import type { AppUser } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const { storeId } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(
          doc(db, 'tenants', storeId, 'users', firebaseUser.uid)
        );
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as AppUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId, setUser, setLoading]);

  return <>{children}</>;
}
```

- [ ] **Step 3: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/components/providers/
git commit -m "feat: add TanStack Query and Firebase auth state providers"
```

---

## Task 12: Root Layout

**Files:**
- Create: `client/app/layout.tsx`

- [ ] **Step 1: Create app/layout.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { resolveStoreIdFromHostname } from '@/lib/tenant';
import { StoreProvider } from '@/store/storeContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ECOM Store',
  description: 'Your online store',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const hostname = headersList.get('host') ?? 'localhost';
  const storeId = (await resolveStoreIdFromHostname(hostname)) ?? process.env.NEXT_PUBLIC_STORE_ID ?? '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreProvider storeId={storeId}>
            <QueryProvider>
              <AuthProvider>
                {children}
                <Toaster position="top-right" richColors />
              </AuthProvider>
            </QueryProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create placeholder public page**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\(public)\page.tsx`:
```typescript
export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Landing page — Phase 2</p>
    </main>
  );
}
```

- [ ] **Step 3: Start dev server and verify app loads**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npm run dev
```

Open `http://localhost:3000`. Expected: page renders "Landing page — Phase 2" without errors. Check browser console for no Firebase errors.

- [ ] **Step 4: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/app/layout.tsx client/app/
git commit -m "feat: add root layout with StoreProvider, QueryProvider, and AuthProvider"
```

---

## Task 13: Public Layout Components (Header, Footer, AnnouncementBar)

**Files:**
- Create: `client/components/layout/Header.tsx`
- Create: `client/components/layout/Footer.tsx`
- Create: `client/components/layout/AnnouncementBar.tsx`

- [ ] **Step 1: Create components/layout/AnnouncementBar.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components\layout\AnnouncementBar.tsx`:
```typescript
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
```

- [ ] **Step 2: Create components/layout/Header.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components\layout\Header.tsx`:
```typescript
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/store', label: 'Store' },
  { href: '/store?category=new', label: 'New Arrivals' },
  { href: '/store?category=sale', label: 'Sale' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { isLoggedIn } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/" className="text-xl font-bold tracking-tight">
            ECOM
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search size={20} />
          </Button>
          <Link href={isLoggedIn() ? '/account' : '/login'}>
            <Button variant="ghost" size="icon" aria-label="Account">
              <User size={20} />
            </Button>
          </Link>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className={cn('lg:hidden border-t', mobileOpen ? 'block' : 'hidden')}>
        <nav className="flex flex-col px-4 py-3 gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create components/layout/Footer.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components\layout\Footer.tsx`:
```typescript
import Link from 'next/link';

const SOCIAL_LINKS = [
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'Facebook' },
  { href: '#', label: 'Twitter' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refund', label: 'Refund Policy' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <span className="text-2xl font-bold tracking-tight">ECOM</span>

          {/* Social links */}
          <div className="flex gap-6">
            {SOCIAL_LINKS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-wrap justify-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs text-background/50 hover:text-background/80 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} ECOM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Add Header + Footer to public layout**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\(public)\layout.tsx`:
```typescript
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: sticky header with logo, nav, cart icon; footer with dark background below.

- [ ] **Step 6: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/components/layout/ client/app/\(public\)/layout.tsx
git commit -m "feat: add public layout components — Header, Footer, AnnouncementBar"
```

---

## Task 14: Admin Layout (Sidebar + AdminLayout)

**Files:**
- Create: `client/components/layout/AdminSidebar.tsx`
- Create: `client/app/admin/layout.tsx`
- Create: `client/app/admin/page.tsx`

- [ ] **Step 1: Create components/layout/AdminSidebar.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\components\layout\AdminSidebar.tsx`:
```typescript
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Megaphone,
  Warehouse,
  BarChart2,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/lib/auth/auth';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/product-models', label: 'Product Models', icon: Layers },
  { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/reports/sales', label: 'Reports', icon: BarChart2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    setUser(null);
    router.push('/login');
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Store name */}
      <div className="flex h-16 items-center border-b px-6">
        <span className="font-bold text-lg">ECOM Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create app/admin/layout.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\admin\layout.tsx`:
```typescript
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const sessionCookie = headersList.get('cookie')
    ?.split(';')
    .find((c) => c.trim().startsWith('session='))
    ?.split('=')[1];

  if (!sessionCookie) {
    redirect('/login?redirect=/admin');
  }

  // Verify session and check role
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
```

- [ ] **Step 3: Create admin dashboard placeholder**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\admin\page.tsx`:
```typescript
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground">Admin dashboard — Phase 3</p>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/components/layout/AdminSidebar.tsx client/app/admin/
git commit -m "feat: add admin layout with sidebar and server-side role guard"
```

---

## Task 15: Login + Register Pages

**Files:**
- Create: `client/app/(auth)/login/page.tsx`
- Create: `client/app/(auth)/register/page.tsx`
- Create: `client/app/(auth)/layout.tsx`

- [ ] **Step 1: Create auth layout**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\(auth)\layout.tsx`:
```typescript
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create app/(auth)/login/page.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\(auth)\login\page.tsx`:
```typescript
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-muted-foreground hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" className="w-full" onClick={onGoogle} disabled={loading}>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create app/(auth)/register/page.tsx**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\app\(auth)\register\page.tsx`:
```typescript
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerWithEmail, signInWithGoogle } from '@/lib/auth/auth';
import { db } from '@/lib/firebase/firebase-client';
import { useStore } from '@/store/storeContext';
import { Separator } from '@/components/ui/separator';

const registerSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Invalid phone number'),
  password: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { storeId } = useStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    setLoading(true);
    try {
      const credential = await registerWithEmail(data.email, data.password);
      await setDoc(doc(db, 'tenants', storeId, 'users', credential.user.uid), {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'customer',
        status: 'active',
        storeId,
        createdAt: Date.now(),
      });
      toast.success('Account created!');
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      const credential = await signInWithGoogle();
      const { user } = credential;
      const userRef = doc(db, 'tenants', storeId, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email ?? '',
        firstName: user.displayName?.split(' ')[0] ?? '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') ?? '',
        phone: '',
        role: 'customer',
        status: 'active',
        storeId,
        createdAt: Date.now(),
      }, { merge: true });
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Fill in your details to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>First name</Label>
              <Input {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Last name</Label>
              <Input {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input type="tel" {...register('phone')} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Confirm password</Label>
            <Input type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" className="w-full" onClick={onGoogle} disabled={loading}>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Verify login page in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/login`. Expected: login card renders with email/password fields, Google button, forgot password link, and sign up link. No console errors.

- [ ] **Step 5: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/app/\(auth\)/
git commit -m "feat: add login and register pages with email/password and Google auth"
```

---

## Task 16: FCM Hook

**Files:**
- Create: `client/hooks/useFCM.ts`

- [ ] **Step 1: Create hooks/useFCM.ts**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\hooks\useFCM.ts`:
```typescript
'use client';
import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { getMessagingInstance } from '@/lib/firebase/firebase-client';
import { db } from '@/lib/firebase/firebase-client';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/storeContext';

export function useFCM() {
  const { user } = useAuthStore();
  const { storeId } = useStore();

  useEffect(() => {
    if (!user) return;

    async function registerToken() {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (token && user) {
          await updateDoc(doc(db, 'tenants', storeId, 'users', user.id), {
            fcmToken: token,
          });
        }
      } catch {
        // Permission denied or not supported — silently skip
      }
    }

    registerToken();
  }, [user, storeId]);
}
```

- [ ] **Step 2: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/hooks/useFCM.ts
git commit -m "feat: add useFCM hook for FCM token registration on login"
```

---

## Task 17: Initialize Cloud Functions Server

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/index.ts`

- [ ] **Step 1: Create server/package.json**

Create `C:\Users\roy_b\PROJECTS\ECOM\server\package.json`:
```json
{
  "name": "ecom-functions",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "firebase deploy --only functions"
  },
  "engines": { "node": "20" },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^13.0.0",
    "firebase-functions": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0"
  }
}
```

- [ ] **Step 2: Create server/tsconfig.json**

Create `C:\Users\roy_b\PROJECTS\ECOM\server\tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

- [ ] **Step 3: Create server/src/index.ts (placeholder)**

Create `C:\Users\roy_b\PROJECTS\ECOM\server\src\index.ts`:
```typescript
import * as admin from 'firebase-admin';

admin.initializeApp();

// Cloud Functions are added in Phase 4.
// Exported here to keep the deploy target valid.
export {};
```

- [ ] **Step 4: Install server dependencies**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\server
npm install
```

- [ ] **Step 5: Build to verify TypeScript compiles**

```bash
npm run build
```

Expected: `lib/index.js` created, no TypeScript errors.

- [ ] **Step 6: Create server/README.md**

Create `C:\Users\roy_b\PROJECTS\ECOM\server\README.md`:
```markdown
# ECOM Cloud Functions

Firebase Cloud Functions for the ECOM platform.

## Setup

```bash
npm install
```

## Local development

```bash
npm run serve
# Starts Firebase emulator with functions
```

## Deploy

```bash
npm run deploy
# Or from root: firebase deploy --only functions
```

## Functions (added in Phase 4)

| Function | Trigger | Purpose |
|---|---|---|
| `onOrderCreate` | Firestore onCreate `tenants/{id}/orders/{id}` | Send order confirmation email |
| `deductInventory` | Firestore onCreate `tenants/{id}/orders/{id}` | Reduce stock for cart items |
| `sendPromotion` | HTTP callable | Fan-out FCM push notifications |
| `onLowStock` | Firestore onUpdate `tenants/{id}/inventory/{id}` | Alert admin on low stock |
| `onUserRegister` | Firebase Auth onCreate | Initialize user doc |
```

- [ ] **Step 7: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add server/
git commit -m "feat: initialize Cloud Functions server with TypeScript config"
```

---

## Task 18: Client Documentation

**Files:**
- Create: `client/README.md`
- Create: `client/docs/auth-flow.md`
- Create: `client/docs/multi-tenancy.md`
- Create: `client/docs/payment-flow.md`
- Create: `client/docs/data-model.md`
- Create: `client/docs/admin-features.md`

- [ ] **Step 1: Create client/README.md**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\README.md`:
```markdown
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
```

- [ ] **Step 2: Create docs/auth-flow.md**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\docs\auth-flow.md`:
```markdown
# Auth Flow

## Providers
- Firebase Email/Password (`signInWithEmailAndPassword`)
- Google OAuth (`signInWithPopup` + `GoogleAuthProvider`)

## Registration
1. User fills form (email, password, firstName, lastName, phone)
2. `createUserWithEmailAndPassword` → Firebase Auth user created
3. User doc written to `tenants/{storeId}/users/{uid}` with `role: customer`, `status: active`
4. Google: `signInWithPopup` → user doc created with `setDoc({ merge: true })`

## Session
- Firebase session cookies stored as `session` HTTP-only cookie
- Next.js middleware reads the cookie and redirects unauthenticated requests to `/login`
- Admin layout server component verifies cookie with `adminAuth.verifySessionCookie()` and checks role

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

## Password Reset
- `sendPasswordResetEmail(auth, email)` — Firebase sends reset link
- Available from `/login` page via "Forgot password?" link
```

- [ ] **Step 3: Create docs/multi-tenancy.md**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\docs\multi-tenancy.md`:
```markdown
# Multi-Tenancy

## Strategy
Subdomain-based tenant resolution. Each store has a unique subdomain (e.g., `mystore.ecom.app`). The app resolves the `storeId` at request time from the subdomain.

## Resolution Flow
1. `resolveStoreIdFromHostname(hostname)` in `lib/tenant.ts`
2. Extracts subdomain with `extractSubdomain(hostname)`
3. Queries `stores` Firestore collection where `subdomain == extracted && active == true`
4. Returns `storeId` (Firestore document ID)
5. Localhost fallback: returns `NEXT_PUBLIC_STORE_ID` from env

## StoreContext
- `StoreProvider` wraps the entire app in `app/layout.tsx`
- `storeId` is resolved server-side in the root layout and passed as a prop
- Components access it via `useStore()` hook

## All Firestore Paths
All tenant data lives under `tenants/{storeId}/`. Use `useStore()` to get `storeId`:
```typescript
const { storeId } = useStore();
const ref = collection(db, 'tenants', storeId, 'products');
```

## Local Development
Set `NEXT_PUBLIC_STORE_ID=ecom-d2f6c` in `.env.local`. The subdomain resolution falls back to this value for `localhost`.

## Adding a New Store
1. Create a Firebase project (or use same project with new storeId)
2. Add doc to root `stores` collection: `{ subdomain: 'newstore', storeName: '...', active: true }`
3. Deploy client with subdomain pointing to the hosting URL
```

- [ ] **Step 4: Create docs/payment-flow.md**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\docs\payment-flow.md`:
```markdown
# Payment Flow

## Provider
Tranzila (Israeli payment gateway) — iframe-based integration.
Gateway URL: `https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi`

## Flow
1. User submits checkout form
2. API route validates stock availability via Firestore transaction
3. Order created in Firestore with `status: 'pending'`
4. `payment.service.ts` constructs Tranzila iframe URL with `supplier` + `orderId`
5. Customer completes payment in iframe
6. Tranzila calls back to `/payment-result?status=success&orderId=X` or `?status=fail&orderId=X`
7. Success: order updated to `status: 'confirmed'`, cart cleared
8. Fail: order updated to `status: 'failed'`, cart preserved

## Payment Modes (from store config)
| Mode | Behavior |
|---|---|
| card | Tranzila iframe shown |
| cash | Order created immediately, no payment |
| none | Order created immediately (demo/admin mode) |

## PaymentService Interface
Located at `lib/payment/payment.service.ts`:
```typescript
interface PaymentService {
  initiate(order: Order, config: PaymentConfig): PaymentSession
  onSuccess(orderId: string): Promise<void>
  onFailure(orderId: string): Promise<void>
}
```
To switch to Stripe: implement this interface in `lib/payment/stripe.service.ts` and swap the import.

## Stock Validation
Stock is checked BEFORE order creation using a Firestore transaction in the checkout API route.
If any cart item has insufficient stock, the order is rejected with a user-facing error.
```

- [ ] **Step 5: Create docs/data-model.md (reference to spec)**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\docs\data-model.md`:
```markdown
# Data Model

Full Firestore schema is documented in the design spec:
`docs/superpowers/specs/2026-05-27-ecom-platform-design.md` — Section 5.

## Quick Reference

All paths are relative to `tenants/{storeId}/`:

| Collection | Key Fields |
|---|---|
| `config/settings` | storeName, paymentMode, tranzilaSupplier |
| `productModels/{id}` | name, metaFields[] |
| `products/{id}` | name, modelId, price, images[], baseProps, metaProps, active |
| `inventory/{id}` | stock, reserved, threshold |
| `orders/{id}` | userId, cartItems[], totalAmount, status, paymentRef |
| `users/{id}` | email, firstName, lastName, role, status, fcmToken |
| `promotions/{id}` | title, body, inApp, push, status |

Root collection: `stores/{storeId}` → subdomain, storeName, active
```

- [ ] **Step 6: Create docs/admin-features.md (reference to spec)**

Create `C:\Users\roy_b\PROJECTS\ECOM\client\docs\admin-features.md`:
```markdown
# Admin Features

Full admin page specs are in the design spec:
`docs/superpowers/specs/2026-05-27-ecom-platform-design.md` — Section 8.

## Role Access

| Feature | manager | admin | superAdmin |
|---|---|---|---|
| Orders | ✓ | ✓ | ✓ |
| Users | ✗ | ✓ | ✓ |
| Products | ✓ | ✓ | ✓ |
| Product Models | ✓ | ✓ | ✓ |
| Promotions | ✓ | ✓ | ✓ |
| Inventory | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | ✓ |

## Admin Routes
- `/admin` — Dashboard
- `/admin/orders` — Orders management (5.1)
- `/admin/users` — Users management (5.2)
- `/admin/products` — Products management (5.3)
- `/admin/product-models` — Product model designer (5.4)
- `/admin/promotions` — Promotions + FCM (5.5)
- `/admin/inventory` — Inventory management (5.6)
- `/admin/reports/sales` — Sales report (6.1)
- `/admin/reports/inventory` — Inventory report (6.2)
```

- [ ] **Step 7: Commit**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git add client/README.md client/docs/
git commit -m "docs: add client README and full documentation for auth, tenancy, payment, data model, admin"
```

---

## Task 19: Run Full Test Suite + Final Commit

- [ ] **Step 1: Run all tests**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM\client
npm test
```

Expected: All tests pass. Minimum passing: types (4), tenant (5), storeContext (2), authStore (6), cartStore (7), auth (5) = 29 tests.

- [ ] **Step 2: Run dev server and smoke test**

```bash
npm run dev
```

Check the following URLs manually:
- `http://localhost:3000` — landing placeholder renders
- `http://localhost:3000/login` — login card renders, no errors
- `http://localhost:3000/register` — register card renders
- `http://localhost:3000/admin` — redirects to `/login` (not authenticated)

- [ ] **Step 3: Final push**

```bash
cd C:\Users\roy_b\PROJECTS\ECOM
git push -u origin main
```

Expected: remote `main` branch updated at https://github.com/sabulba/ecom.

---

## Phase 1 Complete

All foundation infrastructure is in place. Proceed to:

- **Phase 2:** `docs/superpowers/plans/2026-05-27-phase2-public-store.md` — Landing page, store, product, cart, checkout, Tranzila payment
- **Phase 3:** `docs/superpowers/plans/2026-05-27-phase3-admin-panel.md` — All 6 admin pages
- **Phase 4:** `docs/superpowers/plans/2026-05-27-phase4-reports-functions.md` — Reports + Cloud Functions
