var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './main'
  ],
  output: {
    path: path.join(__dirname, 'demo_steptwo'),
    filename: 'olasearch.core.min.js',
    library: 'OlaSearch',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      comments: false
    }),
  ],
  resolve: {
    alias: {
      'olasearch': path.join(__dirname, './../../npm-olasearch'),
      // 'react': 'preact-compat',
      // 'react-dom': 'preact-compat',
      'react': path.join(__dirname, './node_modules/react'),
      'react-dom': path.join(__dirname, './node_modules/react-dom')
      // 'olasearch-elasticsearch-adapter': path.join(__dirname, './../npm-olasearch-elasticsearch-adapter')
    },
    modules: [
      'node_modules', path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './../node_modules')
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
      { test: require.resolve("react"), loader: "expose?React" },
      { test: require.resolve("react-dom"), loader: "expose?ReactDOM" },
      // { test: /ramda/, loader: "expose?R" },
      { test: require.resolve("redux"), loader: "expose?Redux" },
      { test: require.resolve("react-redux"), loader: "expose?ReactRedux" }
    ]
  }
}
