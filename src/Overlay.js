import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'

export default function Overlay ({ active, onDismiss }) {
  const classes = cx('olachat-bot-overlay', {
    'olachat-bot-overlay-active': active
  })
  return <div className={classes} onClick={onDismiss} />
}
