'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

    _this.toggle = function (event) {
      event.preventDefault();
      event.stopPropagation();
      _this.setState({ isOpen: !_this.state.isOpen });
    };

    _this.handleClick = function (e) {
      if (!event) return;
      if (event.target.href) return;
      e.preventDefault();
      _this.handleClickOutside();
      _this.props.updateQueryTerm(e.target.text);
      _this.props.onSubmit();
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
      var botMenu = this.props.botMenu;

      return _react2.default.createElement(
        'div',
        { className: klass },
        _react2.default.createElement(
          'button',
          { className: 'olachat-helpmenu-button', onClick: this.toggle, type: 'button' },
          _react2.default.createElement(
            'span',
            null,
            'Help'
          )
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
            botMenu.map(function (_ref, idx) {
              var label = _ref.label,
                  url = _ref.url;

              return _react2.default.createElement(
                'a',
                { className: 'olachat-menu-link', href: url, key: idx, target: '_blank', onClick: _this2.handleClick },
                label
              );
            })
          )
        )
      );
    }
  }]);

  return HelpMenu;
}(_react2.default.Component);

var HelpMenuContainer = (0, _reactOnclickoutside2.default)(HelpMenu);
var HelpMenuWrapper = function HelpMenuWrapper(props, _ref2) {
  var botMenu = _ref2.config.botMenu;

  return _react2.default.createElement(HelpMenuContainer, _extends({ botMenu: botMenu }, props));
};
HelpMenuWrapper.contextTypes = {
  config: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func])
};
HelpMenuWrapper.defaultProps = {
  botMenu: [{
    label: 'Help'
  }]
};

module.exports = HelpMenuWrapper;