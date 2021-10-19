const fs = require('fs');

const { config_overrides } = require('./config/paths');

let override = {};

if (fs.existsSync(config_overrides)) {
  override = require(config_overrides);
}

const webpack =
  typeof override === 'function'
    ? override
    : override.webpack || ((config, env) => config);

if (override.devserver) {
  console.log(
    'Warning: `devserver` has been deprecated. Please use `devServer` instead as ' +
      '`devserver` will not be used in the next major release.'
  );
}

const devServer =
  override.devServer ||
  override.devserver ||
  (configFunction => (proxy, allowedHost) =>
    configFunction(proxy, allowedHost));

const jest = override.jest || (config => config);

const pathsOverride = override.paths || ((paths, env) => paths);

// normalized overrides functions
module.exports = {
  webpack,
  devServer,
  jest,
  paths: pathsOverride,
};
