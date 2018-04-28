import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Message from '@olasearch/icons/lib/message-square'
import { BUBBLE_WIDTH_DESKTOP, BUBBLE_WIDTH_MOBILE } from './Settings'
import { Decorators } from '@olasearch/core'

/**
 * Chat bubble
 * @example ./../styleguide/Bubble.md
 */
function Bubble ({
  onClick,
  isActive,
  label,
  iconSize,
  showBubbleLabel,
  badge,
  theme
}) {
  const classes = classNames('olachat-bubble', {
    'olachat-bubble-active': isActive
  })
  const style = showBubbleLabel
    ? {
      width: BUBBLE_WIDTH_DESKTOP
    }
    : {
      width: BUBBLE_WIDTH_MOBILE,
      padding: 0
    }
  return (
    <button style={style} className={classes} onClick={onClick}>
      <span className='olachat-bubble-inner'>
        {showBubbleLabel ? (
          <span className='olachat-bubble-text'>{label}</span>
        ) : null}
        <Message size={iconSize} className='ola-icon' />
        {badge ? <span className='olachat-bubble-badge'>{badge}</span> : null}
      </span>
      <style jsx>{`
        .olachat-bubble {
          background: ${theme.chatBubbleBackground};
          line-height: 1.2;
        }
        .olachat-bubble:hover {
          background: ${theme.chatBubbleBackgroundHover};
        }
        .olachat-bubble .olachat-bubble-badge {
          background: ${theme.dangerColor};
        }
      `}</style>
    </button>
  )
}

Bubble.defaultProps = {
  label: '',
  iconSize: 34,
  badge: null
}

Bubble.propTypes = {
  /**
   * Label to be displayed inside the buble
   */
  label: PropTypes.string,
  /**
   * Size of the icon
   */
  iconSize: PropTypes.number,
  /**
   * Notification badge
   */
  badge: PropTypes.number
}

export default Decorators.withTheme(Bubble)
