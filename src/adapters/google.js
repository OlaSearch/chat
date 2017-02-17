import { TextToSpeech }  from 'watson-speech'
import reqwest from 'reqwest'
const ttsTokenUrl = 'http://localhost:3003/api/speech-to-text/token/tts'

const END_OF_AUDIO = ['ENDPOINTER_EVENT_UNSPECIFIED', 'END_OF_SPEECH']
const socketUrl = 'ws://localhost:9001'

const adapter = ({ emitter }) => {

  function createStream () {
    return new Promise((resolve, reject) => {
      var client = new BinaryClient(socketUrl)
      client.on('open', () => {
        window.Stream = client.createStream()
        window.Stream.on('data', (data) => {
          var d = JSON.parse(data)
          emitter.emit('onResult', d.results)
          if (END_OF_AUDIO.indexOf(d.endpointerType) !== -1) {
            emitter.emit('onFinalResult', d.results)
          }
        })
        resolve()
      })
    })
  }

  function convertoFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l)

    while (l--) {
      buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
    }
    return buf.buffer
  }
  var recording = false
  var audioStream

  return {
    start () {
      createStream()
        .then(() => {
          if (!navigator.getUserMedia)
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia || navigator.msGetUserMedia;

          if (navigator.getUserMedia) {
            navigator.getUserMedia({audio:true}, this.listen, (e) => {
              alert('Error capturing audio.');
            })
            emitter.emit('onStart')
            recording = true
          } else alert('getUserMedia not supported in this browser.');
        })
    },
    listen (e) {
      const audioContext = window.AudioContext || window.webkitAudioContext;
      const context = new audioContext();
      audioStream = e

      // the sample rate is in context.sampleRate
      const audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      const recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function(e){
        if(!recording) return;
        // console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(left));
      }

      audioInput.connect(recorder)
      recorder.connect(context.destination);
    },
    stop () {
      recording = false
      if (window.Stream) {
        window.Stream.end()
        audioStream.getAudioTracks()[0].stop()
      }
      emitter.emit('onStop')
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
