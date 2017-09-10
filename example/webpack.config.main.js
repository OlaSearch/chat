var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './main',
  ],
  output: {
    path: path.join(__dirname, '..', 'demo'),
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      comments: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.BannerPlugin({ banner: "Copyright Ola Search Pte Ltd 2017", raw: false, entryOnly: true })
  ],
  resolve: {
    alias: {
      'olasearch': path.join(__dirname, './../../npm-olasearch'),
      'react': path.join(__dirname, './node_modules/react'),
      'prop-types': path.join(__dirname, './node_modules/prop-types'),
      'create-react-class': path.join(__dirname, './node_modules/create-react-class'),
      'object-assign': path.join(__dirname, './node_modules/object-assign'),
      'fbjs': path.join(__dirname, './node_modules/fbjs'),
      'react-redux': path.join(__dirname, './node_modules/react-redux'),
      'redux': path.join(__dirname, './node_modules/redux'),
      'react-dom': path.join(__dirname, './node_modules/react-dom')
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
    { test: require.resolve("react"), loader: "expose-loader?React" },
    { test: require.resolve("react-dom"), loader: "expose-loader?ReactDOM" },
    {
      test: /redux\/es\/index.js/,
      use: [
        {
          loader: 'expose-loader',
          options: 'Redux'
        }
      ]
    },
    {
      test: /react-redux\/es\/index.js/,
      use: [
        {
          loader: 'expose-loader',
          options: 'ReactRedux'
        }
      ]
    }
    ]
  },
  externals: {
    'moment': 'moment'
  }
}