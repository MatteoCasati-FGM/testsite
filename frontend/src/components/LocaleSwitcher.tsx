'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

// Cambia lingua mantenendo il percorso corrente (sostituisce il prefisso locale).
export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;
  const rest = pathname.replace(/^\/[^/]+/, ''); // toglie /<locale>

  if (locales.length < 2) return null;

  return (
    <div className="locale-switcher">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          aria-current={l === current ? 'true' : undefined}
          className={l === current ? 'is-active' : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
