import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import {
  Actions,
  AutoComplete,
  SearchResults,
  SearchFooter,
  SearchFilters,
  SelectedFilters,
  Decorators,
  SearchTitle,
  NoResults,
  SpellSuggestion,
  TermSuggestion
} from 'olasearch';

class SearchResultsMessage extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      isActive: false
    }
  }
  static defaultProps = {
    results: []
  };
  toggleActive = () => {
    this.setState({
      isActive: !this.state.isActive
    })
  };
  onChangePage = () => {
    // let { search: { q } } = this.props.message
    // this.props.dispatch(Actions.Search.updateQueryTerm(q, null, false))
    /* Third paramater helps forcePageReset = false */
  };
  render () {
    let { AppState, QueryState, Device, dispatch, isActive, message, results } = this.props
    let { bookmarks, totalResults, isLoading } = AppState
    let { search } = message
    let { isPhone } = Device
    let maxResults = isPhone ? 1 : 3
    /* If there is no search */

    if (!results.length && !search) return null

    let { title, no_result } = search

    /* If no results */
    if (!results.length && search) {
      return (
        <div
          className='olachat-message-reply'
        >{no_result}</div>
      )
    }

    if (!isActive && !this.state.isActive) {
      results = results.filter((item, idx) => idx < maxResults)
    }

    let { page, per_page } = QueryState
    let klass = classNames('olachat-results', {
      'olachat-results-stack': !isActive && !this.state.isActive
    })
    return (
      <div className={klass}>
        <p>{title}</p>
        <div className='olachat-results-wrapper'>
          <div className='olachat-results-overlay' />
          <button type='button' onClick={this.toggleActive} className='olachat-results-seeall'>See all</button>

          <SearchResults
            results={results}
            bookmarks={bookmarks}
            dispatch={dispatch}
          />

          {isActive
            ? <SearchFooter
                totalResults={totalResults}
                currentPage={page}
                perPage={per_page}
                dispatch={dispatch}
                isPhone={isPhone}
                isLoading={isLoading}
                beforeChangePage={this.onChangePage}
              />
            : null
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps( state ){
  return {
    AppState: state.AppState,
    QueryState: state.QueryState,
    Device: state.Device
  }
}

export default connect(mapStateToProps)(SearchResultsMessage)