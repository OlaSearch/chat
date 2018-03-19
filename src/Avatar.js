import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

/**
 * Displays an avatar
 * @example ./src/Avatar.md
 */
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

Avatar.propTypes = {
  isBot: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avatarBot: PropTypes.string,
  avatarUser: PropTypes.string
}

export default Avatar
