import React from 'react'
import mitt from 'mitt'
import google from './../adapters/google'
import Voice from './../Voice'
import Header from './../Header'
import ParseForm from './parse'
import schema from './schema'

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class ChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      isActive: false,
      currentIndex: 0
    }

    /* Create a voiceAdapter */
    this.voiceAdapter = google({
      emitter,
    })

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
  componentDidMount() {
  }
  toggleActive = () => {
    this.setState({
      isActive: !this.state.isActive
    }, () => {
      if (this.state.isActive) this.process()
    })
  };
  advanceToNext = () => {
    this.setState({
      currentIndex: this.state.currentIndex + 1
    })

    this.process()
  };
  process = (options = {}) => {
    let { repeat } = options
    schema.filter((item, id) => id === this.state.currentIndex)
      .forEach((item) => {
        let { dialogue, slots, dialogue_repeat } = item
        if (repeat) {
          dialogue = dialogue_repeat
        }
        this.voiceAdapter.speak(dialogue, false, () => {
          if (slots) {
            this.voiceAdapter.start()
          } else {
            this.advanceToNext()
          }
        })
      })
  }
  clearText = () => this.setState({ text: ''});
  onVoiceChange = (text) => {
    this.setState({
      text
    })
  };
  onVoiceFinal = (text, cb, params) => {
    if (!text) return
    let { currentIndex } = this.state
    let { validate, slots } = schema[currentIndex]

    /* Validate if required */
    if (validate) {
      if (validate(text)){
        /* Fill up the slots */
        if (document.getElementsByName(slots[0]).length) {
          document.getElementsByName(slots[0])[0].value = text
        }

        /* Next question */
        this.advanceToNext()
      } else {
        /* Ask again */
        this.process({ repeat: true })
      }
    } else {
      /* Next question */
      this.advanceToNext()
    }

    /* Clear text */
    this.clearText()
  };
  render () {
    let { text, currentIndex, isActive } = this.state
    let msgs = schema.filter((item, idx) => idx === currentIndex)
    return (
      <div className='olachat-form'>
        <button onClick={this.toggleActive}>Fill this form using voice</button>
        {isActive
          ? <div className='olachat-vui'>
            <Header
              onHide={this.toggleActive}
              title='Reach us'
            />
            <Voice
              voiceAdapter={this.voiceAdapter}
              onResult={this.onVoiceChange}
              onFinalResult={this.onVoiceFinal}
            />
            {msgs
              .map(({ dialogue }, idx) => {
                return (
                  <div key={idx} className='olachat-vui-reply'>
                    {dialogue}
                  </div>
                )
              })
            }
            <span className='olachat-vui-message'>{text}</span>
          </div>
          : null
        }
      </div>
    )
  }
}

export default ChatForm
