import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_banners';
  info: {
    displayName: 'Banner';
    icon: 'bell';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    variant: Schema.Attribute.Enumeration<['solid', 'outline', 'soft']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'solid'>;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ctas';
  info: {
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subheading: Schema.Attribute.Text;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'Rich Text';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface BlocksTextImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_images';
  info: {
    displayName: 'Text + Image';
    icon: 'picture';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'Seo';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.banner': BlocksBanner;
      'blocks.cta': BlocksCta;
      'blocks.hero': BlocksHero;
      'blocks.rich-text': BlocksRichText;
      'blocks.text-image': BlocksTextImage;
      'shared.link': SharedLink;
      'shared.seo': SharedSeo;
    }
  }
}
