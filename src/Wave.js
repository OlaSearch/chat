import React from 'react'
import SiriWave from 'siriwavejs'

class Wave extends React.Component {
  componentDidMount() {
    /* Siri wave */
    this.wave = new SiriWave({
      container: this.waveEl,
      width: Math.min(300, this.waveEl.offsetWidth),
      height: 15,
      // amplitudeInterpolationSpeed: 1,
      frequency: 20,
      speed: 0.1,
      // style: 'ios9',
      speedInterpolationSpeed: 0.01
    })

    this.wave.start()
  }
  componentDidUpdate (prevProps) {
    if (prevProps.isLoading !== this.props.isLoading) {
      // this.wave.setAmplitude(100)
      // this.wave.setAmplitude(100)
    }
  }
  render () {
    return <div ref={(ref) => this.waveEl = ref} />
  }
}

export default Wave
