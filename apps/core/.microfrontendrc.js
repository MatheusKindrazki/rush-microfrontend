module.exports = {
  exposes: {},
  shared: {
    react: {
      singleton: true,
      strictVersion: true,
      // version: require('react').version,
      requiredVersion: require('react').version,
      eager: true,
    },
  },
  remotes: {
    'react-app':
      'psdlabs_react_app@http://localhost:3001/static/js/mcf-remote.js',
  },
};
