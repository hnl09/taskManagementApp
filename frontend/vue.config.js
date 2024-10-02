const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/auth': {
        target: 'https://backend-241188129306.southamerica-east1.run.app',
        changeOrigin: true,
        pathRewrite: { '^/auth': '/auth' },
      },
      '/tasks': {
        target: 'https://backend-241188129306.southamerica-east1.run.app',
        changeOrigin: true,
        pathRewrite: { '^/tasks': '/tasks' },
      },
    },
  },
  transpileDependencies: true
})