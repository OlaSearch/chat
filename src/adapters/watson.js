import reqwest from 'reqwest'
import { TextToSpeech }  from 'watson-speech'
const watsonSpeechRecognizer = require('watson-speech/speech-to-text/recognize-microphone');

const ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts'
const sttTokenUrl = 'https://olasearch.com/api/speech-to-text/token'

const adapter = ({ emitter }) => {
  var activeSTT
  return {
    start () {
      if (window.OlaAudio) {
        window.OlaAudio.pause()
      }
      return this.getSttToken()
        .then((token) => {
          this._sttToken = token
          this.stream = watsonSpeechRecognizer({
            token: token,
            // model: 'en-US_BroadbandModel',
            continuous: false, // false = automatically stop transcription the first time a pause is detected
            objectMode: true // send objects instead of text
          })

          emitter.emit('onStart')

          this.stream.on('data', (data) => {
            var text = data.alternatives[0].transcript;
            var isFinal = data.final;
            emitter.emit('onResult', text)
            if (isFinal) {
              emitter.emit('onFinalResult', text)
            }
          })
        })
    },
    stop () {
      if (this.stream) {
        this.stream.stop()
        this.stream = null
      }
      emitter.emit('onStop')
    },
    getSttToken () {
      /* Cache tts token */
      if (this._sttToken) {
        return new Promise((resolve, reject) => {
          resolve(this._sttToken)
        })
      }
      return reqwest({
        url: sttTokenUrl
      })
    },
    prefetchToken () {
      this.getTtsToken()
        .then((token) =>  this._ttsToken = token)
    },
    getTtsToken () {
      /* Cache tts token */
      if (this._ttsToken) {
        return new Promise((resolve, reject) => {
          resolve(this._ttsToken)
        })
      }
      return reqwest({
        url: ttsTokenUrl
      })
    },
    speak (text, isPhone = false, callback) {
      this.getTtsToken()
      .then((token) => {
        this._ttsToken = token
        window.OlaAudio = TextToSpeech.synthesize({
          text,
          token,
          autoPlay: false
        })
        window.OlaAudio.play()
        window.OlaAudio.addEventListener('ended', () =>{
          callback && callback()
        })
      })
    }
  }
}

export default adapter
