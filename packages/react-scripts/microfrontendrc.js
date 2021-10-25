const _ = require('lodash');

const paths = require('./config/paths');

const appPackageJson = require(paths.appPackageJson);

let mcf_override = {};

if (paths.mcfConfigFile) {
  mcf_override = require(paths.mcfConfigFile);
}

const moduleName = appPackageJson.name;

const slugName = _.kebabCase(moduleName).replace(/-/g, '_');

const defaultConfig = {
  name: slugName,
  exposes: {
    './App': './src/App',
  },
};

module.exports = _.merge(defaultConfig, mcf_override);
