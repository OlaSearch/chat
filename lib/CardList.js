'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CardButton = require('./CardButton');

var _CardButton2 = _interopRequireDefault(_CardButton);

var _utils = require('./utils');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardList = function CardList(_ref) {
  var title = _ref.title,
      elements = _ref.elements,
      buttons = _ref.buttons;

  return _react2.default.createElement(
    'div',
    { className: 'ola-card-list' },
    _react2.default.createElement(
      'div',
      { className: 'ola-card-list-title' },
      title
    ),
    _react2.default.createElement(
      'div',
      { className: 'ola-card-list-items' },
      elements.map(function (_ref2, idx) {
        var title = _ref2.title,
            subtitle = _ref2.subtitle,
            defaultAction = _ref2.default_action,
            fields = _ref2.fields;

        return _react2.default.createElement(
          'div',
          { className: 'ola-card-list-item', key: idx },
          _react2.default.createElement(
            'div',
            { className: 'ola-card-list-inner' },
            _react2.default.createElement(
              'h3',
              { className: 'ola-card-title' },
              defaultAction ? _react2.default.createElement(
                'a',
                { target: '_blank', href: defaultAction.url },
                title
              ) : _react2.default.createElement(
                'span',
                null,
                title
              )
            ),
            subtitle ? _react2.default.createElement(
              'div',
              { className: 'ola-card-subtitle' },
              (0, _utils.stripHtml)(subtitle)
            ) : null,
            _react2.default.createElement(
              'div',
              { className: 'ola-answer-keyvalue' },
              fields.map(function (_ref3, idx) {
                var label = _ref3.label,
                    value = _ref3.value;

                var klass = (0, _classnames2.default)('ola-answer-row', 'ola-answer-row-' + label);
                return _react2.default.createElement(
                  'div',
                  { className: klass, key: idx },
                  _react2.default.createElement(
                    'div',
                    { className: 'ola-answer-value' },
                    value
                  )
                );
              })
            ),
            defaultAction ? _react2.default.createElement(
              'div',
              { className: 'ola-card-action' },
              _react2.default.createElement(
                'a',
                { href: defaultAction.url },
                defaultAction.url
              )
            ) : null
          )
        );
      })
    ),
    buttons && buttons.length ? _react2.default.createElement(
      'div',
      { className: 'ola-card-list-buttons' },
      buttons.map(function (button, idx) {
        return _react2.default.createElement(_CardButton2.default, _extends({}, button, { key: idx }));
      })
    ) : null
  );
};

module.exports = CardList;