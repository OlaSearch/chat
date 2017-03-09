'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watsonSpeech = require('watson-speech');

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

var _houndifyWebSdk = require('houndify-web-sdk');

var _houndifyWebSdk2 = _interopRequireDefault(_houndifyWebSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Using watson for tts */
var ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts';
var sttTokenUrl = 'https://olasearch.com/api/speech-to-text/houndifyAuth';
var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;

  // var clientID = '9ALURR6Jwu_tNlNrXt4xxA=='
  var clientID = 'XtaMCHjUQ26sSPMPcXamLw==';
  var client = new _houndifyWebSdk2.default.HoundifyClient({
    clientId: clientID,
    authURL: sttTokenUrl,
    enableVAD: true,
    onResponse: function onResponse(response, info) {
      if (response.AllResults && response.AllResults[0] !== undefined) {
        emitter.emit('onFinalResult', response.AllResults[0].FormattedTranscription);
      }
    },
    onError: function onError() {
      emitter.emit('onStop');
    },
    onTranscriptionUpdate: function onTranscriptionUpdate(trObj) {
      emitter.emit('onResult', trObj.PartialTranscript);
    },
    onRecordingStarted: function onRecordingStarted() {
      emitter.emit('onStart');
    },
    onRecordingStopped: function onRecordingStopped() {
      emitter.emit('onStop');
    }
  });

  return {
    start: function start() {
      if (this.audio) {
        this.audio.pause();
      }
      var requestInfo = {
        ClientID: clientID
      };
      if (client.voiceSearch.isStreaming()) {
        client.voiceSearch.stop();
      } else {
        client.voiceSearch.startRecording(requestInfo);
      }
    },
    stop: function stop() {
      client.voiceSearch.stop();
      if (this.audio) {
        this.audio.pause();
      }
    },
    getTtsToken: function getTtsToken() {
      var _this = this;

      /* Cache tts token */
      if (this._ttsToken) {
        return new Promise(function (resolve, reject) {
          resolve(_this._ttsToken);
        });
      }
      return (0, _reqwest2.default)({
        url: ttsTokenUrl
      });
    },
    speak: function speak(text) {
      var _this2 = this;

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
        _this2._ttsToken = token;
        _this2.audio = _watsonSpeech.TextToSpeech.synthesize({
          text: text,
          token: token,
          autoPlay: false
        });
        _this2.audio.play();
        _this2.audio.addEventListener('ended', function () {
          callback && callback();
        });
      });
    }
  };
};

exports.default = adapter;