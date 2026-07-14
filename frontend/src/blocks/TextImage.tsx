import Image from 'next/image';
import { mediaUrl } from '@/lib/strapi';
import type { TextImageBlock } from '@/lib/types';

export default function TextImage({
  heading,
  body,
  image,
  imagePosition = 'left',
}: TextImageBlock) {
  const img = mediaUrl(image);
  return (
    <section
      className={`block text-image text-image--${imagePosition}`}
    >
      {img && (
        <div className="text-image__media">
          <Image
            src={img}
            alt={image?.alternativeText || heading || ''}
            width={image?.width || 800}
            height={image?.height || 600}
          />
        </div>
      )}
      <div className="text-image__body">
        {heading && <h2>{heading}</h2>}
        {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
    </section>
  );
}
