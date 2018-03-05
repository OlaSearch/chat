import React from 'react'
import { Decorators } from '@olasearch/core'
import { connect } from 'react-redux'
import { setBotStatus, hideInvite } from './actions'

class InviteNotification extends React.Component {
  handleClick = () => {
    this.props.setBotStatus(true)
  }
  render () {
    let { theme } = this.props
    return (
      <div className='olachat-invite' style={{ opacity: 0 }}>
        <button
          className='ola-btn ola-btn-dismiss'
          style={{ opacity: 0 }}
          onClick={this.props.hideInvite}
        >
          Dismiss
        </button>
        <div className='olachat-invite-snippet' onClick={this.handleClick}>
          <div className='olachat-invite-snippet-title'>Hi there!</div>
          <div className='olachat-invite-snippet-body'>
            What brings you to our website today?
          </div>
        </div>
        <style jsx>
          {`
            .olachat-invite-snippet {
              line-height: 1.5;
              color: #4a4a4a;
              font-family: ${theme.chatFontFamily};
            }
          `}
        </style>
      </div>
    )
  }
}

export default connect(null, { setBotStatus, hideInvite })(
  Decorators.withTheme(InviteNotification)
)
