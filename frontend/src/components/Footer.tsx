import Link from 'next/link';
import type { Footer as FooterData } from '@/lib/types';
import { localizeHref, type Locale } from '@/lib/i18n';

export default function Footer({
  data,
  locale,
}: {
  data?: FooterData | null;
  locale: Locale;
}) {
  const links = data?.links || [];
  return (
    <footer className="site-footer">
      {links.length > 0 && (
        <ul className="site-footer__links">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={localizeHref(l.url, locale)}
                target={l.newTab ? '_blank' : undefined}
                rel={l.newTab ? 'noopener noreferrer' : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {data?.text && <p className="site-footer__text">{data.text}</p>}
    </footer>
  );
}
