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

var _olasearch = require('olasearch');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchResultsMessage = function (_React$Component) {
  _inherits(SearchResultsMessage, _React$Component);

  function SearchResultsMessage(props) {
    _classCallCheck(this, SearchResultsMessage);

    var _this = _possibleConstructorReturn(this, (SearchResultsMessage.__proto__ || Object.getPrototypeOf(SearchResultsMessage)).call(this, props));

    _this.toggleActive = function () {
      _this.setState({
        isActive: !_this.state.isActive
      });
    };

    _this.onLoadMore = function () {
      _this.props.loadMore(_this.props.message);
    };

    _this.state = {
      isActive: false
    };
    return _this;
  }

  _createClass(SearchResultsMessage, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          AppState = _props.AppState,
          QueryState = _props.QueryState,
          Device = _props.Device,
          dispatch = _props.dispatch,
          isActive = _props.isActive,
          message = _props.message,
          results = _props.results;
      var bookmarks = AppState.bookmarks,
          totalResults = AppState.totalResults,
          isLoading = AppState.isLoading;
      var search = message.search;
      var isPhone = Device.isPhone;

      var maxResults = isPhone ? 1 : 3;
      /* If there is no search */

      if (!results.length && !search) return null;

      var title = search.title,
          noResultsText = search.no_result;

      /* If no results */

      if (!results.length && search) {
        return _react2.default.createElement(
          'div',
          {
            className: 'olachat-message-reply'
          },
          noResultsText
        );
      }

      var isStacked = !isActive && !this.state.isActive;
      if (isStacked) {
        results = results.filter(function (item, idx) {
          return idx < maxResults;
        });
      }

      var page = QueryState.page,
          perPage = QueryState.per_page;

      var klass = (0, _classnames2.default)('olachat-results', {
        'olachat-results-stack': isStacked
      });
      return _react2.default.createElement(
        'div',
        { className: klass },
        _react2.default.createElement(
          'p',
          null,
          title
        ),
        _react2.default.createElement(
          'div',
          { className: 'olachat-results-wrapper' },
          _react2.default.createElement('div', { className: 'olachat-results-overlay' }),
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: this.toggleActive, className: 'olachat-results-seeall' },
            'See all'
          ),
          _react2.default.createElement(_olasearch.SearchResults, {
            results: results,
            bookmarks: bookmarks,
            dispatch: dispatch
          }),
          isActive ? _react2.default.createElement(_olasearch.SearchFooter, {
            totalResults: totalResults,
            currentPage: page,
            perPage: perPage,
            dispatch: dispatch,
            isPhone: isPhone,
            isLoading: isLoading,
            onLoadMore: this.onLoadMore
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


function mapStateToProps(state) {
  return {
    AppState: state.AppState,
    QueryState: state.QueryState,
    Device: state.Device
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, { loadMore: _actions.loadMore })(SearchResultsMessage);