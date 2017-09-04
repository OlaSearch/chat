'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntentSuggestion = function (_React$Component) {
  _inherits(IntentSuggestion, _React$Component);

  function IntentSuggestion() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, IntentSuggestion);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = IntentSuggestion.__proto__ || Object.getPrototypeOf(IntentSuggestion)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (label) {
      _this.props.updateQueryTerm(label);
      _this.props.onSubmit();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(IntentSuggestion, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var suggestions = this.props.suggestions;

      if (!suggestions.length) return null;
      return _react2.default.createElement(
        'div',
        { className: 'olachat-intentSuggestion' },
        _react2.default.createElement(
          'div',
          { className: 'olachat-intentSuggestionText' },
          'Did you mean'
        ),
        _react2.default.createElement(
          'div',
          { className: 'olachat-intentSuggestionList' },
          suggestions.map(function (item, idx) {
            return _react2.default.createElement(
              'a',
              { className: 'olachat-intentSuggestionListItem', key: idx, onClick: function onClick() {
                  return _this2.handleClick(item);
                } },
              item
            );
          })
        )
      );
    }
  }]);

  return IntentSuggestion;
}(_react2.default.Component);

IntentSuggestion.defaultProps = {
  suggestions: []
};
exports.default = (0, _reactRedux.connect)(null, { updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm })(IntentSuggestion);