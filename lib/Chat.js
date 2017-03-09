'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var _Messages = require('./Messages');

var _Messages2 = _interopRequireDefault(_Messages);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _houndify = require('./adapters/houndify');

var _houndify2 = _interopRequireDefault(_houndify);

var _webkit = require('./adapters/webkit');

var _webkit2 = _interopRequireDefault(_webkit);

var _mitt = require('mitt');

var _mitt2 = _interopRequireDefault(_mitt);

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import watson from './adapters/watson'
// import bing from './adapters/bing'
// import google from './adapters/google'


/**
 * Same emitter is shared by context
 * @type {[type]}
 */
var emitter = (0, _mitt2.default)();

var Chat = function (_React$Component) {
  _inherits(Chat, _React$Component);

  function Chat(props) {
    _classCallCheck(this, Chat);

    /* Create a voiceadapter */
    var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

    _this.addMessage = function () {
      /* Scroll to Top */
      _this.MessageContainer.scrollToView();

      /* Add message */
      return _this.props.addMessage().then(function (reply) {
        /* Scroll to Top after bot replies */
        _this.MessageContainer.scrollToView();

        return reply;
      });
    };

    _this.voiceAdapter = true ? (0, _houndify2.default)({ emitter: emitter }) : (0, _webkit2.default)({ emitter: emitter });

    /* Remove rubber band scrolling */
    props.isPhone && document.body.addEventListener('touchmove', function (e) {
      return e.preventDefault();
    });
    return _this;
  }

  _createClass(Chat, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        emitter: emitter
      };
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      /* Unbind */
      this.props.isPhone && document.body.removeEventListener('touchmove');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.addMessage({ singleLoop: true }, {
        intent: 'maternity-leave'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'olachat' },
        _react2.default.createElement(_Header2.default, {
          onHide: this.props.onHide,
          title: this.props.title
        }),
        _react2.default.createElement(_Messages2.default, {
          messages: this.props.messages,
          flipped: this.props.flipped,
          isTyping: this.props.isTyping,
          ref: function ref(el) {
            return _this2.MessageContainer = el;
          },
          onLoad: this.props.onLoad
        }),
        _react2.default.createElement(_Input2.default, {
          onSubmit: this.addMessage,
          voiceAdapter: this.voiceAdapter,
          updateQueryTerm: this.props.updateQueryTerm,
          addContextField: this.props.addContextField,
          isTyping: this.props.isTyping,
          searchInput: this.props.searchInput,
          ref: function ref(el) {
            return _this2.InputContainer = el;
          }
        })
      );
    }
  }]);

  return Chat;
}(_react2.default.Component);

Chat.defaultProps = {
  flipped: true,
  title: 'Ola Bot',
  onLoad: function onLoad() {
    return new Promise(function (resolve, reject) {
      return resolve();
    });
  }
};
Chat.childContextTypes = {
  emitter: _react2.default.PropTypes.object
};


function mapStateToProps(state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    searchInput: state.QueryState.searchInput
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, { addMessage: _actions.addMessage, updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm, addContextField: _olasearch.Actions.Context.addContextField })(Chat);