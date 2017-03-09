'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _siriwavejs = require('siriwavejs');

var _siriwavejs2 = _interopRequireDefault(_siriwavejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wave = function (_React$Component) {
  _inherits(Wave, _React$Component);

  function Wave() {
    _classCallCheck(this, Wave);

    return _possibleConstructorReturn(this, (Wave.__proto__ || Object.getPrototypeOf(Wave)).apply(this, arguments));
  }

  _createClass(Wave, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      /* Siri wave */
      this.wave = new _siriwavejs2.default({
        container: this.waveEl,
        width: Math.min(300, this.waveEl.offsetWidth),
        height: 15,
        // amplitudeInterpolationSpeed: 1,
        frequency: 20,
        speed: 0.1,
        // style: 'ios9',
        speedInterpolationSpeed: 0.01
      });

      this.wave.start();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.isLoading !== this.props.isLoading) {
        // this.wave.setAmplitude(100)
        // this.wave.setAmplitude(100)
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('div', { ref: function ref(_ref) {
          return _this2.waveEl = _ref;
        } });
    }
  }]);

  return Wave;
}(_react2.default.Component);

exports.default = Wave;