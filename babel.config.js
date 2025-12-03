module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        version: '3.19.4', // MUST MATCH your installed version
      },
    ],
  ],
};
