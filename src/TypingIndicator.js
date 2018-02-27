import React from 'react'
import Avatar from './Avatar'
import Loader from './Loader'

function TypingIndicator ({ avatarBot, isBot }) {
  return (
    <div className='olachat-message olachat-message-bot olachat-progress'>
      <div className='olachat-message-inner'>
        <Avatar isBot avatarBot={avatarBot} />
        <div className='olachat-message-body'>
          <Loader />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
