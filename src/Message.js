import React from 'react'
import cx from 'classnames'

const Message = ({ message }) => {
  let { userId, text, time } = message
  let isBot = !userId
  let messageClass = cx('olachat-message', {
    'olachat-message-bot': isBot
  })
  return (
    <div className={messageClass}>
      <div className='olachat-message-content'>
        {text}
      </div>
      <div className='olachat-message-time'>
        {time}
      </div>
    </div>
  )
}

export default Message
