import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage, updateBotQueryTerm } from './actions'
import { Decorators } from '@olasearch/core'
import OfflineIndicator from './OfflineIndicator'

class Chat extends React.Component {
  static defaultProps = {
    flipped: true,
    title: 'Ola Bot',
    onLoad: () => new Promise((resolve, reject) => resolve())
  }
  componentDidMount () {
    /**
     * Check if the user has any messages
     */
    if (!this.props.messages.length) {
      this.props.addMessage({ intent: this.props.initialIntent, start: true })
    }
  }
  addMessage = args => {
    /* Add message */
    return this.props.addMessage(args)
  }
  registerRef = el => {
    this.MessageContainer = el
  }
  render () {
    const { theme } = this.props
    return (
      <div className='olachat'>
        <Header
          onHide={this.props.onHide}
          title={this.props.title}
          theme={theme}
        />
        <OfflineIndicator />
        <Messages
          messages={this.props.messages}
          flipped={this.props.flipped}
          ref={this.registerRef}
          onLoad={this.props.onLoad}
          avatarBot={this.props.avatarBot}
          avatarUser={this.props.avatarUser}
          addMessage={this.addMessage}
          botName={this.props.botName}
          userName={this.props.userName}
          log={this.props.log}
          setBotStatus={this.props.setBotStatus}
          updateQueryTerm={this.props.updateQueryTerm}
          location={this.props.location}
          newMessageId={this.props.newMessageId}
          theme={theme}
        />

        <Input
          onSubmit={this.addMessage}
          voiceAdapter={this.props.voiceAdapter}
          updateQueryTerm={this.props.updateQueryTerm}
          addContextField={this.props.addContextField}
          isTyping={this.props.isTyping}
          searchInput={this.props.searchInput}
          isPhone={this.props.isPhone}
          onRequestClose={this.props.onRequestClose}
          messages={this.props.messages}
          voiceInput={this.props.voiceInput}
          location={this.props.location}
          theme={theme}
        />
        <style jsx global>
          {`
            a {
              color: ${theme.chatLinkColor};
            }
            a:hover {
              color: ${theme.chatLinkHoverColor};
            }
            .olachat-bot {
              line-height: 1.5;
              color: #4a4a4a;
              font-family: ${theme.chatFontFamily};
            }
          `}
        </style>
        <style jsx>
          {`
            .olachat :global(.ola-link-load-more) {
              color: ${theme.primaryColor};
              background: transparent;
            }
            .olachat :global(.olachat-input-textarea),
            .olachat :global(.olachat-query-suggestion),
            .olachat :global(button) {
              font-family: ${theme.chatFontFamily};
            }
          `}
        </style>
        <style jsx>
          {`
            .olachat :global(.ola-share-links) {
              display: block;
            }
            @media screen and (-ms-high-contrast: active),
              (-ms-high-contrast: none) {
              :global(img[src$='.svg']) {
                width: 100%;
              }
              :global(.olachat-body) {
                overflow: hidden;
              }
              :global(.olachat) {
                border: 1px #ccc solid;
              }
            }
          `}
        </style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    newMessageId: state.Conversation.newMessageId,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    location: state.Context.location,
    searchInput: state.QueryState.searchInput
  }
}

export default connect(mapStateToProps, {
  addMessage,
  updateQueryTerm: updateBotQueryTerm
})(Decorators.withTheme(Decorators.withLogger(Chat)))
