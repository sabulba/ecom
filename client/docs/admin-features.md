# Admin Features

Full specs: `docs/superpowers/specs/2026-05-27-ecom-platform-design.md` — Section 8.

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
- `/admin/orders` — Orders (5.1)
- `/admin/users` — Users (5.2)
- `/admin/products` — Products (5.3)
- `/admin/product-models` — Product Model Designer (5.4)
- `/admin/promotions` — Promotions + FCM (5.5)
- `/admin/inventory` — Inventory (5.6)
- `/admin/reports/sales` — Sales Report (6.1)
- `/admin/reports/inventory` — Inventory Report (6.2)
