var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, '/'),
    filename: 'convo.min.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: true
      }
    })
  ],
  resolve: {
    alias: {
      'convo': path.resolve(__dirname, './../convo'),
      'parseForm': path.resolve(__dirname, './../parseForm')
    },
    fallback: path.resolve(__dirname, './node_modules')
  },
  module: {
    loaders: [{
      test: /\.js?/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, './../')
    },
    {
      test: /(\.scss|\.css)$/,
      loader: 'style!css!sass'
    }
    ]
  }
};
