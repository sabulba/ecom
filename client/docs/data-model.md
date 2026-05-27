# Data Model

Full schema: `docs/superpowers/specs/2026-05-27-ecom-platform-design.md` — Section 5.

## Quick Reference (`tenants/{storeId}/`)

| Collection | Key Fields |
|---|---|
| `config/settings` | storeName, paymentMode, tranzilaSupplier |
| `productModels/{id}` | name, metaFields[] |
| `products/{id}` | name, modelId, price, images[], active |
| `inventory/{id}` | stock, reserved, threshold |
| `orders/{id}` | userId, cartItems[], totalAmount, status |
| `users/{id}` | email, firstName, lastName, role, status, fcmToken |
| `promotions/{id}` | title, body, inApp, push, status |

Root: `stores/{storeId}` → subdomain, storeName, active
