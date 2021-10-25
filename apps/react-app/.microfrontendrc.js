module.exports = {
  exposes: {
    './App': './src/App',
  },
  shared: {
    react: {
      singleton: true,
      strictVersion: true,
      // version: require('react').version,
      requiredVersion: require('react').version,
      eager: true,
    },
  },
};
