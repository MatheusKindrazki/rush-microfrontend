'use strict';

const path = require('path');

const webpack = require('webpack');
const resolve = require('resolve');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('wbpk-5-cra-utils/ForkTsCheckerWebpackPlugin');
const InlineChunkHtmlPlugin = require('wbpk-5-cra-utils/InlineChunkHtmlPlugin');
const typescriptFormatter = require('wbpk-5-cra-utils/typescriptFormatter');
const getCacheIdentifier = require('wbpk-5-cra-utils/getCacheIdentifier');

const utils = require('./utils');

const {
  disableESLintPlugin,
  emitErrorsAsWarnings,
  hasJsxRuntime,
  isEnvDevelopment,
  isEnvProduction,
  isEnvProductionProfile,
  paths,
  shouldUseReactRefresh,
  shouldInlineRuntimeChunk,
  shouldUseSourceMap,
  useTypeScript,
} = utils;

module.exports = {
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: isEnvProductionProfile,
          keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: process.env.CI ? false : true,
        sourceMap: shouldUseSourceMap,
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          customize: require.resolve(
            'babel-preset-react-app-webpack-5/webpack-overrides'
          ),
          presets: [
            [
              require.resolve('babel-preset-react-app-webpack-5'),
              {
                runtime: hasJsxRuntime ? 'automatic' : 'classic',
              },
            ],
          ],
          // @remove-on-eject-begin
          babelrc: false,
          configFile: false,
          cacheIdentifier: getCacheIdentifier(
            isEnvProduction ? 'production' : isEnvDevelopment && 'development',
            [
              'babel-plugin-named-asset-import',
              'babel-preset-react-app-webpack-5',
              'react-dev-utils',
              'wbpk-5-cra-utils',
              'hub-scripts',
            ]
          ),
          // @remove-on-eject-end
          plugins: [
            [
              require.resolve('babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent:
                      '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                  },
                },
              },
            ],
            isEnvDevelopment &&
              shouldUseReactRefresh &&
              require.resolve('react-refresh/babel'),
          ].filter(Boolean),
          cacheDirectory: true,
          cacheCompression: false,
          compact: isEnvProduction,
        },
      },
      {
        test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [
            [
              /* webpack-5-react-scripts start */
              require.resolve('babel-preset-react-app-webpack-5/dependencies'),
              /* webpack-5-react-scripts end */
              { helpers: true },
            ],
          ],
          cacheDirectory: true,
          // See #6846 for context on why cacheCompression is disabled
          cacheCompression: false,
          // @remove-on-eject-begin
          cacheIdentifier: getCacheIdentifier(
            isEnvProduction ? 'production' : isEnvDevelopment && 'development',
            [
              'babel-plugin-named-asset-import',
              'babel-preset-react-app-webpack-5',
              'react-dev-utils',
              'hub-scripts',
            ]
          ),
          // @remove-on-eject-end
          sourceMaps: shouldUseSourceMap,
          inputSourceMap: shouldUseSourceMap,
        },
      },
    ],
  },
  plugins: [
    isEnvProduction &&
      shouldInlineRuntimeChunk &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    // TypeScript type checking
    useTypeScript &&
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync('typescript', {
          basedir: paths.appNodeModules,
        }),
        async: isEnvDevelopment,
        checkSyntacticErrors: true,
        resolveModuleNameModule: process.versions.pnp
          ? `${__dirname}/pnpTs.js`
          : undefined,
        resolveTypeReferenceDirectiveModule: process.versions.pnp
          ? `${__dirname}/pnpTs.js`
          : undefined,
        tsconfig: paths.appTsConfig,
        reportFiles: [
          // This one is specifically to match during CI tests,
          // as micromatch doesn't match
          // '../cra-template-typescript/template/src/App.tsx'
          // otherwise.
          '../**/src/**/*.{ts,tsx}',
          '**/src/**/*.{ts,tsx}',
          '!**/src/**/__tests__/**',
          '!**/src/**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
          '!**/src/setupTests.*',
        ],
        silent: true,
        formatter: isEnvProduction ? typescriptFormatter : undefined,
      }),
    !disableESLintPlugin &&
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('wbpk-5-cra-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
        context: paths.appSrc,
        cache: true,
        cacheLocation: path.resolve(
          paths.appNodeModules,
          '.cache/.eslintcache'
        ),
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
      }),
  ].filter(Boolean),
};
