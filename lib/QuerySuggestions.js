'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RE_ESCAPE = _olasearch.Settings.RE_ESCAPE;
var createHTMLMarkup = _olasearch.utilities.createHTMLMarkup;

var QuerySuggestions = function QuerySuggestions(_ref) {
  var suggestions = _ref.suggestions,
      onChange = _ref.onChange,
      activeIndex = _ref.activeIndex,
      queryTerm = _ref.queryTerm;

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
};

var QuerySuggestionItem = function QuerySuggestionItem(_ref2) {
  var queryTerm = _ref2.queryTerm,
      term = _ref2.term,
      onChange = _ref2.onChange,
      isActive = _ref2.isActive;

  function handleChange() {
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
};

module.exports = QuerySuggestions;