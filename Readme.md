# Ola Search Chat Interface

A React based chat user interface to embed a complete web chat on your website.

Required dependency

1. Core - @olasearch/core
2. Search engine adapter - @olasearch/solr-adapter
3. Project config file

## Installation

````
yarn add @olasearch/chat
````

## Usage

````
import React from 'react'
import ReactDOM from 'react-dom'
import { Parser, QueryBuilder, Http } from '@olasearch/solr-adapter'
import config from 'olasearchconfig'
import { createLoggerMiddleware } from '@olasearch/logger'
import { OlaProvider, createStore } from '@olasearch/core'
import { ChatReducer, BotFrame, Bot, ChatActions, persistMiddleware, notificationMiddleware, translations as chatTranslations } from '@olasearch/chat'

/* Include css files */
require('@olasearch/core/src/style/core.scss')
require('@olasearch/chat/style/chat.scss')

/* DOM ID */
const ola_chatbot = document.getElementById('ola-chatbot')

/* Logging middleware */
let loggerMiddleware = createLoggerMiddleware({ logger: config.logger })

/* Chat persist middleware */
let chatPersistMiddleware = persistMiddleware({ namespace: config.namespace })

/* Push notification middleware */
let chatNotification = notificationMiddleware({ name: config.projectName, icon: config.botAvatar })

/* Store */
let store = createStore(config,
  { Parser, QueryBuilder, Http }, /* Search Adapter */
  { Conversation: ChatReducer }, /* Chatbot Reducer */
  [ 
    chatPersistMiddleware, /* Chatbot Middlewares */
    chatNotification,
    loggerMiddleware /* Logging Middlewares */,
  ]
)

if (ola_chatbot) {
  ReactDOM.render(
    <OlaProvider config={config} store={store} translations={chatTranslations}>
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
      />
    </OlaProvider>
    , ola_chatbot
  )
}
````