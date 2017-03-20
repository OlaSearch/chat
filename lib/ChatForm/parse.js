'use strict';

var ParseForm = function ParseForm(form) {
  var isValidElement = function isValidElement(element) {
    return element.name;
  };
  var isCheckbox = function isCheckbox(element) {
    return element.type === 'checkbox';
  };
  var isRadio = function isRadio(element) {
    return element.type === 'radio';
  };
  var isMultiSelect = function isMultiSelect(element) {
    return element.options && element.multiple;
  };
  var getSelectValues = function getSelectValues(options) {
    return [].reduce.call(options, function (values, option) {
      return option.selected ? values.concat(option.value) : values;
    }, []);
  };
  var getOptions = function getOptions(element) {
    return Array.prototype.slice.call(document.querySelectorAll('[name="' + element.name + '"]')).map(function (el) {
      return el.value;
    });
  };
  var getLabel = function getLabel(element) {
    return '';
  };
  var formToJSON = function formToJSON(elements) {
    return [].reduce.call(elements, function (data, element) {
      if (isValidElement(element)) {
        var name = element.name,
            type = element.type,
            labels = element.labels;

        var text = labels.length ? labels[0].innerText : getLabel(element);
        if (isCheckbox(element) || isRadio(element)) {
          var exists = data.some(function (_ref) {
            var _name = _ref.name;
            return name === _name;
          });
          if (!exists) {
            data.push({ name: name, type: type, text: text, options: getOptions(element) });
          }
        } else {
          data.push({ name: name, type: type, text: text });
        }
      }
      return data;
    }, []);
  };

  var elements = document.querySelectorAll('[name]');

  return formToJSON(elements);
};

module.exports = ParseForm;