'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = Card;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CardList = require('./CardList');

var _CardList2 = _interopRequireDefault(_CardList);

var _AnswerWordMap = require('@olasearch/core/lib/components/Answer/AnswerWordMap');

var _AnswerWordMap2 = _interopRequireDefault(_AnswerWordMap);

var _AnswerMap = require('@olasearch/core/lib/components/Answer/AnswerMap');

var _AnswerMap2 = _interopRequireDefault(_AnswerMap);

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AnswerChart from 'olasearch/lib/components/Answer/AnswerChart'

function Card(_ref) {
  var card = _ref.card,
      location = _ref.location,
      templates = _ref.templates,
      results = _ref.results;

  if (!card || !card.title) return null;
  var _card$buttons = card.buttons,
      buttons = _card$buttons === undefined ? [] : _card$buttons,
      template = card.template;

  var klass = (0, _classnames2.default)('ola-card', 'ola-card-template-' + template);
  function pickTemplate(template) {
    /* Check for user defined templates */
    if (templates && templates.hasOwnProperty(template)) {
      var Component = templates[template];
      return _react2.default.createElement(Component, card);
    }

    switch (template) {
      case 'list':
        return _react2.default.createElement(_CardList2.default, card);

      case 'wordmap':
        return _react2.default.createElement(_AnswerWordMap2.default, { data: card.elements, maxLen: 20, shuffle: true });

      case 'image':
        return _react2.default.createElement(
          'div',
          { className: 'ola-card-inner' },
          _react2.default.createElement(_core.Fields.Title, {
            result: card,
            field: 'title',
            openInNewWindow: true,
            eventLabel: card['title'],
            eventCategory: 'card'
          }),
          _react2.default.createElement(_core.Fields.Thumbnail, { thumbnail: card.image_url }),
          _react2.default.createElement(_core.Fields.TextField, { field: 'subtitle', result: card }),
          buttons.map(function (button, idx) {
            return _react2.default.createElement(_core.Fields.Button, _extends({}, button, {
              result: card,
              eventLabel: card['title'],
              key: idx,
              openInNewWindow: true,
              eventCategory: 'card'
            }));
          })
        );

      case 'map':
        return _react2.default.createElement(_AnswerMap2.default, { data: card, results: results, location: location });

      default:
        return _react2.default.createElement(
          'div',
          { className: 'ola-card-inner' },
          _react2.default.createElement(_core.Fields.Title, {
            result: card,
            field: 'title',
            openInNewWindow: true,
            eventLabel: card['title'],
            eventCategory: 'card'
          }),
          _react2.default.createElement(_core.Fields.TextField, { field: 'subtitle', result: card }),
          buttons.map(function (button, idx) {
            return _react2.default.createElement(_core.Fields.Button, _extends({}, button, {
              result: card,
              eventLabel: card['title'],
              key: idx,
              openInNewWindow: true,
              eventCategory: 'card'
            }));
          })
        );
    }
  }

  return _react2.default.createElement(
    'div',
    { className: klass },
    pickTemplate(template)
  );
}