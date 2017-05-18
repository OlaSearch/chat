# React Chat Interface

## Dependencies

````
react
redux
react-redux
````

## Installation

````
npm install olachat --save
````

````
import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer, Vui, Bot } from 'olachat'
import { OlaProvider, createStore, Actions } from 'olasearch'
import config from 'olasearchconfig'
import { Parser, QueryBuilder, Http } from 'olasearch-solr-adapter'
import { createLoggerMiddleware } from 'olasearch-logger-middleware'
import { bot, user } from './avatars'

/* Optional loggerMiddleware */
let loggerMiddleware = createLoggerMiddleware({ logger: config.logger })
let store = createStore(config, { Parser, QueryBuilder, Http }, { Conversation: ChatReducer }, [ loggerMiddleware ])


ReactDOM.render(
  <OlaProvider config={config} store={store}>
    <div className='full-wrapper'>
      <Bot
        initialIntent='maternity-leave'
        bubbleProps={{
          label: 'Ask us anything'
        }}
        avatarProps={{
          avatarBot: bot,
          avatarUser: user,
        }}
      />
    </div>
  </OlaProvider>
  , document.getElementById('root')
)

````


cd  /var/www/bot-engine
source .venv/bin/activate
pip install -e git+ssh://git@gitlab.com/olasearch/datextractor.git#egg=datextractor
sudo systemctl restart bot-engine
ssh -i ./ola-backend-api.pem ubuntu@54.169.15.62