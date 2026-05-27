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
