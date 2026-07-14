import Link from 'next/link';
import type { BannerBlock } from '@/lib/types';
import { localizeHref, type Locale } from '@/lib/i18n';

// Le varianti sono definite QUI, in React: l'editor Strapi sceglie solo
// tra le opzioni che ho disegnato (solid/outline/soft, left/center).
// Nessuna libertà su colori/spaziature → il brand resta coerente.
const VARIANT_CLASS: Record<BannerBlock['variant'], string> = {
  solid: 'banner--solid',
  outline: 'banner--outline',
  soft: 'banner--soft',
};

const ALIGN_CLASS: Record<BannerBlock['align'], string> = {
  left: 'banner--left',
  center: 'banner--center',
};

export default function Banner({
  heading,
  text,
  buttonLabel,
  buttonUrl,
  variant,
  align,
  locale,
}: BannerBlock & { locale: Locale }) {
  const cls = `block banner ${VARIANT_CLASS[variant] ?? VARIANT_CLASS.solid} ${
    ALIGN_CLASS[align] ?? ALIGN_CLASS.left
  }`;
  return (
    <section className={cls}>
      <div className="banner__inner">
        {heading && <h2>{heading}</h2>}
        {text && <p>{text}</p>}
        {buttonLabel && buttonUrl && (
          <Link className="btn banner__btn" href={localizeHref(buttonUrl, locale)}>
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
