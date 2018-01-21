import React from 'react'
import classNames from 'classnames'
import Message from '@olasearch/icons/lib/message-square'

function Bubble ({ onClick, isActive, label, iconSize }) {
  let klass = classNames('olachat-bubble', {
    'olachat-bubble-active': isActive
  })
  return (
    <button className={klass} onClick={onClick}>
      <span className='olachat-bubble-text'>{label}</span>
      <Message size={iconSize} className='ola-icon' />
    </button>
  )
}

Bubble.defaultProps = {
  label: 'Ask me anything',
  iconSize: 34
}

module.exports = Bubble
