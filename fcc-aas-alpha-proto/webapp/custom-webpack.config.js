const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        USER_POOL_ID: JSON.stringify(process.env.USER_POOL_ID),
        USER_POOL_WEB_CLIENT_ID: JSON.stringify(process.env.USER_POOL_WEB_CLIENT_ID),
        OAUTH_DOMAIN: JSON.stringify(process.env.OAUTH_DOMAIN)
      }
    })
  ],
  devServer: {
    proxy: {
      '/api': {
        target: process.env.FCC_ALPHA_GATEWAY,
        secure: false,
        logLevel: "info",
        changeOrigin: true
      }
    },
  },
}