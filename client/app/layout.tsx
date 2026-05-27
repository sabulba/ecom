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
