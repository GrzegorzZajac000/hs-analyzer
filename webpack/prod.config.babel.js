import config from './config';
import { merge } from 'webpack-merge';

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1;
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();

const webpack 		= require('webpack');
const path 				= require('path');
const baseConfig 	= require('./base.config.babel.js');

// Plugins
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Env
const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader?cacheDirectory' }]
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { importLoaders: 2, sourceMap: false }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: false, postcssOptions: {
              plugins: [require.resolve('autoprefixer')]
            }}
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: false }
          }
        ]
      }
    ]
  },
  optimization: {
    moduleIds: 'named',
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({ parallel: true })
    ]
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: config.favicon,
      prefix: 'favicon/',
      favicons: {
        appName: config.title,
        appShortName: config.shortName,
        appDescription: 'Helium hotspot tool for analysis',
        developerName: 'Grzegorz Zając',
        developerURL: 'grzegorz.zajac000@gmail.com',
        lang: 'en-US',
        background: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: `https://${config.domain}/`,
        version: '1.0.0'
      }
    }),
    new MiniCssExtractPlugin({
      filename: `css/[name].${year}_${month}_${day}_${config.buildHash}.css`
    }),
    new CopyWebpackPlugin(config.copyFilesProd),
    new CompressionPlugin({
      algorithm: 'gzip',
      compressionOptions: { level: 9 },
      filename: '[path][name].gz[query]',
      minRatio: 0.8,
      test: /\.(js|css|html|eot|ttf)$/,
      threshold: 10240
    })
  ]
});
