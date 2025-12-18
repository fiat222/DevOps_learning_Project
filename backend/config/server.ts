export default ({ env }) => ({
  host: '0.0.0.0',
  port: 1337,
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    url: '/admin',
    serveAdminPanel: true,
  },
});
//ต้องมี admin ไม่งั้นพัง