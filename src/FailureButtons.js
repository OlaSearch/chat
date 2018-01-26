import React from 'react'
import Repeat from '@olasearch/icons/lib/repeat'

const FailureButtons = ({ onSubmit, message, isActive }) => {
  return (
    <div className='olachat-slots'>
      <small>Something went wrong. Your message was not delivered.</small>
      <div className='olachat-slots-list'>
        <button
          className='olachat-slots-button'
          type='button'
          onClick={() => onSubmit(message.message)}
          disabled={!isActive}
        >
          <Repeat size={14} />
          Retry
        </button>
      </div>
    </div>
  )
}

module.exports = FailureButtons
