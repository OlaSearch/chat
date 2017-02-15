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
          onSubmit={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                this.props.addMessage()
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
    messages: state.ChatState.messages,
    isLoading: state.ChatState.isLoading
  }
}

export default connect(mapStateToProps, { addMessage })(Chat)
