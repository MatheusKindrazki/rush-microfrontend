const fs = require('fs');

const paths = require('../../paths');
const getClientEnvironment = require('../../env');

function webpackUtils() {
  const hasJsxRuntime = (() => {
    if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
      return false;
    }

    try {
      require.resolve('react/jsx-runtime');
      return true;
    } catch (e) {
      return false;
    }
  })();

  const shouldUseReactRefresh = false;

  const useTypeScript = fs.existsSync(paths.appTsConfig);
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  const isEnvDevelopment = process.env.WEBPACK_ENV === 'development';
  const isEnvProduction = process.env.WEBPACK_ENV === 'production';

  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

  const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

  const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
  const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';

  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');

  const swSrc = paths.swSrc;

  return {
    env,
    swSrc,
    paths,
    hasJsxRuntime,
    isEnvDevelopment,
    isEnvProduction,
    useTypeScript,
    shouldUseSourceMap,
    shouldInlineRuntimeChunk,
    emitErrorsAsWarnings,
    shouldUseReactRefresh,
    isEnvProductionProfile,
    disableESLintPlugin,
  };
}

module.exports = webpackUtils();
