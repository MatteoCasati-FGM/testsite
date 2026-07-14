import type { Block } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import Hero from './Hero';
import RichText from './RichText';
import TextImage from './TextImage';
import Cta from './Cta';
import Banner from './Banner';

// BLOCK MAP: __component Strapi → componente React.
// Aggiungere un blocco = una riga qui + il file del componente.
const MAP: Record<string, React.ComponentType<any>> = {
  'blocks.hero': Hero,
  'blocks.rich-text': RichText,
  'blocks.text-image': TextImage,
  'blocks.cta': Cta,
  'blocks.banner': Banner,
};

export function BlockRenderer({
  blocks = [],
  locale,
}: {
  blocks?: Block[];
  locale: Locale;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = MAP[block.__component];
        if (!Component) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn(`Nessun renderer per il blocco "${block.__component}"`);
          }
          return null;
        }
        return <Component key={block.id ?? i} {...block} locale={locale} />;
      })}
    </>
  );
}
