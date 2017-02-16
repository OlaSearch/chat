import React from 'react'
import cx from 'classnames'

class Voice extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRecording: false
    }
  }
  static contextTypes = {
    emitter: React.PropTypes.object
  };
  componentDidMount () {
    const { emitter } = this.context
    const { voiceAdapter } = this.props

    emitter.on('onResult', (text) => {
      this.props.onResult(text)
    })

    emitter.on('onFinalResult', (text) => {
      this.props.onFinalResult(text, (message) => {
        /* Play audio */
        voiceAdapter.speak(text, () => {
          /* Then continue voice recognition after audio stop */
          // this.voiceAdapter.start()
        })
      })
    })

    emitter.on('onStart', () => {
      this.setState({
        isRecording: true
      })
    })

    emitter.on('onEnd', () => {
      this.setState({
        isRecording: false
      })
    })

    emitter.on('onStop', () => {
      this.setState({
        isRecording: false
      })
    })
  }
  handleSpeechStart = () => {
    if (this.state.isRecording) {
      this.props.voiceAdapter.stop()
    } else {
      this.props.voiceAdapter.start()
    }
  };
  render () {
    let { isRecording } = this.state
    let klass = cx('olachat-mic', {
      'olachat-mic-isrecording': isRecording
    })
    return (
      <div>
        <button
          onClick={this.handleSpeechStart}
          className={klass}
        >{isRecording ? 'Stop' : 'Speak'}</button>
      </div>
    )
  }
}

export default Voice
