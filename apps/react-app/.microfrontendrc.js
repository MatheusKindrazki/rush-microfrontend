module.exports = {
  name: 'app1',
  shared: {
    react: {
      import: 'react',
      shareKey: 'react',
      shareScope: 'default',
      singleton: true,
    },
    'react-dom': {
      singleton: true,
    },
  },
};
