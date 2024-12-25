module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // Ensure consistent 'loose' mode
    ],
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // Ensure consistent 'loose' mode
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // Ensure consistent 'loose' mode
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
