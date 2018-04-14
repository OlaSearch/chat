import React from 'react'
import { Settings } from '@olasearch/core'

const { BUTTON_TYPE } = Settings

export default function Button (props) {
  const { title, onClick, className, children } = props
  function handleClick () {
    const { type, label, title, payload, url } = props
    /**
     * Label will be displayed in the bot
     */
    if (type === BUTTON_TYPE.POSTBACK) {
      return (
        onClick &&
        onClick({
          ...payload,
          label,
          query: label || title
        })
      )
    }
    if (type === BUTTON_TYPE.WEB) {
      return (window.location.href = url)
    }
    if (type === BUTTON_TYPE.EMAIL) {
      return (window.location.href = `mailto:${url}`)
    }
    onClick && onClick({ card })
  }
  return (
    <button className={className} type='button' onClick={handleClick}>
      {children || title}
    </button>
  )
}
