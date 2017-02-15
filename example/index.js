import React from 'react'
import ReactDOM from 'react-dom'
import { Chat, ChatReducer } from 'olachat'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

const logger = createLogger({ collapsed: true});
const store = createStore(ChatReducer, applyMiddleware(thunk, logger))

require('./style/chat.scss')

ReactDOM.render(
  <Provider store={store}>
    <Chat />
  </Provider>
  , document.getElementById('root')
)

