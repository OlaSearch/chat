import invariant from 'invariant'

const PING_SOUND_URL = 'https://cdn.olasearch.com/assets/audio/tap.mp3'

const audio = new Audio()
audio.crossOrigin = true

/**
 * Play the audio track based on the audio url and configuration supplied
 * @param {String} audioPath | url of the audio track
 * @param {Object} config | audio playback configurations
 */
export const playAudio = (audioPath, config = {}) => {
  invariant(audioPath, 'Please specify the path of the audio track to play')

  /* do not play the audio */
  if (config.disabled) {
    return
  }

  audio.src = audioPath
  audio.play()
}

/**
 * Play the ping sound
 */
export const playPing = config => playAudio(PING_SOUND_URL, config)
