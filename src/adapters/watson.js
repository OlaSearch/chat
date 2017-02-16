import reqwest from 'reqwest'
import { TextToSpeech }  from 'watson-speech'
const watsonSpeechRecognizer = require('watson-speech/speech-to-text/recognize-microphone');

const sttTokenUrl = 'http://localhost:3003/api/speech-to-text/token'
const ttsTokenUrl = 'http://localhost:3003/api/speech-to-text/token/tts'

const adapter = ({ emitter }) => {
  var activeSTT
  return {
    start () {
      return this.getSttToken()
        .then((token) => {
          this._sttToken = token
          this.stream = watsonSpeechRecognizer({
            token: token,
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
              this.stop()
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
    speak (text, callback) {
      this.getTtsToken()
      .then((token) => {
        this._ttsToken = token
        const audio = TextToSpeech.synthesize({
          text,
          token,
          autoPlay: false
        })
        audio.play()
        audio.addEventListener('ended', () =>{
          callback && callback()
        })
      })
    }
  }
}

export default adapter
