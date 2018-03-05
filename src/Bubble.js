import React from 'react'
import classNames from 'classnames'
import Message from '@olasearch/icons/lib/message-square'
import { BUBBLE_WIDTH_DESKTOP, BUBBLE_WIDTH_MOBILE } from './Settings'
import { Decorators } from '@olasearch/core'

function Bubble ({
  onClick,
  isActive,
  label,
  iconSize,
  showBubbleLabel,
  badge,
  theme
}) {
  let klass = classNames('olachat-bubble', {
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
    <button style={style} className={klass} onClick={onClick}>
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

export default Decorators.withTheme(Bubble)
