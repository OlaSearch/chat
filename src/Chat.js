import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import QuickReplies from './QuickReplies'
import { connect } from 'react-redux'
import { addMessage } from './actions'
import { Actions } from 'olasearch'

class Chat extends React.Component {
  static defaultProps = {
    flipped: true,
    title: 'Ola Bot',
    onLoad: () => new Promise((resolve, reject) => resolve())
  };
  componentDidMount () {
    this.props.addMessage({ intent: this.props.initialIntent })
  }
  addMessage = (...args) => {
    /* Scroll to Top */
    this.MessageContainer.scrollToView()

    /* Add message */
    return this.props.addMessage().then((reply) => {
      /* Scroll to Top after bot replies */
      this.MessageContainer.scrollToView()

      return reply
    })
  };
  registerRef = (el) => {
    this.MessageContainer = el
  };
  render () {
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
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    searchInput: state.QueryState.searchInput
  }
}

export default connect(mapStateToProps, { addMessage, updateQueryTerm: Actions.Search.updateQueryTerm, addContextField: Actions.Context.addContextField })(Chat)
