'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FeedBack = function (_React$Component) {
  _inherits(FeedBack, _React$Component);

  function FeedBack() {
    _classCallCheck(this, FeedBack);

    return _possibleConstructorReturn(this, (FeedBack.__proto__ || Object.getPrototypeOf(FeedBack)).apply(this, arguments));
  }

  _createClass(FeedBack, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.disabledFeedback();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          isActive = _props.isActive,
          isBot = _props.isBot,
          isTyping = _props.isTyping,
          messageIdx = _props.messageIdx,
          awaitingUserInput = _props.message.awaitingUserInput;

      if (!isActive || !isBot || isTyping || !awaitingUserInput || messageIdx < 1) return null;
      return _react2.default.createElement(
        'div',
        { className: 'olachat-feedback' },
        _react2.default.createElement(
          'a',
          { onClick: this.props.activateFeedback },
          'Something not right?'
        )
      );
    }
  }]);

  return FeedBack;
}(_react2.default.Component);

module.exports = (0, _reactRedux.connect)(null, { activateFeedback: _actions.activateFeedback, disabledFeedback: _actions.disabledFeedback })(FeedBack);