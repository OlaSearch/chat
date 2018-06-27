import React from 'react'
import { Decorators, Arrow } from '@olasearch/core'
import { connect } from 'react-redux'
import {
  addMessage,
  setBotStatus,
  hideInvite,
  setInitialIntent
} from './actions'

class InviteNotification extends React.Component {
  handleClick = () => {
    /* Trigger an intent */
    const { intent } = this.props.invite
    /* Set the initial intent */
    if (intent) this.props.setInitialIntent(intent)
    /* Show the chatbot */
    this.props.setBotStatus(true)

    /* Add a new message */
    if (this.props.isBotActive && intent) {
      return this.props.addMessage({
        intent
      })
    }
  }
  hideInvite = () => {
    this.props.hideInvite()
  }
  static defaultProps = {
    invite: {}
  }
  render () {
    const { theme, invite } = this.props
    if (!invite) return null
    const { title, subtitle, body, image } = invite
    return (
      <div className='olachat-invite' style={{ opacity: 0 }}>
        <button
          className='ola-btn ola-btn-dismiss'
          style={{ opacity: 0 }}
          onClick={this.hideInvite}
        >
          Dismiss
        </button>
        <div
          className='olachat-invite-snippet ola-flex ola-align-center'
          onClick={this.handleClick}
        >
          {image ? (
            <div className='ola-flex-icon'>
              <img src={image} width='60' height='45' />
            </div>
          ) : null}
          <div className='ola-flex-content'>
            {title && (
              <div className='olachat-invite-snippet-title'>{title}</div>
            )}
            {subtitle && (
              <div className='olachat-invite-snippet-title'>{subtitle}</div>
            )}
            <div className='olachat-invite-snippet-body'>{body}</div>
          </div>
        </div>
        <style jsx>
          {`
            .olachat-invite-snippet {
              line-height: 1.5;
              background: white;
              border: 1px ${theme.primaryColor} solid;
              font-family: ${theme.chatFontFamily};
            }
          `}
        </style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    invite: state.Conversation.invite,
    isBotActive: state.Conversation.isBotActive
  }
}

export default connect(mapStateToProps, {
  addMessage,
  setBotStatus,
  hideInvite,
  setInitialIntent
})(Decorators.withTheme(InviteNotification))
