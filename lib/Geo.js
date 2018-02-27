'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _core = require('@olasearch/core');

var _reactRedux = require('react-redux');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geo = function (_Component) {
  _inherits(Geo, _Component);

  function Geo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Geo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Geo.__proto__ || Object.getPrototypeOf(Geo)).call.apply(_ref, [this].concat(args))), _this), _this.onGeoSuccess = function (data) {
      if (!data) return;
      _this.props.onSubmit({
        intent: _this.props.message.intent,
        label: 'Around me',
        query: _this.props.message.message
      });
    }, _this.onIgnoreGeo = function (data) {
      _this.props.ignoreLocation();
      /**
       * Send a empty query
       */
      _this.props.onSubmit({
        intent: _this.props.message.intent,
        label: 'Ignore',
        query: _this.props.message.message
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Geo, [{
    key: 'render',
    value: function render() {
      var isActive = this.props.isActive;
      /**
       * If message requires location and isActive
       */

      if (this.props.needsLocation) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_core.GeoLocation, {
            onSuccess: this.onGeoSuccess,
            disabled: !isActive,
            showLabel: true
          }),
          _react2.default.createElement(
            'button',
            {
              disabled: !isActive,
              onClick: this.onIgnoreGeo,
              className: 'ola-btn'
            },
            'Ignore'
          )
        );
      }
      return null;
    }
  }]);

  return Geo;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(null, { ignoreLocation: _actions.ignoreLocation })(Geo);