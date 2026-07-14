import Image from 'next/image';
import Link from 'next/link';
import { mediaUrl } from '@/lib/strapi';
import type { HeroBlock } from '@/lib/types';
import { localizeHref, type Locale } from '@/lib/i18n';

export default function Hero({
  heading,
  subheading,
  image,
  ctaLabel,
  ctaUrl,
  locale,
}: HeroBlock & { locale: Locale }) {
  const img = mediaUrl(image);
  return (
    <section className="block hero">
      {img && (
        <Image
          className="hero__bg"
          src={img}
          alt={image?.alternativeText || heading || ''}
          width={image?.width || 1600}
          height={image?.height || 900}
          priority
        />
      )}
      <div className="hero__inner">
        {heading && <h1>{heading}</h1>}
        {subheading && <p className="hero__sub">{subheading}</p>}
        {ctaLabel && ctaUrl && (
          <Link className="btn" href={localizeHref(ctaUrl, locale)}>
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
