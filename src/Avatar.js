import React from 'react'
import cx from 'classnames'

function Avatar ({ isBot, userId, avatarBot, avatarUser }) {
  let img = <img className='olachat-avatar' src={avatarBot} />
  let klass = cx('olachat-message-avatar', {
    'olachat-avatar-bot': isBot
  })
  if (!isBot) {
    img = <img className='olachat-avatar' src={avatarUser} />
  }
  return <div className={klass}>{img}</div>
}

export default Avatar
