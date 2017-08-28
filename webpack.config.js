const webpack = require('webpack');


module.exports = {
  entry: {
    app: __dirname + '/bin/run',
  },
  target: 'node',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  }
};


