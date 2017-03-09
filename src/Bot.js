import React, { Component } from 'react'
import Bubble from './Bubble'
import Chat from './Chat'
import Vui from './Vui'

class Bot extends Component {
  constructor (props) {
    super (props)
    this.state = {
      isActive: false
    }
  }
  toggleActive = () => {
    this.setState({
      isActive: !this.state.isActive
    })

    /* Stop all audio */
  };
  static defaultProps = {
    bubbleProps: {},
    headerProps: {
      title: 'Calculate maternity leave'
    }
  };
  render () {
    const supportsVoice = window.SpeechRecognition || window.webkitSpeechRecognition
    const component = this.state.isActive
      ? supportsVoice
        ? <Vui onHide={this.toggleActive} {...this.props.headerProps} />
        : <Chat onHide={this.toggleActive} {...this.props.headerProps} />
      : null
    return (
      <div className='olachat-bot'>
        <Bubble
          onClick={this.toggleActive}
          isActive={this.state.isActive}
          {...this.props.bubbleProps}
        />
        {component}
      </div>
    )
  }
}

module.exports = Bot
