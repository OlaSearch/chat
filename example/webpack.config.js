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
      'olachat': path.resolve(__dirname, './../src')
    },
    modules: [
      'node_modules', path.resolve(__dirname, './node_modules')
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
    'houndify-web-sdk': 'Houndify'
  }
};
