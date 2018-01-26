import React from 'react'
import classNames from 'classnames'
import Message from '@olasearch/icons/lib/message-square'

function Bubble ({ onClick, isActive, label, iconSize, showBubbleLabel }) {
  let klass = classNames('olachat-bubble', {
    'olachat-bubble-active': isActive
  })
  const style = showBubbleLabel
    ? {
      width: 280
    }
    : {
      width: 60,
      padding: 0
    }
  return (
    <button style={style} className={klass} onClick={onClick}>
      <span className='olachat-bubble-inner'>
        {showBubbleLabel ? (
          <span className='olachat-bubble-text'>{label}</span>
        ) : null}
        <Message size={iconSize} className='ola-icon' />
      </span>
    </button>
  )
}

Bubble.defaultProps = {
  label: 'Ask me anything',
  iconSize: 34
}

module.exports = Bubble
