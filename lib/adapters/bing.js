'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watsonSpeech = require('watson-speech');

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts';

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;

  var lang = 'en-us';
  var key = 'c26cfca5009e48bc8e4f317d7f6219cb';
  var mode = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
  var client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(mode, lang, key);

  client.onPartialResponseReceived = function (response) {
    // console.log(response)
  };
  client.onFinalResponseReceived = function (res) {
    if (res) {
      emitter.emit('onFinalResult', res[0].transcript);
    }
  };

  return {
    start: function start() {
      client.startMicAndRecognition();
      setTimeout(function () {
        client.endMicAndRecognition();
      }, 5000);
      emitter.emit('onStart');
    },
    stop: function stop() {
      if (client) client.endMicAndRecognition();
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
    speak: function speak(text) {
      var _this3 = this;

      var isPhone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var callback = arguments[2];

      if (isPhone) {
        if (!window.speechSynthesis) return;
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