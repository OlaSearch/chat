import React from 'react'
import Avatar from './Avatar'
import Loader from './Loader'

function TypingIndicator({ avatarBot, isBot }) {
  return (
    <div className="olachat-message olachat-message-bot ola-chat-progress">
      <Avatar isBot avatarBot={avatarBot} />
      <div className="olachat-message-body">
        <Loader />
      </div>
    </div>
  )
}

export default TypingIndicator
