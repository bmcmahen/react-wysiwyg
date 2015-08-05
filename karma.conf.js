module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: [
      '__tests__/*.js'
    ],
    preprocessors: {
      '__tests__/*.js': [ 'browserify']
    },
    reporters: [ 'dots' ],
    browsers: ['Chrome'],
    logLevel: 'LOG_DEBUG',
    browserify: {
      debug: true,
      transform: ['babelify']
    },

    autoWatch: true
  });
};
