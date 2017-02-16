import { TextToSpeech }  from 'watson-speech'
import reqwest from 'reqwest'
import Houndify from 'houndify-web-sdk'

/* Using watson for tts */
const ttsTokenUrl = 'http://localhost:3003/api/speech-to-text/token/tts'
const sttTokenUrl = 'http://localhost:3003/api/speech-to-text/houndifyAuth'
const adapter = ({ emitter }) => {
  var clientID = '9ALURR6Jwu_tNlNrXt4xxA=='
  var client = new Houndify.HoundifyClient({
    clientId: clientID,
    authURL: sttTokenUrl,
    enableVAD: true,
    onResponse: (response, info) => {
      if (response.AllResults && response.AllResults[0] !== undefined) {
        emitter.emit('onFinalResult', response.AllResults[0].FormattedTranscription)
      }
    },
    onError : () => {
      emitter.emit('onStop')
    },
    onTranscriptionUpdate: function(trObj) {
      emitter.emit('onResult', trObj.PartialTranscript)
    },
    onRecordingStarted () {
      emitter.emit('onStart')
    },
    onRecordingStopped () {
      emitter.emit('onStop')
    }
  })

  return {
    start () {
      var requestInfo = {
        ClientID: clientID
      }
      if (client.voiceSearch.isStreaming()) {
        client.voiceSearch.stop()
      } else {
        client.voiceSearch.startRecording(requestInfo)
      }
    },
    stop () {
      client.voiceSearch.stop()
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
