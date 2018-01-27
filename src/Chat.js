import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage, updateBotQueryTerm } from './actions'
import { Actions, Decorators } from '@olasearch/core'
import QuickReplies from './QuickReplies'

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
    return this.props.addMessage(args).then(reply => {
      /* Scroll to Top after bot replies */
      // this.MessageContainer.scrollToView()

      return reply
    })
  }
  registerRef = el => {
    this.MessageContainer = el
  }
  render () {
    return (
      <div className='olachat'>
        <Header onHide={this.props.onHide} title={this.props.title} />
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
        />
        <QuickReplies
          onSubmit={this.addMessage}
          updateQueryTerm={this.props.updateQueryTerm}
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
        />
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
})(Decorators.withLogger(Chat))
