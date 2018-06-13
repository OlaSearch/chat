import React from 'react'
import { SnippetActions, Fields } from '@olasearch/core'
import ShareIcon from '@olasearch/icons/lib/share'

const { BookmarkButton } = SnippetActions
const { Share } = Fields

function MessageActions ({ size, ...props }) {
  return (
    <div className='ola-message-actions'>
      <BookmarkButton {...props} buttonClassName='ola-btn' buttonSize={size} />
      <Share
        {...props}
        label={<ShareIcon size={size} />}
        buttonClassName='ola-btn'
      />
    </div>
  )
}

MessageActions.defaultProps = {
  size: 20
}

export default MessageActions
