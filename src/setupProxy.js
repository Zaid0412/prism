const { createProxyMiddleware } = require('http-proxy-middleware');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://prism-backend-8lk5.onrender.com',
      changeOrigin: true,
    })
  );
}; 