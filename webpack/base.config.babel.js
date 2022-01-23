import config from './config';
require('dotenv').config();

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1;
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();

const webpack = require('webpack');
const path = require('path');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// Env
const isProd = process.env.NODE_ENV === 'production';

console.log('\x1b[33m%s\x1b[0m', 'Production: ' + isProd);
console.log('Build Hash: ' + config.buildHash);

module.exports = {
  entry: {
    main: `${config.src}/index.js`
  },
  target: 'web',
  mode: isProd ? 'production' : 'development',
  output: {
    path: path.join(__dirname, '/../static/'),
    filename: `js/[name].${year}_${month}_${day}_${config.buildHash}.bundle.js`
  },
  module: {
    rules: [
      {
        test: /normal[/\\].*\.(gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/',
              publicPath: 'images/',
              name: '[name].[ext]?version=[contenthash]'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/',
              publicPath: 'images/',
              name: '[name].[ext]?version=[contenthash]'
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx']
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new HtmlWebpackPlugin({
      chunks: ['main'],
      title: config.title,
      filename: 'index.html',
      inject: false,
      hash: false,
      minify: config.HTMLminify,
      cache: true,
      showErrors: true,
      preload: '**/*.*',
      prefetch: '**/*.*',
      template: `${config.src}/index.html`,
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          isProd,
          buildHash: config.buildHash,
          year,
          month,
          day
        };
      },
      isProd,
      buildHash: config.buildHash,
      year,
      month,
      day
    }),
    new StyleLintPlugin({
      configFile: config.SCSSLintConfigFile,
      failOnError: true,
      failOnWarning: true,
      files: './src/**/*.s?(a|c)ss'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
        DOMAIN: JSON.stringify(process.env.DOMAIN)
      }
    })
  ]
};
