import { TextToSpeech } from 'watson-speech'
import reqwest from 'reqwest'
import { convertoFloat32ToInt16 } from './../utils'

/* Using watson for tts */
const ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts'
const sttTokenUrl = 'https://olasearch.com/api/speech-to-text/houndifyAuth'
const END_OF_AUDIO = ['END_OF_UTTERANCE']
const socketUrl = 'ws://localhost:9002'

const adapter = ({ emitter }) => {
  var audioStream
  var audioInput
  var recording = false
  var OlaStream
  var audioContext
  const client = new BinaryClient(socketUrl)
  client.on('open', () => {
    console.log('socket open')
  })

  return {
    start() {
      var isEndReached = false
      var lastResult = ''
      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then(stream => {
          /* Emit start */
          emitter.emit('onStart')

          /* Create stream */
          OlaStream = client.createStream()
          OlaStream.on('data', data => {
            var d = JSON.parse(data)
            emitter.emit('onResult', d.results)
            // if (isEndReached) {
            //   if (d.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
            //     emitter.emit('onFinalResult', d.results)
            //   }
            //   if (d.endpointerType === 'END_OF_AUDIO') return
            // }
            if (END_OF_AUDIO.indexOf(d.endpointerType) !== -1) {
              emitter.emit('onFinalResult', lastResult)
              // isEndReached = true
            } else {
              lastResult = d.results
            }
          })

          /* Set recording flag */
          recording = true

          /* Add to window */
          audioStream = stream

          const audioContext = window.AudioContext || window.webkitAudioContext
          const context = new audioContext()
          audioInput = context.createMediaStreamSource(stream)
          const bufferSize = 2048
          const recorder = context.createScriptProcessor(bufferSize, 1, 1)

          recorder.onaudioprocess = e => {
            if (!recording) return
            var left = e.inputBuffer.getChannelData(0)
            OlaStream.write(convertoFloat32ToInt16(left))
          }
          audioInput.connect(recorder)
          recorder.connect(context.destination)
        })
        .catch(err => console.log(err))
    },
    stop() {
      if (OlaStream) {
        OlaStream.end()
        // OlaStream = null
      }
      if (audioContext) {
        // audioContext.close()
        // audioContext = null
      }
      if (audioStream) {
        for (let i = 0; i < audioStream.getAudioTracks().length; i++) {
          // audioStream.getAudioTracks()[i].stop()
        }
      }
      if (audioInput) {
        // audioInput.disconnect()
        // audioInput = null
      }
      /* Set flag to none */
      recording = false
      emitter.emit('onStop')
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
