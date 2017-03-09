import React from 'react'
import classNames from 'classnames'

const Bubble = ({ onClick, isActive, label }) => {
  let klass = classNames('olachat-bubble', {
    'olachat-bubble-active': isActive
  })
  return (
    <button className={klass} onClick={onClick}>
      <span>{label}</span>
    </button>
  )
}

Bubble.defaultProps = {
  label: 'Use your voice to calculate your maternity leave dates'
}

module.exports = Bubble
