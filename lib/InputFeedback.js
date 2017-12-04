'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFlexiTextarea = require('react-flexi-textarea');

var _reactFlexiTextarea2 = _interopRequireDefault(_reactFlexiTextarea);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputFeedback = function (_React$Component) {
  _inherits(InputFeedback, _React$Component);

  function InputFeedback(props) {
    _classCallCheck(this, InputFeedback);

    var _this = _possibleConstructorReturn(this, (InputFeedback.__proto__ || Object.getPrototypeOf(InputFeedback)).call(this, props));

    _this.onFormSubmit = function (e) {
      e.preventDefault();
      if (!_this.state.message) return _this.Input.el.focus();
      /* Log feedback */
      _this.props.logFeedback(_this.state.message);
      _this.setState({
        message: '',
        submitted: true
      }, function () {
        setTimeout(_this.cancelFeedback, 1000);
      });
    };

    _this.onChange = function (e) {
      _this.setState({
        message: e.target.value
      });
    };

    _this.cancelFeedback = function (e) {
      _this.props.disabledFeedback();
    };

    _this.registerRef = function (el) {
      _this.Input = el;
    };

    _this.state = {
      message: '',
      submitted: false
    };
    return _this;
  }

  _createClass(InputFeedback, [{
    key: 'render',
    value: function render() {
      var submitted = this.state.submitted;

      return _react2.default.createElement(
        'form',
        {
          className: 'olachat-footer olachat-footer-feedback',
          onSubmit: this.onFormSubmit
        },
        _react2.default.createElement(
          'div',
          { className: 'olachat-input' },
          submitted ? _react2.default.createElement(
            'span',
            { className: 'olachat-feedback-thankyou' },
            'Thank you for your feedback'
          ) : _react2.default.createElement(_reactFlexiTextarea2.default, {
            placeholder: 'Enter your feedback',
            onChange: this.onChange,
            value: this.state.message,
            rows: 1,
            cols: 1,
            autoFocus: true,
            ref: this.registerRef
          })
        ),
        submitted ? null : _react2.default.createElement(
          'button',
          { className: 'olachat-submit' },
          _react2.default.createElement(
            'span',
            null,
            'Send'
          )
        ),
        _react2.default.createElement(
          'button',
          {
            className: 'olachat-button-cancel',
            type: 'button',
            onClick: this.cancelFeedback
          },
          _react2.default.createElement(
            'span',
            null,
            submitted ? 'Continue' : 'Cancel'
          )
        )
      );
    }
  }]);

  return InputFeedback;
}(_react2.default.Component);

module.exports = (0, _reactRedux.connect)(null, { disabledFeedback: _actions.disabledFeedback, logFeedback: _actions.logFeedback })(InputFeedback);