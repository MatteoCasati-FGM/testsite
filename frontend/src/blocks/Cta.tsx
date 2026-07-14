import Link from 'next/link';
import type { CtaBlock } from '@/lib/types';
import { localizeHref, type Locale } from '@/lib/i18n';

export default function Cta({
  heading,
  text,
  buttonLabel,
  buttonUrl,
  locale,
}: CtaBlock & { locale: Locale }) {
  return (
    <section className="block cta">
      {heading && <h2>{heading}</h2>}
      {text && <p>{text}</p>}
      {buttonLabel && buttonUrl && (
        <Link className="btn" href={localizeHref(buttonUrl, locale)}>
          {buttonLabel}
        </Link>
      )}
    </section>
  );
}
