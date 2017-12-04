'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RE_ESCAPE = _olasearch.Settings.RE_ESCAPE;
var createHTMLMarkup = _olasearch.utilities.createHTMLMarkup;

var QuerySuggestions = function (_React$Component) {
  _inherits(QuerySuggestions, _React$Component);

  function QuerySuggestions() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, QuerySuggestions);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = QuerySuggestions.__proto__ || Object.getPrototypeOf(QuerySuggestions)).call.apply(_ref, [this].concat(args))), _this), _this.registerRef = function (el) {
      _this.el = el;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(QuerySuggestions, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      /* Add click listener */
      this.el.addEventListener('click', function (e) {
        e.preventDefault();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          suggestions = _props.suggestions,
          onChange = _props.onChange,
          activeIndex = _props.activeIndex,
          queryTerm = _props.queryTerm;

      return _react2.default.createElement(
        'div',
        { className: 'olachat-query-suggestions', ref: this.registerRef },
        suggestions.map(function (item, idx) {
          return _react2.default.createElement(QuerySuggestionItem, {
            key: idx,
            onChange: onChange,
            term: item.term,
            isActive: idx === activeIndex,
            queryTerm: queryTerm
          });
        })
      );
    }
  }]);

  return QuerySuggestions;
}(_react2.default.Component);

function QuerySuggestionItem(_ref2) {
  var queryTerm = _ref2.queryTerm,
      term = _ref2.term,
      onChange = _ref2.onChange,
      isActive = _ref2.isActive;

  function handleChange(e) {
    onChange && onChange(term);
  }
  var pattern = '(^' + queryTerm.replace(RE_ESCAPE, '\\$1').split(/\s/).join('|') + ')';
  /* Create term */
  var value = term.replace(new RegExp(pattern, 'gi'), '<strong>$1</strong>');
  var klass = 'olachat-query-suggestion' + (isActive ? ' is-active' : '');
  return _react2.default.createElement('button', {
    type: 'button',
    className: klass,
    onClick: handleChange,
    dangerouslySetInnerHTML: createHTMLMarkup(value)
  });
}

module.exports = QuerySuggestions;