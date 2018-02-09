import React from 'react'
import classNames from 'classnames'
import Message from '@olasearch/icons/lib/message-square'
import { BUBBLE_WIDTH_DESKTOP, BUBBLE_WIDTH_MOBILE } from './Settings'
import { ThemeConsumer } from '@olasearch/core'

export default function Bubble ({
  onClick,
  isActive,
  label,
  iconSize,
  showBubbleLabel
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
    <ThemeConsumer>
      {theme => (
        <button style={style} className={klass} onClick={onClick}>
          <span className='olachat-bubble-inner'>
            {showBubbleLabel ? (
              <span className='olachat-bubble-text'>{label}</span>
            ) : null}
            <Message size={iconSize} className='ola-icon' />
          </span>
          <style jsx>{`
            .olachat-bubble {
              background: ${theme.chatBubbleBackground};
              line-height: 1.2;
            }
            .olachat-bubble:hover {
              background: ${theme.chatBubbleBackgroundHover};
            }
          `}</style>
        </button>
      )}
    </ThemeConsumer>
  )
}

Bubble.defaultProps = {
  label: 'Ask me anything',
  iconSize: 34
}
