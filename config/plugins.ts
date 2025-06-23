module.exports = {
  // Swaggerドキュメントの設定（そのままでOK）
  documentation: {
    enabled: true,
    config: {
      info: {
        name: "My API",
        description: "API for my awesome project",
        version: "1.0.0",
      },
    },
  },

  // Cloudinary プロバイダーの設定を追加
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      },
    },
  },
};
