const fs = require('fs');

const paths = require('./config/paths');
const _ = require('lodash');

const appPackageJson = require(paths.appPackageJson);

let mcf_override = {};

if (fs.existsSync(paths.mcf_config)) {
  mcf_override = require(paths.mcf_config);
}

const moduleName = appPackageJson.name;

const deps = appPackageJson.dependencies;

const sharedDependencies = [];

if (process.env.SHARED_DEPENDENCIES) {
  Object.entries(deps).forEach(([key, value]) => {
    if (shared.includes(key)) {
      sharedDependencies.push(key);
    }
  });
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
  exposes: ['./src'],
  shared: {
    ...sharedDependencies,
    ...moduleSharedDefaults,
  },
};

module.exports = _.merge(defaultConfig, mcf_override);
