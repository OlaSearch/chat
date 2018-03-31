import React from 'react'
import cx from 'classnames'
import { createMessageMarkup } from './utils'

export default function ReplyText ({ text }) {
  if (!text) return null
  const isMultiple = Array.isArray(text)
  const len = isMultiple ? text.length : 0
  const classes = cx('olachat-message-reply-multiple', {
    'olachat-message-reply-single': len === 1
  })
  return (
    <React.Fragment>
      {isMultiple ? (
        text.map((item, idx) => (
          <div key={idx} className={classes}>
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
