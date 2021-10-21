const path = require('path');
const webpack = require('webpack');

const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

const webpackDefault = require('./webpack/webpack.default');

const mcf_config = require('../mcf-config');

const utils = require('./webpack/utils');

const overrides = require('../config-overrides');

const {
  isEnvDevelopment,
  isEnvProduction,
  paths,
  shouldUseReactRefresh,
  shouldUseSourceMap,
} = utils;

const webpackMCFConfig = {
  mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
  bail: isEnvProduction,
  devtool: isEnvProduction
    ? shouldUseSourceMap
      ? 'source-map'
      : false
    : isEnvDevelopment && 'cheap-module-source-map',
  entry:
    isEnvDevelopment && !shouldUseReactRefresh
      ? [paths.appIndexJs]
      : paths.appIndexJs,
  output: {
    path: paths.appBuild,
    pathinfo: isEnvDevelopment,
    publicPath: paths.publicUrlOrPath,
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : /* webpack-5-react-scripts start */
        // : isEnvDevelopment && 'static/js/bundle.js',
        isEnvDevelopment && 'static/js/[name].js',
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : isEnvDevelopment && 'static/js/[name].chunk.js',
    devtoolModuleFilenameTemplate: isEnvProduction
      ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
      : isEnvDevelopment &&
        (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    globalObject: `(() => {
      if (typeof self !== 'undefined') {
          return self;
      } else if (typeof window !== 'undefined') {
          return window;
      } else if (typeof global !== 'undefined') {
          return global;
      } else {
          return Function('return this')();
      }
    })()`,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [...webpackDefault.module.rules],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),
    new ModuleFederationPlugin({
      ...mcf_config,
      filename: 'static/js/mcf-remote-[contenthash:22].js',
    }),
  ],
};

module.exports = () => {
  delete webpackDefault.module.rules;

  const config = merge(webpackDefault, webpackMCFConfig);

  const exportConfig = overrides.webpack(config, process.env.NODE_ENV);

  return exportConfig;
};
