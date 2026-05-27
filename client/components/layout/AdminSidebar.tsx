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
      <div className="flex h-16 items-center border-b px-6">
        <span className="font-bold text-lg">ECOM Admin</span>
      </div>
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
