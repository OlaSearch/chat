'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watsonSpeech = require('watson-speech');

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');
var L16 = require('./webaudio-l16-stream.js');

var ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts';
var END_OF_AUDIO = ['END_OF_UTTERANCE', 'END_OF_AUDIO'];
var socketUrl = 'wss://olasearch.com/socket';
var client = new BinaryClient(socketUrl);
var OlaStream;

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter;

  var getMicStream;
  var micStream;
  return {
    start: function start() {
      var _this = this;

      var finalResult = null;
      var hasEndReached = false;
      var pm = getUserMedia({ video: false, audio: true });
      OlaStream = client.createStream();
      OlaStream.on('data', function (data) {
        var d = JSON.parse(data);
        emitter.emit('onResult', d.results);

        if (d.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
          finalResult = d.results;
          if (hasEndReached) {
            emitter.emit('onFinalResult', d.results);
          }
        }
        if (END_OF_AUDIO.indexOf(d.endpointerType) !== -1) {
          _this.stop();
          hasEndReached = true;
          if (!finalResult) {
            /* When we didnt recognize anything */
            if (d.endpointerType === 'END_OF_UTTERANCE') {}
            // console.log('called')

            // this.start()
          }
        }
      });
      getMicStream = pm.then(function (mic) {
        var l16Stream = new L16({ writableObjectMode: true });
        micStream = new MicrophoneStream(mic, {
          objectMode: true
        });
        micStream.pipe(l16Stream).pipe(OlaStream);
        emitter.emit('onStart');
      });
    },
    stop: function stop() {
      micStream && micStream.stop();
      OlaStream && OlaStream.end();
      emitter.emit('onStop');
    },
    prefetchToken: function prefetchToken() {
      var _this2 = this;

      this.getTtsToken().then(function (token) {
        return _this2._ttsToken = token;
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
      var _this4 = this;

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
        _this4._ttsToken = token;
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