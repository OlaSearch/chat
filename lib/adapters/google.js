'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watsonSpeech = require('watson-speech');

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

var _getUserMediaPromise = require('get-user-media-promise');

var _getUserMediaPromise2 = _interopRequireDefault(_getUserMediaPromise);

var _microphoneStream = require('microphone-stream');

var _microphoneStream2 = _interopRequireDefault(_microphoneStream);

var _webaudioL16Stream = require('./webaudio-l16-stream.js');

var _webaudioL16Stream2 = _interopRequireDefault(_webaudioL16Stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ttsTokenUrl = 'https://olasearch.com/api/speech-to-text/token/tts';
var END_OF_AUDIO = ['END_OF_UTTERANCE', 'END_OF_AUDIO'];
var socketUrl = 'wss://olasearch.com/socket';
var client = new BinaryClient(socketUrl);
var OlaStream;
var connected = false;

var checkIfConnected = function checkIfConnected(callback) {
  if (!client || connected) return callback ? callback() : false;
  if (!connected) {
    client = new BinaryClient(socketUrl);
    client.on('open', function () {
      connected = true;
      callback && callback();
    });
    client.on('close', function () {
      connected = false;
    });
  }
};

var adapter = function adapter(_ref) {
  var emitter = _ref.emitter,
      onConnected = _ref.onConnected;

  var getMicStream;
  var micStream;

  return {
    start: function start() {
      var _this = this;

      var finalResult = null;
      var hasEndReached = false;
      var pm = (0, _getUserMediaPromise2.default)({ video: false, audio: true });
      /* Todo: Connect/Reconnect */
      checkIfConnected(function () {
        /* Connected callback */
        onConnected && onConnected();
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
          var l16Stream = new _webaudioL16Stream2.default({ writableObjectMode: true });
          micStream = new _microphoneStream2.default(mic, {
            objectMode: true
            // bufferSize: options.bufferSize
          });
          micStream.pipe(l16Stream).pipe(OlaStream);
          emitter.emit('onStart');
        });
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
        if (!window.speechSynthesis || window.speechSynthesis.getVoices().length < 1) return callback ? callback() : false;
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