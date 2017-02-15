import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import { addMessage } from './actions'

class Chat extends React.Component {
  static defaultProps = {
    flipped: false
  };
  render () {
    return (
      <div className='olachat'>
        <Header />
        <Input
          onSubmit={(text) => {
            this.props.addMessage(text)
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                /* Now update the status of the message */
                resolve()
              }, 1000)
            })
          }}
        />
        <Messages
          messages={this.props.messages}
          flipped={this.props.flipped}
          onLoad={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log('called')
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
    isLoading: state.Conversation.isLoading
  }
}

export default connect(mapStateToProps, { addMessage })(Chat)
