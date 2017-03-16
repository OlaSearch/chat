import React from 'react'
import cx from 'classnames'

const Avatar = ({ isBot, userId, avatarBot }) => {
  let img
  let klass = cx('olachat-message-avatar', {
    'olachat-avatar-bot': isBot
  })
  if (isBot) {
    img = <img className='olachat-avatar' src={avatarBot} />
  }
  return <div className={klass}>{img}</div>
}

export default Avatar
