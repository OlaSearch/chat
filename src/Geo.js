import React, { Component } from 'react'
import { GeoLocation } from '@olasearch/core'
import Navigation from '@olasearch/icons/lib/navigation'

class Geo extends Component {
  onGeoSuccess = data => {
    if (!data) return
    this.props.onSubmit({ intent: this.props.message.intent })
  }
  onIgnoreGeo = data => {
    // this.props.onSubmit({ intent: this.props.message.intent, label: 'Ignore' })
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
            icon={<Navigation size={16} />}
            className='ola-icon-btn'
            disabled={!isActive}
          />
        </div>
      )
    }
    return null
  }
}

export default Geo
