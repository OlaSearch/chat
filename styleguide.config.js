var path = require('path')
var { version } = require('./package.json')
const { styles, theme } = require('./styleguide/styleguide.styles')

function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function upperFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  title: `Ola Chat UI - ${version}`,
  showUsage: true,
  styleguideDir: 'docs',
  styleguideComponents: {
    // StyleGuideRenderer: path.join(__dirname, './styleguide/styleguide.wrapper')
    Wrapper: path.join(__dirname, './styleguide/styleguide.wrapper')
  },
  template: './styleguide/styleguide.template.html',
  editorConfig: { theme: 'cobalt' },  
  theme,
  styles,
  // resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  context: {
    olaconfig: path.resolve(__dirname, './styleguide/styleguide.olaconfig'),    
    store: path.resolve(__dirname, './styleguide/styleguide.store'),    
    // SearchState: function (state) {
    //   return {
    //     AppState: state.AppState,
    //     QueryState: state.QueryState
    //   }
    // }
  },
  sections: [
    {
      name: '',
      content: './styleguide/Docs.md'
    },
    {
      name: 'Installation',
      content: './styleguide/Installation.md'
    },
    {
      name: 'Usage',
      content: './styleguide/Usage.md'
    },
    {
      name: 'Components',
      // components: './src/*.js'
      components: () => {
        return [
          './src/Avatar.js',
          './src/Bubble.js',
          './src/Card.js',
          './src/FailureButtons.js',
          './src/Geo.js',
          './src/HelpMenu.js',
          './src/Input.js',
          './src/InviteNotification.js',
          './src/Loader.js',
          './src/Message.js',
          './src/MessageFeedback.js',
          './src/OfflineIndicator.js',
          './src/QuerySuggestions.js',
          './src/SearchResultsMessage.js',
          './src/QuickReplies.js',
          './src/SlotOptions.js',
          './src/TopicSuggestions.js',
          './src/TypingIndicator.js',
          './src/Voice.js',
        ]
      }
    }  
  ],
  require: [
    // path.resolve(__dirname, './setup.js'),
    path.join(__dirname, './../npm-olasearch/style/core.scss'),
    path.join(__dirname, './style/chat.scss'),    
    // path.resolve(__dirname, './src/index.js')
  ],
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, '.js')
    const name = dirname.split('/').slice(-1)[0]
    const componentName = upperFirst(camelCase(name))
    const libDirName = dirname.replace(/src/gi, 'lib')

    return `import ${componentName} from '@olasearch/core/${libDirName}'`
  },
  webpackConfig: {
    // crossOriginLoading: true,
    resolve: {
      alias: {
        'olasearchconfig': path.join(__dirname, 'styleguide/styleguide.olaconfig'),
        '@olasearch/core': path.join(__dirname, './../npm-olasearch'),
        '@olasearch/chat': path.join(__dirname, './src'),
        'OlaSearch': '@olasearch/core',        
        // 'OlaSearch': path.join(__dirname, './../npm-olasearch'),
      }
    },
    externals: {
      
    },
    module: {
      rules: [
        {
          test: /\.js?/,
          use: ['babel-loader'],
          exclude: /node_modules/,
          include: [
            path.join(__dirname, './src'),
            path.join(__dirname, './styleguide')
          ]
        },
        {
          test: /(\.scss|\.css)$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    }
  }
}

