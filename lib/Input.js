'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Voice = require('./Voice');

var _Voice2 = _interopRequireDefault(_Voice);

var _core = require('@olasearch/core');

var _textareaElastic = require('@olasearch/textarea-elastic');

var _textareaElastic2 = _interopRequireDefault(_textareaElastic);

var _QuerySuggestions = require('./QuerySuggestions');

var _QuerySuggestions2 = _interopRequireDefault(_QuerySuggestions);

var _reactRedux = require('react-redux');

var _HelpMenu = require('./HelpMenu');

var _HelpMenu2 = _interopRequireDefault(_HelpMenu);

var _reactOnclickoutside = require('@olasearch/react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _arrowRightCircle = require('@olasearch/icons/lib/arrow-right-circle');

var _arrowRightCircle2 = _interopRequireDefault(_arrowRightCircle);

var _navigation = require('@olasearch/icons/lib/navigation');

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var supportsVoice = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var Input = function (_React$Component) {
  _inherits(Input, _React$Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props));

    _this.handleClickOutside = function (event) {
      /* Check if its already closed */
      if (!_this.state.suggestedTerm && !_this.state.suggestions.length) return;
      _this.closeSuggestion();
    };

    _this.onChange = function (event) {
      var text = event && event.target ? event.target.value : event;
      _this.setState({ text: text });
      if (text) {
        /**
         * Auto suggest queries
         */
        var lastMsg = _this.props.messages[_this.props.messages.length - 1];
        var hasQuickReply = lastMsg && lastMsg.slot_options && lastMsg.slot_options.length;

        if (!hasQuickReply || _this.props.isTyping) {
          _this.props.dispatch(_core.Actions.AutoSuggest.executeFuzzyAutoSuggest(text)).then(function (values) {
            if (!values) return _this.closeSuggestion();

            _this.setState({
              suggestions: values.slice(0, 5).map(function (item) {
                return { term: item.term };
              }),
              suggestedTerm: null,
              suggestedIndex: null
            });
          });
        } else {
          _this.closeSuggestion();
        }
      } else {
        _this.closeSuggestion();
      }

      _this.props.onChange && _this.props.onChange(text);
    };

    _this.onVoiceChange = function (text) {
      _this.setState({
        text: text
      });
    };

    _this.clearText = function () {
      _this.setState({
        text: ''
      });
    };

    _this.onVoiceFinal = function (text, cb) {
      /* Set text to empty */
      if (typeof text === 'undefined') text = '';

      /* Update text */
      _this.setState({
        text: text
      }, function () {
        return _this.onSubmit(null, cb, 300, _core.Settings.SEARCH_INPUTS.VOICE);
      });
    };

    _this.onFormSubmit = function (event) {
      /* Stop form submission */
      event && event.preventDefault();
      /* Check if suggestedTerm is active */
      if (_this.state.suggestedTerm) {
        _this.setState({
          text: _this.state.suggestedTerm.term
        });
      }
      /* Close any suggestions */
      _this.closeSuggestion();

      /* Stop submitting if text is empty */
      if (!_this.state.text || !_this.state.text.trim()) {
        return _this.Input.el.focus();
      }

      setTimeout(_this.onSubmit, 0);
    };

    _this.onSubmit = function (event, callback) {
      var textClearingDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var searchInput = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _core.Settings.SEARCH_INPUTS.KEYBOARD;

      /* Update query term */
      _this.props.updateQueryTerm(_this.state.text, searchInput);

      /**
       * Flow
       * 1. Immediate add to the messages redux atore
       * 2. Sync the message to the server
       * 3. Update sync status in redux store
       */

      // if (this.state.isTyping) return

      /* Clear the final text input after 100ms */
      /* To simulate delay */
      setTimeout(function () {
        _this.setState({
          text: ''
        });

        /* Resize height */
        _this.Input.autoGrow();

        /* Focus */
        if (!_this.props.isPhone) _this.Input.el.focus();
      }, textClearingDelay);

      /* Submit the message */
      return _this.props.onSubmit().then(function (response) {
        /* Callbacks */
        callback && typeof callback === 'function' && callback(response);
      });
    };

    _this.closeSuggestion = function () {
      _this.setState({
        suggestions: [],
        suggestedIndex: null,
        suggestedTerm: null
      });
    };

    _this.onKeyDown = function (event) {
      var index = null;
      switch (event.nativeEvent.which) {
        case 13:
          // Enter key
          _this.closeSuggestion();
          if (!event.nativeEvent.shiftKey) {
            _this.onFormSubmit(event);
          }
          break;

        case 27:
          // Escape
          /* Check if suggestion is active */
          if (_this.state.suggestedIndex || _this.state.suggestions.length) {
            return _this.closeSuggestion();
          }
          /* Close chatbot */
          if (!_this.state.text) {
            _this.props.onRequestClose && _this.props.onRequestClose();
          } else {
            return _this.clearText();
          }
          break;

        case 38:
          // Up
          if (_this.state.suggestedIndex === null) {
            index = _this.state.suggestions.length - 1;
          } else {
            var i = _this.state.suggestedIndex - 1;
            if (i < 0) {
              index = null;
            } else {
              index = i;
            }
          }
          _this.setState({
            suggestedIndex: index,
            suggestedTerm: index === null ? null : _this.state.suggestions[index]
          });
          break;
        case 40:
          // Down
          if (_this.state.suggestedIndex === null) {
            index = 0;
          } else {
            var _i = _this.state.suggestedIndex + 1;
            if (_i >= _this.state.suggestions.length) {
              index = null;
            } else {
              index = _i;
            }
          }
          _this.setState({
            suggestedIndex: index,
            suggestedTerm: index === null ? null : _this.state.suggestions[index]
          });
          break;
      }
    };

    _this.registerRef = function (el) {
      _this.Input = el;
    };

    _this.onSuggestionChange = function (text) {
      _this.setState({ text: text, suggestedIndex: null, suggestedTerm: null, suggestions: [] }, function () {
        _this.onFormSubmit();
      });
    };

    _this.state = {
      text: '',
      suggestions: [],
      suggestedIndex: null,
      suggestedTerm: null
    };
    return _this;
  }

  _createClass(Input, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.messages !== this.props.messages || nextProps.isTyping !== this.props.isTyping || nextProps.location !== this.props.location || nextState.text !== this.state.text || nextState.suggestions !== this.state.suggestions || nextState.suggestedTerm !== this.state.suggestedTerm || nextState.suggestedIndex !== this.state.suggestedIndex;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          isTyping = _props.isTyping,
          voiceInput = _props.voiceInput,
          translate = _props.translate;
      var _state = this.state,
          suggestions = _state.suggestions,
          suggestedIndex = _state.suggestedIndex,
          suggestedTerm = _state.suggestedTerm,
          text = _state.text;

      var inputValue = suggestedTerm ? suggestedTerm.term : text;
      return _react2.default.createElement(
        'form',
        { className: 'olachat-footer', onSubmit: this.onFormSubmit },
        suggestions.length && text ? _react2.default.createElement(_QuerySuggestions2.default, {
          onChange: this.onSuggestionChange,
          suggestions: suggestions,
          activeIndex: suggestedIndex,
          queryTerm: text
        }) : null,
        _react2.default.createElement(_HelpMenu2.default, {
          onSubmit: this.props.onSubmit,
          updateQueryTerm: this.props.updateQueryTerm
        }),
        _react2.default.createElement(
          'div',
          { className: 'olachat-input' },
          _react2.default.createElement(_textareaElastic2.default, {
            placeholder: translate('type_a_message'),
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
            value: inputValue,
            rows: 1,
            cols: 20,
            ref: this.registerRef,
            autoFocus: !this.props.isPhone,
            initialHeight: 50
          })
        ),
        this.props.location ? _react2.default.createElement(_core.GeoLocation, { icon: _react2.default.createElement(_navigation2.default, { size: 20 }), showLabel: false }) : null,
        voiceInput && supportsVoice ? _react2.default.createElement(
          'div',
          { className: 'olachat-input-voice' },
          _react2.default.createElement(_Voice2.default, {
            onResult: this.onVoiceChange,
            onFinalResult: this.onVoiceFinal,
            voiceAdapter: this.props.voiceAdapter
          })
        ) : null,
        _react2.default.createElement(
          'button',
          {
            disabled: isTyping || !this.state.text,
            className: 'olachat-submit'
          },
          _react2.default.createElement(_arrowRightCircle2.default, null)
        )
      );
    }
  }]);

  return Input;
}(_react2.default.Component);

Input.contextTypes = {
  document: _propTypes2.default.object
};
exports.default = (0, _reactRedux.connect)(null)(_core.Decorators.withTranslate((0, _reactOnclickoutside2.default)(Input, {
  getDocument: function getDocument(instance) {
    return instance.context.document || document;
  }
})));