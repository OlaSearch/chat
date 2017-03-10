'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Message = require('./Message');

var _Message2 = _interopRequireDefault(_Message);

var _TypingIndicator = require('./TypingIndicator');

var _TypingIndicator2 = _interopRequireDefault(_TypingIndicator);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Message interface
 * message = {
 *   id,
 *   user_id,
 *   text,
 *   timestamp
 * }
 */

var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {/* pass */}

var Messages = function (_React$Component) {
  _inherits(Messages, _React$Component);

  function Messages(props) {
    _classCallCheck(this, Messages);

    var _this = _possibleConstructorReturn(this, (Messages.__proto__ || Object.getPrototypeOf(Messages)).call(this, props));

    _this.pollScroll = function () {
      _this.previousScrollTop = _reactDom2.default.findDOMNode(_this).scrollTop;
      _this.onScroll();
      _this.rafRequestId = window.requestAnimationFrame(_this.pollScroll);
    };

    _this.onScroll = function () {
      var domNode = _reactDom2.default.findDOMNode(_this);
      var scrollDirection = domNode.scrollTop < _this.previousScrollTop ? 'up' : 'down';

      /* Update previous scroll */
      _this.previousScrollTop = domNode.scrollTop;

      if (!_this.props.flipped && scrollDirection === 'up') return;
      if (_this.props.flipped && scrollDirection === 'down') return;

      if (domNode.scrollTop !== _this.scrollTop) {
        if (_this.shouldTriggerLoad(domNode)) {
          _this.setState({ isInfiniteLoading: true });
          var p = _this.props.onLoad();
          p.then(function () {
            return _this.setState({ isInfiniteLoading: false });
          });
        }
        // the dom is ahead of the state
        _this.updateScrollTop();
      }
    };

    _this.isPassedThreshold = function (flipped, scrollLoadThreshold, scrollTop, scrollHeight, clientHeight) {
      return flipped ? scrollTop <= scrollLoadThreshold : scrollTop >= scrollHeight - clientHeight - scrollLoadThreshold;
    };

    _this.shouldTriggerLoad = function (domNode) {
      var passedThreshold = _this.isPassedThreshold(_this.props.flipped, _this.props.scrollLoadThreshold, domNode.scrollTop, domNode.scrollHeight, domNode.clientHeight);
      return passedThreshold && !_this.state.isLoading;
    };

    _this.updateScrollTop = function () {
      var scrollableDomEl = _reactDom2.default.findDOMNode(_this);
      var newScrollTop = scrollableDomEl.scrollTop + (_this.props.flipped ? scrollableDomEl.scrollHeight - (_this.scrollHeight || 0) : 0);
      var scrollHeightDifference = _this.scrollHeight ? _this.scrollHeight - scrollableDomEl.scrollHeight : 0;

      // if something was removed from list we need to include this difference in new scroll top
      if (_this.props.flipped && scrollHeightDifference > 0) {
        newScrollTop += scrollHeightDifference;
      }
      if (newScrollTop !== scrollableDomEl.scrollTop) {
        scrollableDomEl.scrollTop = newScrollTop;
      }
      _this.scrollTop = scrollableDomEl.scrollTop;
      _this.scrollHeight = scrollableDomEl.scrollHeight;
    };

    _this.scrollToView = function () {
      var scrollableDomEl = _reactDom2.default.findDOMNode(_this);
      scrollableDomEl.scrollTop = _this.props.flipped ? _this.scrollHeight : 0;
    };

    _this.scrollTop = 0;
    _this.previousScrollTop = 0;
    _this.scrollHeight = undefined;
    _this.state = {
      isInfiniteLoading: false
    };
    return _this;
  }

  _createClass(Messages, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var scrollableDomEl = _reactDom2.default.findDOMNode(this);
      // If there are not yet any children (they are still loading),
      // this is a no-op as we are at both the top and bottom of empty viewport
      var heightDifference = this.props.flipped ? scrollableDomEl.scrollHeight - scrollableDomEl.clientHeight : 0;

      scrollableDomEl.scrollTop = heightDifference;
      this.scrollTop = heightDifference;

      // Unless passive events are supported, we must not hook onScroll event
      // directly - that will break hardware accelerated scrolling. We poll it
      // with requestAnimationFrame instead.
      if (supportsPassive) {
        scrollableDomEl.addEventListener('scroll', this.onScroll, { passive: true });
      } else {
        this.rafRequestId = window.requestAnimationFrame(this.pollScroll);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(nextProps) {
      this.updateScrollTop();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          messages = _props.messages,
          flipped = _props.flipped,
          messageComponent = _props.messageComponent,
          isTyping = _props.isTyping;
      var isInfiniteLoading = this.state.isInfiniteLoading;

      if (!flipped) {
        messages = messages.slice().reverse();
      }
      var loadingSpinner = isInfiniteLoading ? _react2.default.createElement(
        'div',
        null,
        'Loading'
      ) : null;
      var messagesComponent = messageComponent ? messages.map(messageComponent) : messages.map(function (message, idx) {
        return _react2.default.createElement(_Message2.default, { message: message, key: message.id });
      });

      return _react2.default.createElement(
        'div',
        { className: 'olachat-messages' },
        _react2.default.createElement(
          'div',
          { className: 'olachat-messages-wrapper' },
          isTyping ? flipped ? null : _react2.default.createElement(_TypingIndicator2.default, null) : null,
          _react2.default.createElement(
            _reactAddonsCssTransitionGroup2.default,
            {
              transitionName: 'messages',
              transitionAppear: true,
              transitionAppearTimeout: 300,
              transitionEnterTimeout: 500,
              transitionLeave: false,
              component: 'div',
              className: 'olachat-messages-list'
            },
            messagesComponent
          ),
          flipped ? null : loadingSpinner,
          isTyping ? flipped ? _react2.default.createElement(_TypingIndicator2.default, null) : null : null
        )
      );
    }
  }]);

  return Messages;
}(_react2.default.Component);

Messages.defaultProps = {
  flipped: false,
  scrollLoadThreshold: 10,
  messageComponent: null
};
exports.default = Messages;