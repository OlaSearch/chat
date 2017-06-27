'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _domCss = require('dom-css');

var _domCss2 = _interopRequireDefault(_domCss);

var _reactCustomScrollbars = require('react-custom-scrollbars');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (WrappedComponent) {
  var WithScrollShadow = function (_React$Component) {
    _inherits(WithScrollShadow, _React$Component);

    function WithScrollShadow() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WithScrollShadow);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WithScrollShadow.__proto__ || Object.getPrototypeOf(WithScrollShadow)).call.apply(_ref, [this].concat(args))), _this), _this.handleScroll = function (values) {
        var _this$refs = _this.refs,
            shadowTop = _this$refs.shadowTop,
            shadowBottom = _this$refs.shadowBottom;
        var scrollTop = values.scrollTop,
            scrollHeight = values.scrollHeight,
            clientHeight = values.clientHeight;

        var shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20);
        var bottomScrollTop = scrollHeight - clientHeight;
        var shadowBottomOpacity = 1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
        (0, _domCss2.default)(shadowTop, { opacity: shadowTopOpacity });
        (0, _domCss2.default)(shadowBottom, { opacity: shadowBottomOpacity });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(WithScrollShadow, [{
      key: 'render',
      value: function render() {
        var shadowTopStyle = {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%)'
        };
        var shadowBottomStyle = {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 10,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%)'
        };

        var _props = this.props,
            projectId = _props.projectId,
            projects = _props.projects,
            props = _objectWithoutProperties(_props, ['projectId', 'projects']);

        return _react2.default.createElement(
          'div',
          { className: 'ScrollWrapper' },
          _react2.default.createElement(
            _reactCustomScrollbars.Scrollbars,
            _extends({
              onUpdate: this.handleScroll,
              autoHide: this.props.autoHide,
              hideTracksWhenNotNeeded: true
            }, props),
            _react2.default.createElement(WrappedComponent, this.props)
          ),
          _react2.default.createElement('div', {
            ref: 'shadowTop',
            style: shadowTopStyle
          }),
          _react2.default.createElement('div', {
            ref: 'shadowBottom',
            style: shadowBottomStyle
          })
        );
      }
    }]);

    return WithScrollShadow;
  }(_react2.default.Component);

  WithScrollShadow.defaultProps = {
    height: 400,
    autoHide: true
  };

  return WithScrollShadow;
};