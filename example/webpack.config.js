var path = require('path')
var webpack = require('webpack')

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'OlaSearch': path.join(__dirname, './../../npm-olasearch'),
      '@olasearch/core': path.join(__dirname, './../../npm-olasearch'),
      '@olasearch/solr-adapter': path.join(__dirname, './../../npm-olasearch-solr-adapter'),
      '@olasearch/logger': path.join(__dirname, './../../olasearch-logger-middleware'),
      '@olasearch/chat': path.resolve(__dirname, './../src'),
      '@olasearch/icons': path.resolve(__dirname, './../../ola-icons'),
      'react': path.join(__dirname, './../node_modules/react'),
      'react-dom': path.join(__dirname, './../node_modules/react-dom'),
      'react-addons-css-transition-group': 'standalone-react-css-transition-group',
      'react-redux': path.join(__dirname, './node_modules/react-redux'),
      'olasearchconfig': path.join(__dirname, './config.wp')
    },
    modules: [
      'node_modules', path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './../node_modules')
    ]
  },
  module: {
    rules: [{
      test: /\.js?/,
      use: ['babel-loader'],
      exclude: /node_modules/,
      include: [
        path.join(__dirname, './'),
        path.join(__dirname, './../src')
      ],
    },
    {
      test: /(\.scss|\.css)$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
    ]
  },
  externals: {
    'houndify-web-sdk': 'Houndify',
    'binaryjs': 'BinaryClient'
  }
};
