import { TextToSpeech }  from 'watson-speech'
import reqwest from 'reqwest'

var getUserMedia = require('get-user-media-promise')
var MicrophoneStream = require('microphone-stream')
var L16 = require('./webaudio-l16-stream.js')

const ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts'
const END_OF_AUDIO = ['END_OF_UTTERANCE']
const socketUrl = 'ws://olasearch.com/socket'
const client = new BinaryClient(socketUrl)
var OlaStream

const adapter = ({ emitter }) => {
  var getMicStream
  var micStream
  return {
    start () {
      var lastResult = ''
      var pm = getUserMedia({ video: false, audio: true })
      OlaStream = client.createStream()
      OlaStream.on('data', (data) => {
        var d = JSON.parse(data)
        emitter.emit('onResult', d.results)

        if (d.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
          lastResult = d.results.replace(/\s\s+/g, ' ')
        }
        if (END_OF_AUDIO.indexOf(d.endpointerType) !== -1) {
          emitter.emit('onFinalResult', lastResult)
        }
      })
      getMicStream = pm.then((mic) => {
        var l16Stream = new L16({ writableObjectMode: true })
        micStream = new MicrophoneStream(mic, {
          objectMode: true,
          // bufferSize: options.bufferSize
        })
        micStream.pipe(l16Stream).pipe(OlaStream)
        emitter.emit('onStart')
      })
    },
    stop () {
      micStream && micStream.stop()
      OlaStream && OlaStream.end()
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
    stopSpeaking () {
      if (window.OlaAudio) {
        window.OlaAudio.pause()
      }
      if (window.speechSynthesis) {
        // window.speechSynthesis.cancel()
        window.speechSynthesis.pause()
      }
    },
    speak (text, isPhone = false, callback) {
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
        window.OlaAudio.addEventListener('ended', () =>{
          callback && callback()
        })
      })
    }
  }
}

export default adapter
