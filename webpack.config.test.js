const path = require('path');

module.exports = {
  entry: './test/rotate.test.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tests.test.js'
  },
  mode: 'development'
}