'use strict';

var _core = require('@olasearch/core');

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debounceNotify = _core.utilities.debounce(notify, 300);

function notify(_ref) {
  var body = _ref.body,
      title = _ref.title;

  if (window.Notification && Notification.permission !== 'denied' && !document.hasFocus()) {
    Notification.requestPermission(function (status) {
      var n = new Notification(title, {
        body: body,
        icon: 'https://cdn.olasearch.com/assets/images/ola-icon-150x150.png'
      });
      n.onclick = function () {
        window.focus();
      };
    });
  }
}
module.exports = function (_ref2) {
  var name = _ref2.name;

  return function (_ref3) {
    var dispatch = _ref3.dispatch,
        getState = _ref3.getState;
    return function (next) {
      return function (action) {
        if (action.type === _ActionTypes2.default.REQUEST_BOT_SUCCESS) {
          if (!action.answer) return next(action);
          var _action$answer = action.answer,
              reply = _action$answer.reply_voice,
              search = _action$answer.search;

          if (!reply && search && search.title) reply = search.title;
          if (reply) debounceNotify({ body: reply, title: name });
        }
        return next(action);
      };
    };
  };
};