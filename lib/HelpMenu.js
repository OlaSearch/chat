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

    _this.toggle = function () {
      return _this.setState({ isOpen: !_this.state.isOpen });
    };

    _this.state = {
      isOpen: false
    };
    return _this;
  }

  _createClass(HelpMenu, [{
    key: 'render',
    value: function render() {
      var klass = (0, _classnames2.default)('olachat-helpmenu', {
        'olachat-helpmenu-open': this.state.isOpen
      });
      var helpItems = this.props.helpItems;

      if (!helpItems || !helpItems.length) return null;
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
            helpItems.map(function (_ref, idx) {
              var label = _ref.label,
                  url = _ref.url;

              return _react2.default.createElement(
                'a',
                { href: url, key: idx },
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
  var helpItems = _ref2.config.helpItems;

  if (helpItems && helpItems.length) return _react2.default.createElement(HelpMenuContainer, _extends({}, props, { helpItems: helpItems }));
  return null;
};
HelpMenuWrapper.contextTypes = {
  config: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func])
};

module.exports = HelpMenuWrapper;