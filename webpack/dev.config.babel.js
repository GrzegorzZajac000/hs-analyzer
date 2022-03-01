import { merge } from 'webpack-merge';

const webpack = require('webpack');
const path = require('path');

const baseConfig = require('./base.config.babel.js');

module.exports = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { importLoaders: 2, sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, postcssOptions: {
              plugins: [require.resolve('autoprefixer')]
            }}
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  devServer: {
    compress: false,
    hot: true,
    liveReload: true,
    host: '127.0.0.1',
    port: 3000,
    open: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Access-Control-Allow-Credentials': true
    },
    proxy: {
      '/api': {
        target: 'https://api.helium.io',
        pathRewrite: {'^/api' : ''}, // In this case we don't pass `api` path
        secure: false,
        changeOrigin: true
      }
    }
  }
});
