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
require('./style.scss')

let root_div = document.getElementById('root')
let fdw_div = document.getElementById('fdw-root')

if (root_div) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <Bot initialIntent='maternity-leave' />
      </div>
    </OlaProvider>
    , root_div
  )
}

if (fdw_div) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <Bot
          initialIntent='fdw'
          headerProps={{
            title: 'FDW eligibility calculator'
          }}
          bubbleProps={{
            label: 'FDW eligibility calculator'
          }}
        />
      </div>
    </OlaProvider>
    , fdw_div
  )
}
