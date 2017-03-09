'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watsonSpeech = require('watson-speech');

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ttsTokenUrl = 'http://localhost:3003/api/speech-to-text/token/tts';

var END_OF_AUDIO = ['ENDPOINTER_EVENT_UNSPECIFIED', 'END_OF_SPEECH'];
var socketUrl = 'ws://localhost:9002';

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;


  function createStream() {
    return new Promise(function (resolve, reject) {
      var client = new BinaryClient(socketUrl);
      client.on('open', function () {
        window.Stream = client.createStream();
        window.Stream.on('data', function (data) {
          var d = JSON.parse(data);
          emitter.emit('onResult', d.results);
          if (END_OF_AUDIO.indexOf(d.endpointerType) !== -1) {
            emitter.emit('onFinalResult', d.results);
          }
        });
        resolve();
      });
    });
  }

  function convertoFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l);

    while (l--) {
      buf[l] = buffer[l] * 0xFFFF; //convert to 16 bit
    }
    return buf.buffer;
  }
  var recording = false;
  var audioStream;

  return {
    start: function start() {
      var _this = this;

      if (this.audio) {
        this.audio.pause();
      }
      createStream().then(function () {
        if (!navigator.getUserMedia) navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        if (navigator.getUserMedia) {
          navigator.getUserMedia({ audio: true }, _this.listen, function (e) {
            alert('Error capturing audio.');
          });
          emitter.emit('onStart');
          recording = true;
        } else alert('getUserMedia not supported in this browser.');
      });
    },
    listen: function listen(stream) {
      var audioContext = window.AudioContext || window.webkitAudioContext;
      var context = new audioContext();
      audioStream = stream;

      // the sample rate is in context.sampleRate
      var audioInput = context.createMediaStreamSource(stream);

      var bufferSize = 2048;
      var recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function (e) {
        if (!recording) return;
        // console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(left));
      };

      audioInput.connect(recorder);
      recorder.connect(context.destination);
    },
    stop: function stop() {
      recording = false;
      if (window.Stream) {
        window.Stream.end();
        for (var i = 0; i < audioStream.getAudioTracks().length; i++) {
          audioStream.getAudioTracks()[i].stop();
        }
      }
      emitter.emit('onStop');
    },
    getTtsToken: function getTtsToken() {
      var _this2 = this;

      /* Cache tts token */
      if (this._ttsToken) {
        return new Promise(function (resolve, reject) {
          resolve(_this2._ttsToken);
        });
      }
      return (0, _reqwest2.default)({
        url: ttsTokenUrl
      });
    },
    speak: function speak(text, callback) {
      var _this3 = this;

      this.getTtsToken().then(function (token) {
        _this3._ttsToken = token;
        _this3.audio = _watsonSpeech.TextToSpeech.synthesize({
          text: text,
          token: token,
          autoPlay: false
        });
        _this3.audio.play();
        _this3.audio.addEventListener('ended', function () {
          callback && callback();
        });
      });
    }
  };
};

exports.default = adapter;