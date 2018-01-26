'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Voice = require('./../Voice');

var _Voice2 = _interopRequireDefault(_Voice);

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchInput = function (_React$Component) {
  _inherits(SearchInput, _React$Component);

  function SearchInput(props) {
    _classCallCheck(this, SearchInput);

    var _this = _possibleConstructorReturn(this, (SearchInput.__proto__ || Object.getPrototypeOf(SearchInput)).call(this, props));

    _this.handleChange = function (event) {
      _this.setState({ text: event.target.value });
    };

    _this.clearText = function (event) {
      _this.setState({ text: '' });
    };

    _this.handleSubmit = function (event) {
      event && event.preventDefault();
      _this.props.onSubmit(_this.state.text);
      _this.clearText();
    };

    _this.onVoiceChange = function (text) {
      _this.setState({
        text: text
      });
    };

    _this.onVoiceFinal = function (text, cb, params) {
      _this.props.onSubmit(text, cb);
    };

    _this.state = {
      text: ''
    };
    return _this;
  }

  _createClass(SearchInput, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          voiceAdapter = _props.voiceAdapter,
          translate = _props.translate;

      return _react2.default.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        _react2.default.createElement(
          'div',
          { className: 'olachat-input' },
          _react2.default.createElement(
            'div',
            { className: 'olachat-input-voice' },
            _react2.default.createElement(_Voice2.default, {
              onResult: this.onVoiceChange,
              onFinalResult: this.onVoiceFinal,
              voiceAdapter: voiceAdapter
            })
          ),
          _react2.default.createElement('input', {
            type: 'text',
            placeholder: translate('search'),
            onChange: this.handleChange,
            value: this.state.text
          }),
          _react2.default.createElement('button', { type: 'submit', className: 'olachat-submit' })
        )
      );
    }
  }]);

  return SearchInput;
}(_react2.default.Component);

exports.default = _core.Decorators.withTranslate(SearchInput);