import React from 'react'
import { connect } from 'react-redux'
import { Decorators } from '@olasearch/core'

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

export default Decorators.withTranslate(
  connect(state => ({ connection: state.Device.connection }))(OfflineIndicator)
)
