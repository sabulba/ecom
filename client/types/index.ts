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
