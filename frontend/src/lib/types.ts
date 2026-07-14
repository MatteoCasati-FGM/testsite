// Tipi allineati agli schemi Strapi. Semplificati per il test.

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export interface SeoComponent {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: StrapiMedia | null;
}

export interface LinkComponent {
  id: number;
  label: string;
  url: string;
  newTab?: boolean;
}

// --- Blocchi (dynamic zone) ---
// Ogni blocco porta __component = "blocks.<nome>"

export interface BlockBase {
  id: number;
  __component: string;
}

export interface HeroBlock extends BlockBase {
  __component: 'blocks.hero';
  heading?: string;
  subheading?: string;
  image?: StrapiMedia | null;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface RichTextBlock extends BlockBase {
  __component: 'blocks.rich-text';
  body?: string;
}

export interface TextImageBlock extends BlockBase {
  __component: 'blocks.text-image';
  heading?: string;
  body?: string;
  image?: StrapiMedia | null;
  imagePosition?: 'left' | 'right';
}

export interface CtaBlock extends BlockBase {
  __component: 'blocks.cta';
  heading?: string;
  text?: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

export interface BannerBlock extends BlockBase {
  __component: 'blocks.banner';
  heading?: string;
  text?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  variant: 'solid' | 'outline' | 'soft';
  align: 'left' | 'center';
}

export type Block =
  | HeroBlock
  | RichTextBlock
  | TextImageBlock
  | CtaBlock
  | BannerBlock;

// --- Content types ---

export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  seo?: SeoComponent | null;
  blocks?: Block[];
}

export interface Theme {
  primary?: string;
  background?: string;
  text?: string;
  fontBody?: string;
  fontHeading?: string;
  radius?: number;
  logo?: StrapiMedia | null;
}

export interface Navigation {
  items?: LinkComponent[];
}

export interface Header {
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface Footer {
  text?: string;
  links?: LinkComponent[];
}
