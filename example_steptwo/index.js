import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, Bot } from 'olachat'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { OlaProvider, createStore, Actions } from 'olasearch'
import config from 'olasearchconfig'
import { Parser, QueryBuilder, Http } from 'olasearch-solr-adapter'
import { createLoggerMiddleware } from 'olasearch-logger-middleware'
import { bot, user } from './avatars'

const logger = createLogger({ collapsed: true});
// const store = createStore(combineReducers({ Conversation: ChatReducer }), applyMiddleware(thunk, logger))
/* Optional loggerMiddleware */
let loggerMiddleware = createLoggerMiddleware({ logger: config.logger })
let store = createStore(config, { Parser, QueryBuilder, Http }, { Conversation: ChatReducer }, [ loggerMiddleware ])

/* Help menu */
config.helpItems = [
  {
    label: 'Feedback',
    url: 'http://www.steptwo.com.au/contact'
  },
  {
    label: 'Help',
    url: 'http://www.steptwo.com.au/contact'
  }
]

/* Set per page */
store.dispatch(Actions.Search.changePerPage(3))

/* Load default css */
require('olachat/style/chat.scss')
require('./style.scss')

let root_div = document.getElementById('root')

if (root_div) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <Bot
          initialIntent='steptwo'
          bubbleProps={{
            label: 'Ask us anything'
          }}
          headerProps={{
            title: 'Awards 2017'
          }}
          avatarProps={{
            avatarBot: bot,
            avatarUser: user,
          }}
          botProps={{
            botName: 'Ola Bot',
            userName: 'You'
          }}
        />
      </div>
    </OlaProvider>
    , root_div
  )
}