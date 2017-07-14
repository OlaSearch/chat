'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CardList = require('./CardList');

var _CardList2 = _interopRequireDefault(_CardList);

var _CardButton = require('./CardButton');

var _CardButton2 = _interopRequireDefault(_CardButton);

var _AnswerWordMap = require('olasearch/lib/components/Answer/AnswerWordMap');

var _AnswerWordMap2 = _interopRequireDefault(_AnswerWordMap);

var _AnswerMap = require('olasearch/lib/components/Answer/AnswerMap');

var _AnswerMap2 = _interopRequireDefault(_AnswerMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AnswerChart from 'olasearch/lib/components/Answer/AnswerChart'

var Card = function Card(_ref) {
  var card = _ref.card,
      templates = _ref.templates;

  if (!card) return null;
  var title = card.title,
      url = card.url,
      buttons = card.buttons,
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
        return _react2.default.createElement(_AnswerWordMap2.default, {
          data: card.elements,
          maxLen: 20,
          shuffle: true
        });

      case 'map':
        return _react2.default.createElement(_AnswerMap2.default, {
          data: card.elements
        });
      // case 'line_chart':
      //   return (
      //     <AnswerChart
      //       data={card}
      //     />
      //   )

      default:
        return _react2.default.createElement(
          'div',
          { className: 'ola-card-inner' },
          _react2.default.createElement(
            'h3',
            { className: 'ola-card-title' },
            _react2.default.createElement(
              'a',
              { target: '_blank', href: url },
              title
            )
          ),
          buttons.map(function (button, idx) {
            return _react2.default.createElement(_CardButton2.default, _extends({}, button, { key: idx }));
          })
        );
    }
  }

  return _react2.default.createElement(
    'div',
    { className: klass },
    pickTemplate(template)
  );
};

module.exports = Card;