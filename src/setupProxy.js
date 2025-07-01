const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://prism-backend-8lk5.onrender.com',
      changeOrigin: true,
    })
  );
}; 