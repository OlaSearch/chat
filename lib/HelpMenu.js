'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _style = require('@olasearch/styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactOnclickoutside = require('@olasearch/react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _core = require('@olasearch/core');

var _Settings = require('./Settings');

var _menu = require('@olasearch/icons/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

var _printer = require('@olasearch/icons/lib/printer');

var _printer2 = _interopRequireDefault(_printer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HelpMenu = function (_React$Component) {
  _inherits(HelpMenu, _React$Component);

  function HelpMenu(props) {
    _classCallCheck(this, HelpMenu);

    var _this = _possibleConstructorReturn(this, (HelpMenu.__proto__ || Object.getPrototypeOf(HelpMenu)).call(this, props));

    _this.handleClick = function (event) {
      if (event.target.href && event.target.href !== '') {
        return _this.props.log({
          eventType: 'C',
          eventCategory: 'menu',
          eventLabel: event.target.text,
          result: { title: event.target.text },
          payload: { bot: true }
        });
      }
      event.preventDefault();
      _this.handleClickOutside();
      _this.props.updateQueryTerm(event.target.text);
      _this.props.onSubmit();
    };

    _this.handlePrint = function () {
      if (_this.context.window) {
        _this.context.window.print();
      } else {
        window.print();
      }
    };

    _this.handleClickOutside = function () {
      _this.props.hide();
    };

    return _this;
  }

  _createClass(HelpMenu, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.theme !== this.props.theme || nextProps.isCollapsed !== this.props.isCollapsed;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var klass = (0, _classnames2.default)('olachat-helpmenu', {
        'olachat-helpmenu-open': this.props.isCollapsed
      });
      var _props = this.props,
          translate = _props.translate,
          config = _props.config;
      var _config$botLinks = config.botLinks,
          botLinks = _config$botLinks === undefined ? [] : _config$botLinks;

      return _react2.default.createElement(
        'div',
        {
          className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + (klass || '')
        },
        _react2.default.createElement(
          'button',
          {
            onClick: this.props.toggleDisplay,
            type: 'button',
            className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + 'olachat-helpmenu-button'
          },
          _react2.default.createElement(_menu2.default, null)
        ),
        _react2.default.createElement(
          'div',
          {
            className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + 'olachat-dp'
          },
          _react2.default.createElement(
            'div',
            {
              className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + 'olachat-dp-title'
            },
            translate('chat_menu')
          ),
          _react2.default.createElement(
            'div',
            {
              className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + 'olachat-dp-body'
            },
            botLinks.map(function (_ref, idx) {
              var title = _ref.title,
                  url = _ref.url;

              return _react2.default.createElement(
                'a',
                {
                  href: url || null,
                  key: idx,
                  target: '_blank',
                  onClick: _this2.handleClick,
                  className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + 'olachat-menu-link'
                },
                title
              );
            }),
            _react2.default.createElement(
              'a',
              { onClick: this.handlePrint, className: _style2.default.dynamic([['277703968', [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]]]) + ' ' + 'olachat-menu-link'
              },
              _react2.default.createElement(_printer2.default, null),
              ' ',
              translate('chat_print')
            )
          )
        ),
        _react2.default.createElement(_style2.default, {
          styleId: '277703968',
          css: '.olachat-dp.__jsx-style-dynamic-selector{font-size:' + _this2.props.theme.mediumFontSize + ';}.olachat-helpmenu-button.__jsx-style-dynamic-selector{color:' + _this2.props.theme.primaryColor + ';}.olachat-menu-link.__jsx-style-dynamic-selector,.olachat-menu-link.__jsx-style-dynamic-selector:hover,.olachat-menu-link.__jsx-style-dynamic-selector:focus,.olachat-menu-link.__jsx-style-dynamic-selector:active{color:' + _this2.props.theme.primaryColor + ';}.olachat-menu-link.__jsx-style-dynamic-selector:hover{background-color:#f5f5f5;}',
          dynamic: [_this2.props.theme.mediumFontSize, _this2.props.theme.primaryColor, _this2.props.theme.primaryColor]
        })
      );
    }
  }]);

  return HelpMenu;
}(_react2.default.Component);

HelpMenu.contextTypes = {
  document: _propTypes2.default.object,
  window: _propTypes2.default.object
};


var HelpMenuContainer = (0, _reactOnclickoutside2.default)(HelpMenu, {
  getDocument: function getDocument(instance) {
    return instance.context.document || document;
  }
});
var HelpMenuWrapper = function HelpMenuWrapper(props) {
  return _react2.default.createElement(HelpMenuContainer, props);
};

exports.default = _core.Decorators.withToggle(_core.Decorators.withConfig(_core.Decorators.withTranslate(_core.Decorators.withLogger(HelpMenuWrapper))));