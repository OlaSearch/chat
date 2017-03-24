import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Avatar from './Avatar'

const TypingIndicator = ({ avatarBot, isBot }) => {
  return (
    <div className='olachat-message olachat-message-bot ola-chat-progress'>
      {avatarBot
        ? <Avatar
          isBot
          avatarBot={avatarBot}
          />
        : null
      }
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
