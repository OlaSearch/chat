'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RE_ESCAPE = _core.Settings.RE_ESCAPE;
var createHTMLMarkup = _core.utilities.createHTMLMarkup;

function QuerySuggestions(props) {
  var suggestions = props.suggestions,
      onChange = props.onChange,
      activeIndex = props.activeIndex,
      queryTerm = props.queryTerm;

  return _react2.default.createElement(
    'div',
    { className: 'olachat-query-suggestions' },
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

function QuerySuggestionItem(_ref) {
  var queryTerm = _ref.queryTerm,
      term = _ref.term,
      onChange = _ref.onChange,
      isActive = _ref.isActive;

  function handleChange(e) {
    onChange && onChange(term);
  }
  var pattern = '(^' + queryTerm.replace(RE_ESCAPE, '\\$1').split(/\s/).join('|') + ')';
  /* Create term */
  var value = term.replace(new RegExp(pattern, 'gi'), '<strong>$1</strong>');
  var klass = 'olachat-query-suggestion' + (isActive ? ' is-active' : '');
  return _react2.default.createElement(
    'div',
    { className: 'olachat-query-suggestion-item' },
    _react2.default.createElement('button', {
      type: 'button',
      className: klass,
      onClick: handleChange,
      dangerouslySetInnerHTML: createHTMLMarkup(value)
    })
  );
}

exports.default = QuerySuggestions;