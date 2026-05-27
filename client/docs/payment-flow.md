# Payment Flow

## Provider
Tranzila (Israeli payment gateway) — iframe-based.
Gateway URL: `https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi`

## Flow
1. User submits checkout form
2. API route validates stock via Firestore transaction (stock checked BEFORE order creation)
3. Order created with `status: 'pending'`
4. `payment.service.ts` constructs Tranzila iframe URL
5. Customer pays in iframe
6. Callback: `/payment-result?status=success&orderId=X` → order status: 'confirmed', cart cleared
7. Failure: `/payment-result?status=fail&orderId=X` → order status: 'failed', cart preserved

## Payment Modes (from store config)
| Mode | Behavior |
|---|---|
| card | Tranzila iframe |
| cash | Order created immediately |
| none | Order created immediately (demo) |

## PaymentService Interface (`lib/payment/payment.service.ts` — Phase 2)
```typescript
interface PaymentService {
  initiate(order: Order, config: PaymentConfig): PaymentSession
  onSuccess(orderId: string): Promise<void>
  onFailure(orderId: string): Promise<void>
}
```
To switch to Stripe: implement this interface in `lib/payment/stripe.service.ts`.