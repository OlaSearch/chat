import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, BotFrame, Bot } from 'olachat'
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
// config.helpItems = [
//   {
//     label: 'Feedback',
//     url: 'https://services.mom.gov.sg/efeedback/Forms/efeedback.aspx'
//   },
//   {
//     label: 'Help',
//     url: 'http://www.mom.gov.sg/contact-us'
//   }
// ]

/* Enable logger */
config.logger.params.bot = true

/* Set per page */

store.dispatch(Actions.Search.changePerPage(3))

/* Load default css */
require('olachat/style/chat.scss')
// require('./style.scss')

let root_div = document.getElementById('root')
let fdw_div = document.getElementById('fdw-root')

let css_url = `https://cdn.olasearch.com/${process.env.OLA_ENV === 'staging' ? 'staging': 'production'}/59116d96300397120cfecdc0/olachat.min.css`
css_url = '/olachat.min.css'

if (fdw_div) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <BotFrame
          initialIntent='mom.fdw.welcome'
          headerProps={{
            title: 'FDW Eligibility Chatbot'
          }}
          avatarProps={{
            avatarBot: bot,
            avatarUser: user,
          }}
          bubbleProps={{
            label: 'FDW Eligibility Chatbot'
          }}
          botProps={{
            botName: 'MOMbot',
            userName: 'You'
          }}
          head={
            <div>
              <link rel='stylesheet' href={css_url} />
              <meta name='viewport' content='width=device-width, initial-scale=1' />
            </div>
          }
        />
      </div>
    </OlaProvider>
    , fdw_div
  )
}
