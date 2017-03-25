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
      isActive: !!DEBUG
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
    vui: false,
    bubbleProps: {},
    headerProps: {
      title: 'Calculate maternity leave'
    },
    avatarProps: {
      avatarBot: 'data:image/png;base64,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'
    }
  };
  render () {
    // const initialIntent = 'start'
    const passProps = {
      onHide: this.toggleActive,
      ...this.props.headerProps,
      ...this.props.avatarProps,
      initialIntent: this.props.initialIntent,
      voiceAdapter: this.voiceAdapter,
      onRequestClose: this.toggleActive,
      emitter
    }
    const HAS_VOICES = this.props.isPhone ? window.speechSynthesis.getVoices().length > 1 : true
    const component = this.state.isActive
      ? this.props.vui && HAS_VOICES
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

function mapStateToProps (state) {
  return {
    isPhone: state.Device.isPhone
  }
}

module.exports = connect(mapStateToProps)(Bot)
