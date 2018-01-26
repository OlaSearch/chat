import React from 'react'
import Repeat from '@olasearch/icons/lib/repeat'
import { Decorators } from '@olasearch/core'

const FailureButtons = ({ onSubmit, message, isActive, translate }) => {
  return (
    <div className='olachat-slots'>
      <small>{translate('something_went_wrong')}</small>
      <div className='olachat-slots-list'>
        <button
          className='olachat-slots-button'
          type='button'
          onClick={() => onSubmit(message.message)}
          disabled={!isActive}
        >
          <Repeat size={14} />
          {translate('retry')}
        </button>
      </div>
    </div>
  )
}

module.exports = Decorators.injectTranslate(FailureButtons)
