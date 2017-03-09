'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

var _watsonSpeech = require('watson-speech');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var watsonSpeechRecognizer = require('watson-speech/speech-to-text/recognize-microphone');

var sttTokenUrl = 'http://localhost:9003/api/speech-to-text/token';
var ttsTokenUrl = 'http://localhost:9003/api/speech-to-text/token/tts';

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;

  var activeSTT;
  return {
    start: function start() {
      var _this = this;

      if (this.audio) {
        this.audio.pause();
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
    getTtsToken: function getTtsToken() {
      var _this3 = this;

      /* Cache tts token */
      if (this._ttsToken) {
        return new Promise(function (resolve, reject) {
          resolve(_this3._ttsToken);
        });
      }
      return (0, _reqwest2.default)({
        url: ttsTokenUrl
      });
    },
    speak: function speak(text, callback) {
      var _this4 = this;

      this.getTtsToken().then(function (token) {
        _this4._ttsToken = token;
        _this4.audio = _watsonSpeech.TextToSpeech.synthesize({
          text: text,
          token: token,
          autoPlay: false
        });
        _this4.audio.play();
        _this4.audio.addEventListener('ended', function () {
          callback && callback();
        });
      });
    }
  };
};

exports.default = adapter;