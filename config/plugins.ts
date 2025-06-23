export default ({ env }) => {
  // ✅ Cloudinary 設定値のデバッグログ出力（Railwayログに出る）
  console.log("🔍 [DEBUG] Cloudinary ENV CHECK", {
    CLOUDINARY_NAME: env('CLOUDINARY_NAME'),
    CLOUDINARY_KEY: env('CLOUDINARY_KEY'),
    CLOUDINARY_SECRET: env('CLOUDINARY_SECRET') ? '✅ SET' : '❌ NOT SET',
  });

  return {
    // Swagger ドキュメント（任意）
    documentation: {
      enabled: true,
      config: {
        info: {
          name: 'My API',
          description: 'API for my awesome project',
          version: '1.0.0',
        },
      },
    },

    // Cloudinary 設定
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
      },
    },
  };
};
