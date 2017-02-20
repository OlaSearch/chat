import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Avatar from './Avatar'

const TypingIndicator = (props) => {
  return (
    <div className='olachat-message olachat-message-bot'>
      <Avatar
        isBot
      />
      <div className='olachat-message-body'>
        <ReactCSSTransitionGroup
          transitionName='messages'
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          <div className='typing-indicator'>
            <span />
            <span />
            <span />
          </div>
        </ReactCSSTransitionGroup>
      </div>
    </div>
  )
}

export default TypingIndicator
