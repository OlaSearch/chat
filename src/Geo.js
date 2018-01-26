import React, { Component } from 'react'
import { GeoLocation } from '@olasearch/core'
import Navigation from '@olasearch/icons/lib/navigation'

export default class Geo extends Component {
  onGeoSuccess = data => {
    if (!data) return
    this.props.onSubmit({ intent: this.props.message.intent })
  }
  onIgnoreGeo = data => {
    this.props.onSubmit({ intent: this.props.message.intent })
  }
  render () {
    let { isActive } = this.props
    /**
     * If message requires location and isActive
     */
    if (this.props.needsLocation) {
      return (
        <div>
          <GeoLocation
            onSuccess={this.onGeoSuccess}
            icon={<Navigation />}
            className='ola-icon-btn'
            disabled={!isActive}
          />
          <button disabled={!isActive} onClick={this.onIgnoreGeo} className='ola-cancel-btn'>Ignore</button>
        </div>
      )
    }
    return null
  }
}

