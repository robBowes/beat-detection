import Entity from "./Entity"

export default class HappyFace extends Entity {
  constructor(params) {
    super(params)
  }

  getColorDark(state) {
    return state !== 2 ? 0 : 255
  }
  getColorLight(state) {
    return state !== 2 ? 255 : 0
  }
  render(p) {
    const s = this.spectrum[4]
    const t = this.currentTime / 1000
    const xoff = () => (p.noise(t) - 0.5) * p.width
    const yoff = () => (p.noise(t + 1) - 0.5) * p.height
    const location =
      this.state === 1 ? { x: xoff(), y: yoff() } : { x: 0, y: 0 }
    const light = this.getColorLight(this.state)
    const dark = this.getColorDark(this.state)
    p.push()
    p.translate(this.center.x + location.x, this.center.y + location.y)
    //Head
    p.stroke(light)
    p.fill(light)
    p.ellipse(0, 0, Math.min(s, 250))
    // Eyes
    p.stroke(dark)
    p.fill(dark)
    p.ellipse(-s / 6, -s / 8, s / 6)
    p.ellipse(s / 6, -s / 8, s / 6)
    // Mouth
    p.noFill()
    p.stroke(dark)
    p.curve(-s / 6, s / 8, -s / 6, s / 6, s / 6, s / 6, s / 6, s / 8)
    p.pop()
  }
}
