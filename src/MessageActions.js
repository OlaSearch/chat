import React from 'react'
import { SnippetActions, Fields } from '@olasearch/core'
import { withDocument } from '@olasearch/react-frame-portal'
import ShareIcon from '@olasearch/icons/lib/share'

const { Bookmark } = SnippetActions
const { Share } = Fields

function MessageActions ({ size, ...props }) {
  return (
    <div className='ola-message-actions'>
      <Bookmark {...props} buttonClassName='ola-btn' buttonSize={size} />
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

export default withDocument(MessageActions)
