'use strict';

const fs = require('fs');
const webpack = require('webpack');

const { merge } = require('webpack-merge');

const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleScopePlugin = require('wbpk-5-cra-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('wbpk-5-cra-utils/ModuleNotFoundPlugin');
const InterpolateHtmlPlugin = require('wbpk-5-cra-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('wbpk-5-cra-utils/WatchMissingNodeModulesPlugin');

const utils = require('./utils');
const modules = require('../modules');

const webpackCSS = require('./webpack.configCSS');
const webpackJS = require('./webpack.configJS');
const webpackFile = require('./webpack.configFile');

const {
  env,
  paths,
  swSrc,
  useTypeScript,
  isEnvDevelopment,
  isEnvProduction,
  isEnvProductionProfile,
  shouldInlineRuntimeChunk,
  shouldUseReactRefresh,
} = utils;

const appPackageJson = require(paths.appPackageJson);

const webpackDevClientEntry = require.resolve(
  'wbpk-5-cra-utils/webpackHotDevClient'
);
const reactRefreshOverlayEntry = require.resolve(
  'wbpk-5-cra-utils/refreshOverlayInterop'
);

const webpackDefault = {
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      modules.additionalModulePaths || []
    ),
    extensions: paths.moduleFileExtensions
      .map(ext => `.${ext}`)
      .filter(ext => useTypeScript || !ext.includes('ts')),
    alias: {
      'react-native': 'react-native-web',
      ...(isEnvProductionProfile && {
        'react-dom$': 'react-dom/profiling',
        shouldInlineRuntimeChunk,
        shouldUseReactRefresh,
        'scheduler/tracing': 'scheduler/tracing-profiling',
      }),
      ...(modules.webpackAliases || {}),
    },
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin(paths.appSrc, [
        appPackageJson,
        reactRefreshOverlayEntry,
      ]),
    ],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  module: {
    rules: [],
  },

  optimization: {
    minimizer: [],
  },

  plugins: [
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new ModuleNotFoundPlugin(paths.appPath),
    new webpack.DefinePlugin(env.stringified),
    isEnvDevelopment &&
      shouldUseReactRefresh &&
      new ReactRefreshWebpackPlugin({
        overlay: {
          entry: webpackDevClientEntry,
          module: reactRefreshOverlayEntry,
          sockIntegration: false,
        },
      }),
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    isEnvProduction &&
      fs.existsSync(swSrc) &&
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc,
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
  ].filter(Boolean),
  performance: false,
};

let mergeConfig = webpackDefault;

const configs = [webpackCSS, webpackFile, webpackJS];

configs.forEach(config => {
  mergeConfig = merge(mergeConfig, config);
});

module.exports = mergeConfig;
