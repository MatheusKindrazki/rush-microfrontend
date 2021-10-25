const _ = require('lodash');

const paths = require('./config/paths');

const appPackageJson = require(paths.appPackageJson);

let mcf_override = {};

if (paths.mcfConfigFile) {
  mcf_override = require(paths.mcfConfigFile);
}

const moduleName = appPackageJson.name;

const sharedDependencies = [];

if (process.env.SHARED_DEPENDENCIES) {
  sharedDependencies = process.env.SHARED_DEPENDENCIES;
}

const moduleSharedDefaults = {
  react: {
    import: 'react',
    singleton: false,
    eager: true,
  },
  'react-dom': {
    import: 'react-dom',
    singleton: false,
    eager: true,
  },
};

const slugName = _.kebabCase(moduleName).replace(/-/g, '_');

const defaultConfig = {
  name: slugName,
  exposes: {
    './App': './src/App',
  },
  shared: {
    ...sharedDependencies,
    ...moduleSharedDefaults,
  },
};

module.exports = _.merge(defaultConfig, mcf_override);
