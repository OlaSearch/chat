import { TextToSpeech }  from 'watson-speech'
import reqwest from 'reqwest'
const ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts'

const adapter = ({ emitter }) => {
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) return

  var recog = new SpeechRecognition()
  recog.lang = 'en'
  recog.continuous = true
  recog.interimResults = true
  recog.serviceURI = 'wami.csail.mit.edu'

  /* Add event listener for onresult event */
  recog.addEventListener('result', handleEvent)
  recog.addEventListener('error', handleEvent)
  recog.addEventListener('end', handleEvent)
  recog.addEventListener('onnomatch', handleEvent)
  recog.addEventListener('onspeechend', handleEvent)

  function handleEvent (event) {
    switch (event && event.type) {
      case 'result':
        window.requestAnimationFrame(() => {
          let result = event.results[event.resultIndex]
          let item = result[0]

          emitter.emit('onResult', item.transcript)

          if (result.isFinal) {
            emitter.emit('onFinalResult', item.transcript)
          }
        })
        break

      case 'end':
      case 'error':
        recog.stop()
        emitter.emit('onStop')
        break
    }
  }

  return {
    start () {
      if (this.audio) {
        this.audio.pause()
      }
      recog.start()
      emitter.emit('onStart')
    },
    stop () {
      if (recog) {
        recog.stop()
        emitter.emit('onStop')
      }
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
        this.audio = TextToSpeech.synthesize({
          text,
          token,
          autoPlay: false
        })
        this.audio.play()
        this.audio.addEventListener('ended', () => {
          callback && callback()
        })
      })
    }
  }
}

export default adapter
