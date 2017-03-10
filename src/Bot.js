import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearMessages } from './actions'
import webkit from './adapters/webkit'
import houndify from './adapters/houndify'
// import watson from './adapters/watson'
// import bing from './adapters/bing'
// import google from './adapters/google'
import mitt from 'mitt'
import Bubble from './Bubble'
import Chat from './Chat'
import Vui from './Vui'

const supportsVoice = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class Bot extends Component {
  constructor (props) {
    super (props)
    this.state = {
      isActive: false
    }
    /* Create a voiceadapter */
    this.voiceAdapter = houndify({ emitter })
  }
  static childContextTypes = {
    emitter: React.PropTypes.object
  };
  getChildContext () {
    return {
      emitter
    }
  }
  toggleActive = () => {
    /* Pause all audio */
    this.voiceAdapter.stopSpeaking()

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
        ? <Vui onHide={this.toggleActive} {...this.props.headerProps} initialIntent={initialIntent} voiceAdapter={this.voiceAdapter} emitter={emitter} />
        : <Chat onHide={this.toggleActive} {...this.props.headerProps} initialIntent={initialIntent} voiceAdapter={this.voiceAdapter} emitter={emitter} />
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
