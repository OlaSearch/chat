'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _olasearch = require('olasearch');

var _TransitionGroup = require('react-transition-group/TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DISAMBIGUATION_INTENT_NAME = 'OLA.DisambiguateIntent';

var SlotOptions = function (_Component) {
  _inherits(SlotOptions, _Component);

  function SlotOptions() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SlotOptions);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SlotOptions.__proto__ || Object.getPrototypeOf(SlotOptions)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SlotOptions, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          options = _props.options,
          isActive = _props.isActive;

      if (!options || !options.length) return null;
      var replies = options.map(function (_ref2, idx) {
        var label = _ref2.label,
            value = _ref2.value,
            intent = _ref2.intent;
        return _react2.default.createElement(
          _CSSTransition2.default,
          { key: idx, timeout: { enter: 300, exit: 300 }, classNames: 'qreply' },
          _react2.default.createElement(QuickReplyButton, { intent: intent, label: label, value: value, isActive: isActive, handleClick: _this2.handleClick })
        );
      });

      // if (!isActive) replies = null
      return _react2.default.createElement(
        'div',
        { className: 'olachat-qreply' },
        _react2.default.createElement(
          _TransitionGroup2.default,
          {
            appear: true,
            className: 'olachat-qreply-list'
          },
          replies
        )
      );
    }
  }]);

  return SlotOptions;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.handleClick = function (_ref4) {
    var label = _ref4.label,
        value = _ref4.value,
        selectedIntent = _ref4.intent;
    var _props2 = _this3.props,
        intent = _props2.intent,
        message = _props2.message;

    var args = intent === DISAMBIGUATION_INTENT_NAME ? { intent: selectedIntent } : {};
    if (intent === DISAMBIGUATION_INTENT_NAME) {
      /* Log */
      _this3.props.log({
        eventLabel: selectedIntent,
        eventCategory: 'intent_training',
        eventType: 'O'
      });
    }
    _this3.props.updateQueryTerm(label);
    _this3.props.onSubmit(args);
  };
};

var QuickReplyButton = function QuickReplyButton(_ref3) {
  var label = _ref3.label,
      value = _ref3.value,
      intent = _ref3.intent,
      handleClick = _ref3.handleClick,
      isActive = _ref3.isActive;

  function onClick() {
    handleClick({ label: label, value: value, intent: intent });
  }
  return _react2.default.createElement(
    'button',
    {
      className: 'olachat-qreply-button',
      type: 'button',
      onClick: onClick,
      disabled: !isActive
    },
    label
  );
};

exports.default = (0, _reactRedux.connect)(null, { updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm })(SlotOptions);