import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage } from './actions'
import { Actions, Settings } from 'olasearch'

class Chat extends React.Component {
  constructor (props) {
    super (props)
  }
  static defaultProps = {
    flipped: true,
    title: 'Ola Bot',
    onLoad: () => new Promise((resolve, reject) => resolve())
  };
  componentDidMount() {
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
          ref={(el) => this.MessageContainer = el}
          onLoad={this.props.onLoad}
        />
        <Input
          onSubmit={this.addMessage}
          voiceAdapter={this.props.voiceAdapter}
          updateQueryTerm={this.props.updateQueryTerm}
          addContextField={this.props.addContextField}
          isTyping={this.props.isTyping}
          searchInput={this.props.searchInput}
          ref={(el) => this.InputContainer = el}
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
