/** Class creating an echo effect */
class Delay {
  /**
   * Create effect
   * @param {AudioContext} ctx - audio context of app
   * @param {MediaStreamAudioSourceNode} source - audio source (microphone)
   * @property {DelayNode} delayNode - node that delays audio creating desirable effect
   * @property {GainNode} feedbackNode - node used to repeat effect multiple times
   * @property {GainNode} bypassNode - node used to control the volume of delayed sound
   * @property {GainNode} masterNode - node used to collect direct sound from source and delayed from delayNode and send them to audio destination
   */
  constructor(ctx, source, isMute) {
    this.ctx = ctx
    this.source = source

    this.delayNode = this.ctx.createDelay(100)
    this.feedbackNode = this.ctx.createGain()
    this.bypassNode = this.ctx.createGain()
    this.masterNode = this.ctx.createGain()

    this.delayNode.delayTime.value = 0.5
    this.feedbackNode.gain.value = 0.7
    this.bypassNode.gain.value = 0.5

    this.source.connect(this.delayNode)
    this.delayNode.connect(this.feedbackNode)
    this.feedbackNode.connect(this.delayNode)

    this.delayNode.connect(this.bypassNode)
    this.bypassNode.connect(this.masterNode)
    this.source.connect(this.masterNode)

    // !isMute && this.connect()
  }

  /**
   * Get title
   * @return {string} The title of effect
   */
  getTitle = 'delay'

  /**
   * Get time
   * @return {number} The time interval between echoes
   */
  gettime = () => this.delayNode.delayTime.value

  /**
   * Get feedback
   * @return {string} The fading level
   */
  getfeedback = () => this.feedbackNode.gain.value

  /**
   * Get title
   * @return {string} The volume of delayed audio
   */
  getvolume = () => this.bypassNode.gain.value

  /**
   * Get controls. Used to render ui that controls effect properties
   * @return {Object[]} controls Objects that describe controls used to change effect properties
   * @param {string} controls[].type Control input type: 'range', 'number' or other
   * @param {string} controls[].label Control title
   * @param {number} controls[].min Min value of controlled effect propertie
   * @param {number} controls[].max Max value of controlled effect propertie
   * @param {number} controls[].step Interval between allowed values of controlled effect propertie (for input field)
   * @param {number} controls[].default Default value of controlled effect propertie
   * @param {function} controls[].callback Function that updates value of controlled effect propertie
   */
  getControls = [
    {
      type: 'range',
      label: 'time',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.5,
      callback: (evt) => (this.delayNode.delayTime.value = +evt.target.value),
    },
    {
      type: 'range',
      label: 'feedback',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.7,
      callback: (evt) => (this.feedbackNode.gain.value = +evt.target.value),
    },
    {
      type: 'range',
      label: 'volume',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.5,
      callback: (evt) => (this.bypassNode.gain.value = +evt.target.value),
    },
  ]

  /**
   * Connects audio nodes to audio destination, 'unmute'
   */
  connect() {
    this.masterNode.connect(this.ctx.destination)
  }

  /**
   * @returns {GainNode}
   */
  getProcessor() {
    return this.masterNode
  }

  /**
   * Connects audio nodes to audio destination, 'unmute'
   */
  disconnect() {
    try {
      this.masterNode.disconnect(/*this.ctx.destination*/)
    } catch (e) {
      console.log('disconnect() error', e)
    }
  }
}

export default Delay
