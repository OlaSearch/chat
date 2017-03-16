import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, Bot } from 'olachat'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { OlaProvider, createStore, Actions } from 'olasearch'
import config from 'olasearchconfig'
import { Parser, QueryBuilder, Http } from 'olasearch-solr-adapter'
import { createLoggerMiddleware } from 'olasearch-logger-middleware'

const logger = createLogger({ collapsed: true});
// const store = createStore(combineReducers({ Conversation: ChatReducer }), applyMiddleware(thunk, logger))
/* Optional loggerMiddleware */
let loggerMiddleware = createLoggerMiddleware({ logger: config.logger })
let store = createStore(config, { Parser, QueryBuilder, Http }, { Conversation: ChatReducer }, [ loggerMiddleware ])

/* Load default css */
require('olachat/style/chat.scss')

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
        initialIntent='prudential-qa'
      />
    </div>
  </OlaProvider>
  , document.getElementById('root')
)

