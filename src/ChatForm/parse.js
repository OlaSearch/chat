'use strict'

const ParseForm = form => {
  const isValidElement = element => {
    return element.name
  }
  const isCheckbox = element => element.type === 'checkbox'
  const isRadio = element => element.type === 'radio'
  const isMultiSelect = element => element.options && element.multiple
  const getSelectValues = options =>
    [].reduce.call(
      options,
      (values, option) => {
        return option.selected ? values.concat(option.value) : values
      },
      []
    )
  const getOptions = element => {
    return Array.prototype.slice
      .call(document.querySelectorAll(`[name="${element.name}"]`))
      .map(el => el.value)
  }
  const getLabel = element => {
    return ''
  }
  const formToJSON = elements =>
    [].reduce.call(
      elements,
      (data, element) => {
        if (isValidElement(element)) {
          var { name, type, labels } = element
          var text = labels.length ? labels[0].innerText : getLabel(element)
          if (isCheckbox(element) || isRadio(element)) {
            let exists = data.some(({ name: _name }) => name === _name)
            if (!exists) {
              data.push({ name, type, text, options: getOptions(element) })
            }
          } else {
            data.push({ name, type, text })
          }
        }
        return data
      },
      []
    )

  const elements = document.querySelectorAll('[name]')

  return formToJSON(elements)
}

module.exports = ParseForm
