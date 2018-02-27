import React from 'react'
import Repeat from '@olasearch/icons/lib/repeat'
import { Decorators } from '@olasearch/core'

function FailureButtons ({ onSubmit, message, isActive, translate }) {
  return (
    <div className='olachat-slots'>
      <small className='olachat-error-message'>
        {translate('chat_something_went_wrong')}
      </small>
      <div className='olachat-slots-list'>
        <button
          className='olachat-slots-button'
          type='button'
          onClick={() => onSubmit(message.message)}
          disabled={!isActive}
        >
          <Repeat size={14} />
          {translate('chat_retry')}
        </button>
      </div>
    </div>
  )
}

export default Decorators.withTranslate(FailureButtons)
