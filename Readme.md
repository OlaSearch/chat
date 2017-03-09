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
import { Chat, ChatReducer } from 'olachat'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

const logger = createLogger({ collapsed: true});
const store = createStore(combineReducers({ ChatState: ChatReducer }), applyMiddleware(thunk, logger))

require('./style/chat.scss')

ReactDOM.render(
  <Provider store={store}>
    <Chat />
  </Provider>
  , document.getElementById('root')
)

````


cd  /var/www/bot-engine
source .venv/bin/activate
pip install -e git+ssh://git@gitlab.com/olasearch/datextractor.git#egg=datextractor
sudo systemctl restart bot-engine
ssh -i ./ola-backend-api.pem ubuntu@54.169.15.62