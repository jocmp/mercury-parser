module.exports = {
  transformIgnorePatterns: ['/node_modules/(?!ellipsize)'],
  transform: {
    '\\.js$': ['babel-jest', { configFile: './.babelrc' }],
  },
};
