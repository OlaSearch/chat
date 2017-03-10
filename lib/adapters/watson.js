'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

var _watsonSpeech = require('watson-speech');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var watsonSpeechRecognizer = require('watson-speech/speech-to-text/recognize-microphone');

var ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts';
var sttTokenUrl = 'https://olasearch.com/api/speech-to-text/token';

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;

  var activeSTT;
  return {
    start: function start() {
      var _this = this;

      if (window.OlaAudio) {
        window.OlaAudio.pause();
      }
      return this.getSttToken().then(function (token) {
        _this._sttToken = token;
        _this.stream = watsonSpeechRecognizer({
          token: token,
          // model: 'en-US_BroadbandModel',
          continuous: false, // false = automatically stop transcription the first time a pause is detected
          objectMode: true // send objects instead of text
        });

        emitter.emit('onStart');

        _this.stream.on('data', function (data) {
          var text = data.alternatives[0].transcript;
          var isFinal = data.final;
          emitter.emit('onResult', text);
          if (isFinal) {
            emitter.emit('onFinalResult', text);
          }
        });
      });
    },
    stop: function stop() {
      if (this.stream) {
        this.stream.stop();
        this.stream = null;
      }
      emitter.emit('onStop');
    },
    getSttToken: function getSttToken() {
      var _this2 = this;

      /* Cache tts token */
      if (this._sttToken) {
        return new Promise(function (resolve, reject) {
          resolve(_this2._sttToken);
        });
      }
      return (0, _reqwest2.default)({
        url: sttTokenUrl
      });
    },
    prefetchToken: function prefetchToken() {
      var _this3 = this;

      this.getTtsToken().then(function (token) {
        return _this3._ttsToken = token;
      });
    },
    getTtsToken: function getTtsToken() {
      var _this4 = this;

      /* Cache tts token */
      if (this._ttsToken) {
        return new Promise(function (resolve, reject) {
          resolve(_this4._ttsToken);
        });
      }
      return (0, _reqwest2.default)({
        url: ttsTokenUrl
      });
    },
    speak: function speak(text) {
      var _this5 = this;

      var isPhone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var callback = arguments[2];

      this.getTtsToken().then(function (token) {
        _this5._ttsToken = token;
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