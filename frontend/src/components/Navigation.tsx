import Link from 'next/link';
import type { Navigation as Nav } from '@/lib/types';
import { localizeHref, type Locale } from '@/lib/i18n';

export default function Navigation({
  nav,
  locale,
}: {
  nav?: Nav | null;
  locale: Locale;
}) {
  const items = nav?.items || [];
  if (!items.length) return null;
  return (
    <nav className="nav">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={localizeHref(item.url, locale)}
              target={item.newTab ? '_blank' : undefined}
              rel={item.newTab ? 'noopener noreferrer' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
