'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watsonSpeech = require('watson-speech');

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

var _utils = require('./../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Using watson for tts */
var ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts';
var sttTokenUrl = 'https://olasearch.com/api/speech-to-text/houndifyAuth';
var END_OF_AUDIO = ['END_OF_UTTERANCE'];
var socketUrl = 'ws://localhost:9002';

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;

  var audioStream;
  var audioInput;
  var recording = false;
  var OlaStream;
  var audioContext;
  var client = new BinaryClient(socketUrl);
  client.on('open', function () {
    console.log('socket open');
  });

  return {
    start: function start() {
      var isEndReached = false;
      var lastResult = '';
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(function (stream) {
        /* Emit start */
        emitter.emit('onStart');

        /* Create stream */
        OlaStream = client.createStream();
        OlaStream.on('data', function (data) {
          var d = JSON.parse(data);
          emitter.emit('onResult', d.results);
          // if (isEndReached) {
          //   if (d.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
          //     emitter.emit('onFinalResult', d.results)
          //   }
          //   if (d.endpointerType === 'END_OF_AUDIO') return
          // }
          if (END_OF_AUDIO.indexOf(d.endpointerType) !== -1) {
            emitter.emit('onFinalResult', lastResult);
            // isEndReached = true
          } else {
            lastResult = d.results;
          }
        });

        /* Set recording flag */
        recording = true;

        /* Add to window */
        audioStream = stream;

        var audioContext = window.AudioContext || window.webkitAudioContext;
        var context = new audioContext();
        audioInput = context.createMediaStreamSource(stream);
        var bufferSize = 2048;
        var recorder = context.createScriptProcessor(bufferSize, 1, 1);

        recorder.onaudioprocess = function (e) {
          if (!recording) return;
          var left = e.inputBuffer.getChannelData(0);
          OlaStream.write((0, _utils.convertoFloat32ToInt16)(left));
        };
        audioInput.connect(recorder);
        recorder.connect(context.destination);
      }).catch(function (err) {
        return console.log(err);
      });
    },
    stop: function stop() {
      if (OlaStream) {
        OlaStream.end();
        // OlaStream = null
      }
      if (audioContext) {
        // audioContext.close()
        // audioContext = null
      }
      if (audioStream) {
        for (var i = 0; i < audioStream.getAudioTracks().length; i++) {
          // audioStream.getAudioTracks()[i].stop()
        }
      }
      if (audioInput) {}
      // audioInput.disconnect()
      // audioInput = null

      /* Set flag to none */
      recording = false;
      emitter.emit('onStop');
    },
    prefetchToken: function prefetchToken() {
      var _this = this;

      this.getTtsToken().then(function (token) {
        return _this._ttsToken = token;
      });
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
    stopSpeaking: function stopSpeaking() {
      if (window.OlaAudio) {
        window.OlaAudio.pause();
      }
      if (window.speechSynthesis) {
        // window.speechSynthesis.cancel()
        window.speechSynthesis.pause();
      }
    },
    speak: function speak(text) {
      var _this3 = this;

      var isPhone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var callback = arguments[2];

      if (isPhone) {
        if (!window.speechSynthesis) return;
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance();
        utterance.lang = 'en-GB';
        utterance.pitch = 0.8;
        utterance.rate = 1;
        utterance.volume = 1;

        utterance.text = text;

        /* Say */
        window.speechSynthesis.speak(utterance);

        /* Call end */
        var _wait = function _wait() {
          if (!window.speechSynthesis.speaking) {
            callback && callback();
            if (timeout) clearInterval(timeout);
            return;
          }
          var timeout = window.setTimeout(_wait, 200);
        };
        _wait();

        return;
      }

      this.getTtsToken().then(function (token) {
        _this3._ttsToken = token;
        window.OlaAudio = _watsonSpeech.TextToSpeech.synthesize({
          text: text,
          token: token,
          autoPlay: false
        });
        window.OlaAudio.play();
        window.OlaAudio.addEventListener('ended', function () {
          callback && callback();
        });
      });
    }
  };
};

exports.default = adapter;