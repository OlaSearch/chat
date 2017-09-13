'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _olasearch = require('olasearch');

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuickReplies = function (_React$Component) {
  _inherits(QuickReplies, _React$Component);

  function QuickReplies() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, QuickReplies);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = QuickReplies.__proto__ || Object.getPrototypeOf(QuickReplies)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (label) {
      _this.props.updateQueryTerm(label);
      _this.props.onSubmit();
      _this.props.log({
        eventCategory: 'quick_reply',
        eventLabel: label,
        eventAction: 'click',
        eventType: 'C',
        result: { title: label }
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(QuickReplies, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var quickReplies = this.props.quickReplies;

      if (!quickReplies || !quickReplies.length) return null;
      var replies = quickReplies.map(function (_ref2, idx) {
        var label = _ref2.label;
        return _react2.default.createElement(QuickReplyButton, { key: idx, handleClick: _this2.handleClick, label: label });
      });
      return _react2.default.createElement(
        'div',
        { className: 'olachat-smartsuggestions' },
        _react2.default.createElement(
          _CSSTransitionGroup2.default,
          {
            transitionName: 'qreply',
            transitionAppear: true,
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300,
            transitionAppearTimeout: 300,
            component: 'div',
            className: 'olachat-smartsuggestions-list'
          },
          replies
        )
      );
    }
  }]);

  return QuickReplies;
}(_react2.default.Component);

QuickReplies.defaultProps = {
  quickReplies: []
};


var QuickReplyButton = function QuickReplyButton(_ref3) {
  var label = _ref3.label,
      handleClick = _ref3.handleClick,
      isActive = _ref3.isActive;

  function onClick() {
    handleClick(label);
  }

  return _react2.default.createElement(
    'button',
    {
      className: 'olachat-smartsuggestions-button',
      type: 'button',
      onClick: onClick
    },
    label
  );
};

function mapStateToProps(state) {
  var len = state.Conversation.messages.length;
  var latestMsg = state.Conversation.messages[len - 1];
  return {
    quickReplies: latestMsg ? latestMsg.quick_replies : null
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, { updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm })(_olasearch.Decorators.withLogger(QuickReplies));