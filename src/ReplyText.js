import React from 'react'
import cx from 'classnames'
import { createMessageMarkup } from './utils'

export default function ReplyText ({ text }) {
  if (!text) return null
  return (
    <React.Fragment>
      {Array.isArray(text) ? (
        text.map((item, idx) => (
          <div key={idx} className='olachat-message-reply-multiple'>
            <div
              className='olachat-message-reply'
              dangerouslySetInnerHTML={createMessageMarkup(item)}
            />
          </div>
        ))
      ) : (
        <div
          className='olachat-message-reply'
          dangerouslySetInnerHTML={createMessageMarkup(text)}
        />
      )}
    </React.Fragment>
  )
}
