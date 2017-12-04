import React from 'react'
import classNames from 'classnames'

function Bubble({ onClick, isActive, label }) {
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
  label: 'FDW Eligibility chatbot'
}

module.exports = Bubble
