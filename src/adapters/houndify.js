/*eslint-disable */
import { TextToSpeech } from 'watson-speech'
import reqwest from 'reqwest'
import Houndify from 'houndify-web-sdk'

/* Using watson for tts */
const ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts'
const sttTokenUrl = 'https://olasearch.com/api/speech-to-text/houndifyAuth'
const adapter = ({ emitter }) => {
  var clientID = 'XtaMCHjUQ26sSPMPcXamLw=='
  var client = new Houndify.HoundifyClient({
    clientId: clientID,
    authURL: sttTokenUrl,
    enableVAD: true,
    onResponse: (response, info) => {
      if (response.AllResults && response.AllResults[0] !== undefined) {
        let res = response.AllResults[0]
        emitter.emit('onFinalResult', res.FormattedTranscription)
      }
    },
    onError: err => {
      emitter.emit('onStop')
    },
    onTranscriptionUpdate: function(trObj) {
      emitter.emit('onResult', trObj.PartialTranscript)
    },
    onRecordingStarted() {
      emitter.emit('onStart')
    },
    onRecordingStopped() {
      emitter.emit('onStop')
    }
  })

  return {
    start() {
      /* Stop speaking */
      this.stopSpeaking()

      var requestInfo = {
        ClientID: clientID
      }
      if (client.voiceSearch.isStreaming()) {
        client.voiceSearch.stop()
      } else {
        client.voiceSearch.startRecording(requestInfo)
      }
      /* Get tts token */
      this.getTtsToken()
    },
    stop() {
      client.voiceSearch.stop()
      if (window.OlaAudio) {
        window.OlaAudio.pause()
      }
    },
    prefetchToken() {
      this.getTtsToken().then(token => (this._ttsToken = token))
    },
    getTtsToken() {
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
    stopSpeaking() {
      if (window.OlaAudio) {
        window.OlaAudio.pause()
      }
      if (window.speechSynthesis) {
        // window.speechSynthesis.cancel()
        window.speechSynthesis.pause()
      }
    },
    speak(text, isPhone = false, callback) {
      if (isPhone) {
        if (!window.speechSynthesis) return
        if (window.speechSynthesis) window.speechSynthesis.cancel()
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
          if (!window.speechSynthesis.speaking) {
            callback && callback()
            if (timeout) clearInterval(timeout)
            return
          }
          const timeout = window.setTimeout(_wait, 200)
        }
        _wait()

        return
      }

      this.getTtsToken().then(token => {
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
