import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage } from './actions'
import watson from './adapters/watson'
import houndify from './adapters/houndify'
import google from './adapters/google'
import webkit from './adapters/webkit'
import bing from './adapters/bing'
import mitt from 'mitt'

/* Create an emitter */
/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()
/* Create a voiceadapter */
const voiceAdapter = bing({
  emitter
})

class Chat extends React.Component {
  static defaultProps = {
    flipped: false
  };
  static childContextTypes = {
    emitter: React.PropTypes.object
  };
  getChildContext () {
    return {
      emitter
    }
  }
  addMessage = (...args) => {
    /* Scroll to Top */
    this.MessageContainer.scrollToView()

    /* Add message */
    return this.props.addMessage(...args).then(() => {
      /* Scroll to Top after bot replies */
      this.MessageContainer.scrollToView()
    })
  };
  render () {
    return (
      <div className='olachat'>
        <Header />
        <Input
          onSubmit={this.addMessage}
          voiceAdapter={voiceAdapter}
        />
        <Messages
          messages={this.props.messages}
          flipped={this.props.flipped}
          isTyping={this.props.isTyping}
          ref={(el) => this.MessageContainer = el}
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
