import Link from 'next/link';
import Image from 'next/image';
import { mediaUrl } from '@/lib/strapi';
import type { Header as HeaderData, Theme, Navigation as Nav } from '@/lib/types';
import { localizeHref, type Locale } from '@/lib/i18n';
import Navigation from './Navigation';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({
  data,
  theme,
  nav,
  locale,
}: {
  data?: HeaderData | null;
  theme?: Theme | null;
  nav?: Nav | null;
  locale: Locale;
}) {
  const logo = mediaUrl(theme?.logo);
  return (
    <header className="site-header">
      <Link href={`/${locale}`} className="site-header__logo">
        {logo ? (
          <Image src={logo} alt="Logo" width={140} height={40} />
        ) : (
          <span>newsite</span>
        )}
      </Link>
      <Navigation nav={nav} locale={locale} />
      {data?.ctaLabel && data?.ctaUrl && (
        <Link className="btn" href={localizeHref(data.ctaUrl, locale)}>
          {data.ctaLabel}
        </Link>
      )}
      <LocaleSwitcher current={locale} />
    </header>
  );
}
