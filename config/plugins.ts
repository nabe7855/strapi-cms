export default ({ env }) => {
  const cloudName = env('CLOUDINARY_NAME');
  const cloudKey = env('CLOUDINARY_KEY');
  const cloudSecret = env('CLOUDINARY_SECRET');

  // ✅ Cloudinary 設定値のデバッグログ出力（Railwayログに出る）
  console.log("🔍 [DEBUG] Cloudinary ENV CHECK", {
    CLOUDINARY_NAME: cloudName,
    CLOUDINARY_KEY: cloudKey,
    CLOUDINARY_SECRET: cloudSecret ? '✅ SET' : '❌ NOT SET',
  });

  // ❗ 万が一の null チェック（env ファイルの記述漏れ確認用）
  if (!cloudName || !cloudKey || !cloudSecret) {
    console.warn("⚠️ Cloudinary 環境変数が一部未設定です。画像アップロードが失敗する可能性があります。");
  }

  return {
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

    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: cloudName,
          api_key: cloudKey,
          api_secret: cloudSecret,
        },
      },
    },
  };
};
