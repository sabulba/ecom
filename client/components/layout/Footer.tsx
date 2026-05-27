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
          <span className="text-2xl font-bold tracking-tight">ECOM</span>
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
