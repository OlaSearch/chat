'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _core = require('@olasearch/core');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_RESULTS_MOBILE = 1;
var MAX_RESULTS_DESKTOP = 3;

var SearchResultsMessage = function (_React$Component) {
  _inherits(SearchResultsMessage, _React$Component);

  function SearchResultsMessage() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SearchResultsMessage);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SearchResultsMessage.__proto__ || Object.getPrototypeOf(SearchResultsMessage)).call.apply(_ref, [this].concat(args))), _this), _this.toggleActive = function () {
      _this.props.toggleSearchVisibility(_this.props.message.id);
    }, _this.onLoadMore = function () {
      _this.props.loadMore(_this.props.message);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SearchResultsMessage, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          isPhone = _props.isPhone,
          dispatch = _props.dispatch,
          isActive = _props.isActive,
          message = _props.message,
          results = _props.results,
          bookmarks = _props.bookmarks,
          isLoading = _props.isLoading,
          translate = _props.translate;
      var search = message.search,
          mc = message.mc,
          showSearch = message.showSearch;

      var maxResults = isPhone ? MAX_RESULTS_MOBILE : MAX_RESULTS_DESKTOP;

      /* When showing CURRRENT message, do not stack */
      var isStacked = false; // isActive ? false : !showSearch

      if (isStacked) {
        results = results.filter(function (item, idx) {
          return idx < maxResults;
        });
      }

      var klass = (0, _classnames2.default)('olachat-results', {
        'olachat-results-stack': isStacked
      });
      return _react2.default.createElement(
        'div',
        { className: klass },
        _react2.default.createElement(
          'div',
          { className: 'olachat-results-wrapper' },
          _react2.default.createElement(_core.SearchResults, {
            results: results,
            bookmarks: bookmarks,
            dispatch: dispatch,
            baseUrl: search && search.baseUrl,
            logPayload: {
              bot: true
            }
          }),
          isActive ? _react2.default.createElement(_core.SearchFooter, {
            totalResults: this.props.totalResults,
            currentPage: this.props.page,
            perPage: this.props.perPage,
            dispatch: dispatch,
            isPhone: isPhone,
            isLoading: this.props.isLoading,
            onLoadMore: this.onLoadMore,
            infiniteScroll: true
          }) : null
        )
      );
    }
  }]);

  return SearchResultsMessage;
}(_react2.default.Component);

SearchResultsMessage.defaultProps = {
  results: []
};


function mapStateToProps(state, ownProps) {
  return {
    bookmarks: state.AppState.bookmarks,
    isPhone: state.Device.isPhone,
    perPage: state.Conversation.perPage,
    isLoading: ownProps.isActive ? state.Conversation.isLoading : false
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, { loadMore: _actions.loadMore, toggleSearchVisibility: _actions.toggleSearchVisibility })(_core.Decorators.withTranslate(SearchResultsMessage));