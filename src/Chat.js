import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage, disabledFeedback, clearMessages, setBotStatus } from './actions'
import { Actions, Decorators } from 'olasearch'
import QuickReplies from './QuickReplies'

class Chat extends React.Component {
  static defaultProps = {
    flipped: true,
    title: 'Ola Bot',
    sendWelcomeMsg: true,
    onLoad: () => new Promise((resolve, reject) => resolve())
  };
  componentDidMount () {
    if (this.props.sendWelcomeMsg) {
      this.props.addMessage({ intent: this.props.initialIntent, start: true })
    }
    this.props.changePerPage(3)
  }
  componentWillUnmount () {
    this.props.clearMessages()
    this.props.setBotStatus(false)
  }
  addMessage = (args) => {
    /* Scroll to Top */
    this.MessageContainer.scrollToView()

    /* Add message */
    return this.props.addMessage(args).then((reply) => {
      /* Scroll to Top after bot replies */
      this.MessageContainer.scrollToView()

      return reply
    })
  };
  registerRef = (el) => {
    this.MessageContainer = el
  };
  render () {
    let { feedbackActive } = this.props
    return (
      <div className='olachat'>
        <Header
          onHide={this.props.onHide}
          title={this.props.title}
        />
        <Messages
          messages={this.props.messages}
          flipped={this.props.flipped}
          isTyping={this.props.isTyping}
          ref={this.registerRef}
          onLoad={this.props.onLoad}
          avatarBot={this.props.avatarBot}
          avatarUser={this.props.avatarUser}
          addMessage={this.addMessage}
          botName={this.props.botName}
          userName={this.props.userName}
          feedbackActive={feedbackActive}
          dismissModal={this.props.disabledFeedback}
          log={this.props.log}
          updateQueryTerm={this.props.updateQueryTerm}
        />
        <QuickReplies
          onSubmit={this.addMessage}
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
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    feedbackActive: state.Conversation.feedbackActive,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    searchInput: state.QueryState.searchInput
  }
}

export default connect(mapStateToProps, {
  addMessage,
  clearMessages,
  setBotStatus,
  updateQueryTerm: Actions.Search.updateQueryTerm,
  addContextField: Actions.Context.addContextField,
  disabledFeedback,
  changePerPage: Actions.Search.changePerPage
})(Decorators.withLogger(Chat))
