import React from 'react'
import cx from 'classnames'

export default function Badge ({ count, inline }) {
  const classes = cx('ola-badge', {
    'ola-badge-inline': inline
  })
  return (
    <span className={classes} key={count}>
      {count}
    </span>
  )
}
