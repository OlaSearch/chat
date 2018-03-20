import React from 'react'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import Loader from './Loader'

/**
 * Typing indicator
 * @example ./../styleguide/TypingIndicator.md
 */
function TypingIndicator ({ avatarBot }) {
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

TypingIndicator.propTypes = {
  /**
   * Avatar of the bot
   */
  avatarBot: PropTypes.string
}

export default TypingIndicator
