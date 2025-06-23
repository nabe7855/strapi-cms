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

export interface SharedPersonalities extends Struct.ComponentSchema {
  collectionName: 'components_shared_personalities';
  info: {
    displayName: 'personalities';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<
      ['cat', 'dog', 'mysterious', 'cute', 'wild', 'devilish']
    >;
  };
}

export interface SharedSkills extends Struct.ComponentSchema {
  collectionName: 'components_shared_skills';
  info: {
    displayName: 'skills';
  };
  attributes: {
    name: Schema.Attribute.Enumeration<
      ['date', 'oil', 'powder', 'sleepover', 'trip']
    >;
  };
}

export interface SharedVisualStyles extends Struct.ComponentSchema {
  collectionName: 'components_shared_visual_styles';
  info: {
    displayName: 'visualStyles';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<['model', 'macho', 'slim', 'athlete']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.gallery-image': SharedGalleryImage;
      'shared.personalities': SharedPersonalities;
      'shared.skills': SharedSkills;
      'shared.visual-styles': SharedVisualStyles;
    }
  }
}
