import React, { Component } from 'react'
import { GeoLocation } from '@olasearch/core'
import { connect } from 'react-redux'
import { ignoreLocation } from './actions'

class Geo extends Component {
  onGeoSuccess = data => {
    if (!data) return
    this.props.onSubmit({
      intent: this.props.message.intent,
      label: 'Around me',
      query: this.props.message.message
    })
  }
  onIgnoreGeo = data => {
    this.props.ignoreLocation()
    /**
     * Send a empty query
     */
    this.props.onSubmit({
      intent: this.props.message.intent,
      label: 'Ignore',
      query: this.props.message.message
    })
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
            disabled={!isActive}
            showLabel
          />
          <button
            disabled={!isActive}
            onClick={this.onIgnoreGeo}
            className='ola-btn'
          >
            Ignore
          </button>
        </div>
      )
    }
    return null
  }
}

export default connect(null, { ignoreLocation })(Geo)
