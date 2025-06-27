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

export interface SharedTherapistIntroduction extends Struct.ComponentSchema {
  collectionName: 'components_shared_therapist_introductions';
  info: {
    displayName: 'qa-answer';
  };
  attributes: {
    answer_text: Schema.Attribute.RichText;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label_en: Schema.Attribute.String;
    label_ja: Schema.Attribute.String;
    sort_order: Schema.Attribute.Integer;
    type_label: Schema.Attribute.String;
    type_value: Schema.Attribute.Enumeration<
      ['manager_comment', 'interview', 'features', 'qa']
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.gallery-image': SharedGalleryImage;
      'shared.therapist-introduction': SharedTherapistIntroduction;
    }
  }
}
