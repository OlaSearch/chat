import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, BotFrame, Bot, ChatActions } from 'olachat'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
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

/* Enable logger */
config.logger.params.bot = true

/* Set per page */
store.dispatch(Actions.Search.changePerPage(3))
/* Set to window */
global.OlaStore = store
global.OlaActions = ChatActions

/* Load default css */
require('olachat/style/chat.scss')

let root_div = document.getElementById('root')
let fdw_div = document.getElementById('fdw-root')
let search_div = document.getElementById('search-root')

let css_url = !process.env.OLA_ENV || process.env.OLA_ENV === 'staging' ? '/olachat.min.css' : 'https://cdn.olasearch.com/production/59116d96300397120cfecdc0/olachat.min.css'

if (fdw_div) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <BotFrame
          initialIntent={config.initialIntent}
          headerProps={{
            title: config.chatbotTitle
          }}
          avatarProps={{
            avatarBot: config.botAvatar,
            avatarUser: config.userAvatar,
          }}
          bubbleProps={{
            label: config.chatbotBubbleLabel
          }}
          botProps={{
            botName: config.botName,
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


if (search_div) {
  ReactDOM.render(
    <OlaProvider config={config} store={store}>
      <div className='full-wrapper'>
        <BotFrame
          showBubble={false}
          activeStyle={{
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            height: 600,
            marginLeft: -434,
            marginTop: -300
          }}
          widthActive={840}
          initialIntent={config.initialIntent}
          headerProps={{
            title: config.chatbotTitle
          }}
          avatarProps={{
            avatarBot: config.botAvatar,
            avatarUser: config.userAvatar,
          }}
          bubbleProps={{
            label: config.chatbotBubbleLabel
          }}
          botProps={{
            botName: config.botName,
            userName: 'You',
            sendWelcomeMsg: false
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
    , search_div
  )
}
