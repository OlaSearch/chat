import React from 'react'
import cx from 'classnames'

const Avatar = ({ isBot, userId, avatarBot }) => {
  let img
  let klass = cx('olachat-message-avatar', {
    'olachat-avatar-bot': isBot
  })
  if (isBot) {
    img = <img className='olachat-avatar' src='https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2017-02-22/144264910209_6a82b26ab654c3d709b2_36.png' />
  } else {
    img = <img className='olachat-avatar' src='https://ca.slack-edge.com/T0NQM2SCV-U0NQQM48Z-g4ef91e8115b-48' />
  }
  return <div className={klass}>{img}</div>
}

export default Avatar
