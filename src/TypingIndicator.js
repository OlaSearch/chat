import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const TypingIndicator = (props) => {
  return (
    <div className='olachat-message olachat-message-bot'>
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
  )
}

export default TypingIndicator
