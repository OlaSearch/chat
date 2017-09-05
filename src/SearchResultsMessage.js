import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { SearchFooter, SearchResults } from 'olasearch'
import { loadMore } from './actions'

class SearchResultsMessage extends React.Component {
  constructor (props) {
    super(props)
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
  onLoadMore = () => {
    this.props.loadMore(this.props.message)
  };
  render () {
    let { AppState, QueryState, Device, dispatch, isActive, message, results } = this.props
    let { bookmarks, totalResults, isLoading } = AppState
    let { search } = message
    let { isPhone } = Device
    let maxResults = isPhone ? 1 : 3
    /* If there is no search */

    if (!search) return null

    let { title, no_result: noResultsText, base_url: baseUrl } = search

    /* If no results */
    if (!results.length && search) {
      return (
        <div
          className='olachat-message-reply'
        >{noResultsText}</div>
      )
    }

    let isStacked = !isActive && !this.state.isActive
    if (isStacked) {
      results = results.filter((item, idx) => idx < maxResults)
    }

    let { page, per_page: perPage } = QueryState
    let klass = classNames('olachat-results', {
      'olachat-results-stack': isStacked
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
            openInNewWindow
            baseUrl={baseUrl}
          />

          {isActive
            ? <SearchFooter
              totalResults={totalResults}
              currentPage={page}
              perPage={perPage}
              dispatch={dispatch}
              isPhone={isPhone}
              isLoading={isLoading}
              onLoadMore={this.onLoadMore}
              infiniteScroll
              />
            : null
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    AppState: state.AppState,
    QueryState: state.QueryState,
    Device: state.Device
  }
}

export default connect(mapStateToProps, { loadMore })(SearchResultsMessage)
