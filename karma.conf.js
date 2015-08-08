module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: [
      '__tests__/*.js'
    ],
    preprocessors: {
      '__tests__/*.js': [ 'browserify']
    },
    reporters: [ 'mocha' ],
    browsers: ['Chrome'],
    logLevel: config.LOG_ERROR,
    browserify: {
      debug: true,
      transform: ['babelify']
    },

    client: {
      captureConsole: true
    },

    autoWatch: true
  });
};
