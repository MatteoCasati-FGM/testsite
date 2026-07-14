import type { RichTextBlock } from '@/lib/types';

// Campo Strapi di tipo "richtext" = markdown/HTML semplice.
// Per il test lo iniettiamo come HTML. In prod: sanitizzare o usare un parser.
export default function RichText({ body }: RichTextBlock) {
  if (!body) return null;
  return (
    <section className="block richtext">
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </section>
  );
}
