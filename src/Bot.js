import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearMessages } from './actions'
import { Actions } from 'olasearch'
// import webkit from './adapters/webkit'
import houndify from './adapters/houndify'
// import watson from './adapters/watson'
// import bing from './adapters/bing'
import google from './adapters/google'
import mitt from 'mitt'
import Bubble from './Bubble'
import Chat from './Chat'
import Vui from './Vui'

const DEBUG = false
const supportsVoice = DEBUG
  ? false
  : navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class Bot extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: DEBUG ? true : false
    }
    /* Create a voiceadapter */
    this.voiceAdapter = google({ emitter })

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
    const HAS_VOICES = this.props.isPhone ? window.speechSynthesis.getVoices().length > 1 : true
    const component = this.state.isActive
      ? <Chat {...passProps} />
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

function mapStateToProps (state) {
  return {
    isPhone: state.Device.isPhone
  }
}

module.exports = connect(mapStateToProps)(Bot)
