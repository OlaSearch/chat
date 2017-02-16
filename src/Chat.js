import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage } from './actions'
// import watson from './adapters/watson'
import houndify from './adapters/houndify'
import mitt from 'mitt'

class Chat extends React.Component {
  static defaultProps = {
    flipped: false
  };
  static childContextTypes = {
    emitter: React.PropTypes.object
  };
  getChildContext () {
    return {
      emitter: mitt()
    }
  }
  addMessage = (...args) => {
    /* Scroll to Top */
    this.refs.msg.scrollToView()

    /* Add message */
    return this.props.addMessage(...args)
  };
  render () {
    return (
      <div className='olachat'>
        <Header />
        <Input
          onSubmit={this.addMessage}
          voiceAdapter={houndify}
        />
        <Messages
          messages={this.props.messages}
          flipped={this.props.flipped}
          isTyping={this.props.isTyping}
          ref='msg'
          onLoad={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                // console.log('called')
                resolve()
              }, 1000)
            })
          }}
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping
  }
}

export default connect(mapStateToProps, { addMessage })(Chat)
