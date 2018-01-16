'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    _this.handleClickOutside = function (event) {
      _this.setState({
        isOpen: false
      });
    };

    _this.toggleMenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      _this.setState({ isOpen: !_this.state.isOpen });
    };

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
      var iFrame = document.getElementById(_Settings.OLACHAT_IFRAME_ID);
      if (!iFrame) return window.print();
      var innerDoc = iFrame.contentWindow;
      innerDoc.focus();
      innerDoc.print();
    };

    _this.state = {
      isOpen: false
    };
    return _this;
  }

  _createClass(HelpMenu, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var klass = (0, _classnames2.default)('olachat-helpmenu', {
        'olachat-helpmenu-open': this.state.isOpen
      });
      var botLinks = this.props.botLinks;

      return _react2.default.createElement(
        'div',
        { className: klass },
        _react2.default.createElement(
          'button',
          {
            className: 'olachat-helpmenu-button',
            onClick: this.toggleMenu,
            type: 'button'
          },
          _react2.default.createElement(_menu2.default, null)
        ),
        _react2.default.createElement(
          'div',
          { className: 'olachat-dp' },
          _react2.default.createElement(
            'div',
            { className: 'olachat-dp-title' },
            'Menu'
          ),
          _react2.default.createElement(
            'div',
            { className: 'olachat-dp-body' },
            botLinks.map(function (_ref, idx) {
              var title = _ref.title,
                  url = _ref.url;

              return _react2.default.createElement(
                'a',
                {
                  className: 'olachat-menu-link',
                  href: url || null,
                  key: idx,
                  target: '_blank',
                  onClick: _this2.handleClick
                },
                title
              );
            }),
            _react2.default.createElement(
              'a',
              { onClick: this.handlePrint },
              _react2.default.createElement(_printer2.default, null),
              ' Print'
            )
          )
        )
      );
    }
  }]);

  return HelpMenu;
}(_react2.default.Component);

HelpMenu.contextTypes = {
  document: _propTypes2.default.object
};
HelpMenu.defaultProps = {
  botLinks: []
};


var HelpMenuContainer = (0, _reactOnclickoutside2.default)(HelpMenu, {
  getDocument: function getDocument(instance) {
    return instance.context.document || document;
  }
});
var HelpMenuWrapper = function HelpMenuWrapper(props, _ref2) {
  var botLinks = _ref2.config.botLinks;

  return _react2.default.createElement(HelpMenuContainer, _extends({}, props, { botLinks: botLinks }));
};
HelpMenuWrapper.contextTypes = {
  config: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func])
};

module.exports = _core.Decorators.withLogger(HelpMenuWrapper);