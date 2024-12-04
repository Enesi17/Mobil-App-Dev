const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ignore source maps for missing files
  config.ignoreWarnings = [
    (warning) =>
      warning.message &&
      warning.message.includes('source-map-loader') &&
      warning.message.includes('ENOENT'),
  ];

  return config;
};
