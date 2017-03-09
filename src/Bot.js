import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearMessages } from './actions'
import Bubble from './Bubble'
import Chat from './Chat'
import Vui from './Vui'

const supportsVoice = false//navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

class Bot extends Component {
  constructor (props) {
    super (props)
    this.state = {
      isActive: false
    }
  }
  toggleActive = () => {
    /* Pause all audio */
    if (window.OlaAudio) {
      window.OlaAudio.pause()
    }

    this.setState({
      isActive: !this.state.isActive
    })

    this.props.dispatch(clearMessages())

    /* Stop all audio */
  };
  static defaultProps = {
    bubbleProps: {},
    headerProps: {
      title: 'Calculate maternity leave'
    }
  };
  render () {
    const initialIntent = 'maternity-leave'
    const component = this.state.isActive
      ? supportsVoice
        ? <Vui onHide={this.toggleActive} {...this.props.headerProps} initialIntent={initialIntent} />
        : <Chat onHide={this.toggleActive} {...this.props.headerProps} initialIntent={initialIntent} />
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

module.exports = connect()(Bot)
