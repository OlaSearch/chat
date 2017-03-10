import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearMessages } from './actions'
import { Actions } from 'olasearch'
// import webkit from './adapters/webkit'
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
    super(props)
    this.state = {
      isActive: false
    }
    /* Create a voiceadapter */
    this.voiceAdapter = houndify({ emitter })

    /* Lazy load tokens */
    this.voiceAdapter.prefetchToken()
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

    /* Reset */
    this.props.dispatch(clearMessages())
    this.props.dispatch(Actions.Search.clearQueryTerm())

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
    // const initialIntent = 'start'
    const passProps = {
      onHide: this.toggleActive,
      ...this.props.headerProps,
      initialIntent,
      voiceAdapter: this.voiceAdapter,
      emitter
    }
    const component = this.state.isActive
      ? supportsVoice
        ? <Vui {...passProps} />
        : <Chat {...passProps} />
      : null
    const { isActive } = this.state
    return (
      <div className='olachat-bot'>
        {isActive
          ? null
          : <Bubble
              onClick={this.toggleActive}
              isActive={this.state.isActive}
              {...this.props.bubbleProps}
            />
        }
        {component}
      </div>
    )
  }
}

module.exports = connect()(Bot)
