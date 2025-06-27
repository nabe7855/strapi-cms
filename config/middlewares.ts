export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000', // 開発用
        'https://premium-project-alpha.vercel.app', // 本番用（←追加）
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '10mb',
      formLimit: '10mb',
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
