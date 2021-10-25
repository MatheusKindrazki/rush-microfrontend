module.exports = {
  shared: {
    react: {
      requiredVersion: require('react').version,
      import: 'react',
      shareKey: 'react',
      shareScope: 'default',
      singleton: true,
    },
    'react-dom': {
      requiredVersion: require('react-dom').version,
      singleton: true,
    },
  },
};
