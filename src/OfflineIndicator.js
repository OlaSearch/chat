import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Decorators } from '@olasearch/core'

/**
 * Offline indicator
 * @example ./styleguide/OfflineIndicator.md
 */
const OfflineIndicator = ({ connection, translate }) => {
  if (connection === 'offline') {
    return (
      <div className='olachat-notification'>
        {translate('chat_offline_message')}
      </div>
    )
  }
  return null
}

OfflineIndicator.propTypes = {
  connection: PropTypes.oneOf(['offline', 'online'])
}

export default Decorators.withTranslate(
  connect(state => ({ connection: state.Device.connection }))(OfflineIndicator)
)
