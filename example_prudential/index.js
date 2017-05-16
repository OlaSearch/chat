import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, Bot, Search, ChatForm } from 'olachat'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { OlaProvider, createStore, Actions } from 'olasearch'
import config from 'olasearchconfig'
import { Parser, QueryBuilder, Http } from 'olasearch-solr-adapter'
import { createLoggerMiddleware } from 'olasearch-logger-middleware'
import { bot, user } from './avatars'

const logger = createLogger({ collapsed: true});
/* Optional loggerMiddleware */
let loggerMiddleware = createLoggerMiddleware({ logger: config.logger })
let store = createStore(config, { Parser, QueryBuilder, Http }, { Conversation: ChatReducer }, [ loggerMiddleware ])

/* Load default css */
require('olachat/style/chat.scss')
require('olachat/style/form/form.scss')
require('./style.scss')

/* Help menu */
config.helpItems = [
  {
    label: 'Feedback',
    url: 'https://prudential.com'
  },
  {
    label: 'Help',
    url: 'https://prudential.com'
  }
]

if (document.getElementById('root')) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <Bot
          headerProps={{
            title: 'Prudential FAQs'
          }}
          bubbleProps={{
            label: 'Ask me any questions about Prudential'
          }}
          botProps={{
            botName: 'Prudential'
          }}
          initialIntent='prudential.qa'
          avatarProps={{
            avatarBot: bot,
            avatarUser: user
          }}
        />
      </div>
    </OlaProvider>
    , document.getElementById('root')
  )
}

if (document.getElementById('olachat-search')) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <Search />
    </OlaProvider>
    , document.getElementById('olachat-search')
  )
}

if (document.getElementById('olachat-form')) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <ChatForm />
    </OlaProvider>
    , document.getElementById('olachat-form')
  )
}