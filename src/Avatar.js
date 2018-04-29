import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

/**
 * Displays an avatar
 * @example ./../styleguide/Avatar.md
 */
function Avatar ({ isBot, userId, avatarBot, avatarUser }) {
  const img = isBot ? (
    <img className='olachat-avatar' src={avatarBot} />
  ) : (
    <img className='olachat-avatar' src={avatarUser} />
  )
  const classes = cx('olachat-message-avatar', {
    'olachat-avatar-bot': isBot
  })
  return <div className={classes}>{img}</div>
}

Avatar.propTypes = {
  isBot: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avatarBot: PropTypes.string,
  avatarUser: PropTypes.string
}

export default Avatar
