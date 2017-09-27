import React from 'react'
import { Settings, utilities } from 'olasearch'

const { RE_ESCAPE } = Settings
const { createHTMLMarkup } = utilities
const QuerySuggestions = ({ suggestions, onChange, activeIndex, queryTerm }) => {
  return (
    <div className='olachat-query-suggestions'>
      {suggestions.map((item, idx) => {
        return (
          <QuerySuggestionItem
            key={idx}
            onChange={onChange}
            term={item.term}
            isActive={idx === activeIndex}
            queryTerm={queryTerm}
          />
        )
      })}
    </div>
  )
}

const QuerySuggestionItem = ({ queryTerm, term, onChange, isActive }) => {
  if (!queryTerm) return null
  function handleChange () {
    onChange && onChange(term)
  }
  let pattern = '(^' + queryTerm.replace(RE_ESCAPE, '\\$1').split(/\s/).join('|') + ')'
  /* Create term */
  let value = term.replace(new RegExp(pattern, 'gi'), '<strong>$1</strong>')
  let klass = 'olachat-query-suggestion' + (isActive ? ' is-active' : '')
  return (
    <button
      type='button'
      className={klass}
      onClick={handleChange}
      dangerouslySetInnerHTML={createHTMLMarkup(value)}
    />
  )
}

module.exports = QuerySuggestions
