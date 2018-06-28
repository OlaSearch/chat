import React from 'react'
import { BookmarksContainer, Decorators, Arrow } from '@olasearch/core'
import listensToClickOutside from '@olasearch/react-onclickoutside'
import { createMessageMarkup } from './utils'
import Close from '@olasearch/icons/lib/x'
import BookMark from '@olasearch/icons/lib/bookmark'
import MessageActions from './MessageActions'

/**
 * Display bookmarks
 * Has a custom render function
 */
class Bookmarks extends React.Component {
  handleClickOutside = () => {
    this.props.hide()
  }
  render () {
    const { toggle, isCollapsed } = this.props
    return (
      <div className='olachat-bookmarks'>
        <button onClick={toggle} className='olachat-bookmarks-action'>
          <BookMark />
        </button>
        {isCollapsed ? (
          <BookmarksContainer render={BookmarkRender} toggle={toggle} />
        ) : null}
      </div>
    )
  }
}

/**
 * Bookmarks renderer
 */
function BookmarkRender ({ bookmarks, toggle }) {
  const hasBookmarks = bookmarks.length
  return (
    <div className='olachat-bookmarks-panel'>
      <Arrow position='bottom-right' />
      <div className='olachat-bookmarks-header'>
        Pinned items
        <button onClick={toggle} className='ola-btn ola-btn-close'>
          <Close />
        </button>
      </div>
      <div className='olachat-bookmarks-body'>
        {hasBookmarks ? (
          bookmarks.map(item => {
            const { id, sequence } = item
            return (
              <div key={id} className='olachat-bookmarks-item'>
                {sequence &&
                  sequence.message.map(({ content }, idx) => (
                    <div
                      key={idx}
                      dangerouslySetInnerHTML={createMessageMarkup(content)}
                    />
                  ))}
                <MessageActions result={item} position='bottom-right' />
              </div>
            )
          })
        ) : (
          <div className='olachat-bookmarks-item'>
            You do not have any pinned items
          </div>
        )}
      </div>
    </div>
  )
}

export default Decorators.withToggle(listensToClickOutside(Bookmarks))
