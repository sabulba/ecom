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
