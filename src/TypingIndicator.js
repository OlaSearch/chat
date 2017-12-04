import React from 'react'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import Avatar from './Avatar'

function TypingIndicator({ avatarBot, isBot }) {
  return (
    <div className="olachat-message olachat-message-bot ola-chat-progress">
      <Avatar isBot avatarBot={avatarBot} />
      <div className="olachat-message-body">
        <TransitionGroup appear>
          <CSSTransition
            classNames="ola-fade"
            timeout={{ enter: 500, exit: 500 }}
          >
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  )
}

export default TypingIndicator
