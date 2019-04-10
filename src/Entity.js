export default class Entity {
  constructor(params) {
    this.value = params ? {...params, exists: true} : null
    this.center = params.p ? {x: params.p.width/2, y : params.p.height/2} : {x: 0, y: 0}
  }
  update(params) {
    Object.assign(this, params)
    this.state = Math.floor((this.beatNumber % 20) / 5)
    return this
  }
  static of(params) {
    return new this(params)
  }
}