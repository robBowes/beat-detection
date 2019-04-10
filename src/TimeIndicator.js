import Entity from "./Entity";

export default class TimeIndicator extends Entity {
  constructor(params) {
    super(params)
    this.showBeats = true
  }
  render(p) {
    let y = this.setTime / this.set.buffer.duration
    p.line(y*p.width, p.height/2, y*p.width, p.height/2 + 10)

    if (this.sample.modes && this.showBeats) {
      this.sample.modes.members.forEach((peak, i, arr)=>{
        let y = peak / (this.set.buffer.duration * 1000)
        p.line(y*p.width, p.height/2, y*p.width, p.height/2 + 10)
      })
      this.beats.forEach((peak, i, arr)=>{
        let y = peak / (this.set.buffer.duration * 1000)
        p.line(y*p.width, p.height/2, y*p.width, p.height/2 + 10)
      })
    }
  }
}