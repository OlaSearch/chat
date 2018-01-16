import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, BotFrame, Bot, ChatActions } from '@olasearch/chat'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { OlaProvider, createStore, Actions } from '@olasearch/core'
import config from 'olasearchconfig'
import { Parser, QueryBuilder, Http } from '@olasearch/solr-adapter'
import { createLoggerMiddleware } from '@olasearch/logger'
import { bot, user } from './avatars'

/* Optional loggerMiddleware */
let loggerMiddleware = createLoggerMiddleware({ logger: config.logger })
let store = createStore(config, { Parser, QueryBuilder, Http }, { Conversation: ChatReducer }, [ loggerMiddleware ])

/* Set per page */
store.dispatch(Actions.Search.changePerPage(3))
store.dispatch(ChatActions.setBotStatus(true))

/* Load default css */
// require('@olasearch/core/src/style/core.scss')
require('@olasearch/chat/style/chat.scss')

let root_div = document.getElementById('root')
let fdw_div = document.getElementById('bot-root')
let ola_chatbot = document.getElementById('ola-chatbot')

let css_url = !process.env.OLA_ENV || process.env.OLA_ENV === 'staging' ? '/olachat.min.css' : `https://cdn.olasearch.com/assets/css/olachat.min.css`

if (ola_chatbot) {
  ReactDOM.render(
    <OlaProvider config={config} store={store} className='ola-chatbot'>
      <Bot
        initialIntent={config.initialIntent || 'mom.fdw.welcome'}
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
    </OlaProvider>
    , ola_chatbot
  )
}