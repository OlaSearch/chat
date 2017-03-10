import { TextToSpeech }  from 'watson-speech'
import reqwest from 'reqwest'

const ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts'

const adapter = ({ emitter }) => {
  var lang = "en-us"
  var key = 'c26cfca5009e48bc8e4f317d7f6219cb'
  var mode = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase
  var client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                        mode,
                        lang,
                        key);

  client.onPartialResponseReceived = (response) => {
    // console.log(response)
  }
  client.onFinalResponseReceived = (res) => {
    if (res) {
      emitter.emit('onFinalResult', res[0].transcript)
    }
  }

  return {
    start () {
      client.startMicAndRecognition()
      setTimeout(function () {
        client.endMicAndRecognition()
      }, 5000)
      emitter.emit('onStart')
    },
    stop () {
      if (client) client.endMicAndRecognition()
      emitter.emit('onStop')
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
      if (isPhone) {
        if (!window.speechSynthesis) return
        var utterance = new SpeechSynthesisUtterance()
        utterance.lang = 'en-GB'
        utterance.pitch = 0.8
        utterance.rate = 1
        utterance.volume = 1

        utterance.text = text

        /* Say */
        window.speechSynthesis.speak(utterance)

        /* Call end */
        const _wait = () => {
          if ( ! window.speechSynthesis.speaking ) {
            callback && callback()
            if (timeout) clearInterval(timeout)
            return
          }
          const timeout = window.setTimeout(_wait, 200)
        }
        _wait()

        return
      }

      this.getTtsToken()
      .then((token) => {
        this._ttsToken = token
        window.OlaAudio = TextToSpeech.synthesize({
          text,
          token,
          autoPlay: false
        })
        window.OlaAudio.play()
        window.OlaAudio.addEventListener('ended', () => {
          callback && callback()
        })
      })
    }
  }
}

export default adapter