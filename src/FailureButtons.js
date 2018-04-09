import React from 'react'
import PropTypes from 'prop-types'
import Repeat from '@olasearch/icons/lib/repeat'
import { Decorators } from '@olasearch/core'

/**
 * Shows button if message sending failed
 * @example ./../styleguide/FailureButtons.md
 */
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
          onClick={() =>
            onSubmit({
              query: message.message
            })
          }
          disabled={!isActive}
        >
          <Repeat size={14} />
          {translate('chat_retry')}
        </button>
      </div>
    </div>
  )
}

FailureButtons.propTypes = {
  onSubmit: PropTypes.func,
  message: PropTypes.object,
  isActive: PropTypes.bool,
  translate: PropTypes.func
}

export default Decorators.withTranslate(FailureButtons)
