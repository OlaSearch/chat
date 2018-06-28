import invariant from 'invariant'

const audio = new Audio()
audio.crossOrigin = true

/**
 * Play the audio track based on the audio url
 * @param {String} audioPath | url of the audio track
 */
export function playAudio (audioPath) {
  invariant(audioPath, 'Please specify the path of the audio track to play')

  audio.src = audioPath
  audio.play()
}
