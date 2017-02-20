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
      client.endMicAndRecognition()
      emitter.emit('onStop')
    },
    speak () {

    }
  }
}

export default adapter