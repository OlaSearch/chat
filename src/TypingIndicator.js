import React from 'react'
import Avatar from './Avatar'
import Loader from './Loader'

function TypingIndicator ({ avatarBot, isBot, theme }) {
  return (
    <div className='olachat-message olachat-message-bot olachat-progress'>
      <div className='olachat-message-inner'>
        <Avatar isBot avatarBot={avatarBot} />
        <div className='olachat-message-body'>
          <Loader theme={theme} />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
