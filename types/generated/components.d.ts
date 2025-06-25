import type { Schema, Struct } from '@strapi/strapi';

export interface SharedGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_images';
  info: {
    displayName: 'GalleryImage';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    imageUrl: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['image', 'video']>;
    videoUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.gallery-image': SharedGalleryImage;
    }
  }
}
