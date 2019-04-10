import tail from "lodash/tail"
import head from "lodash/head"
import HappyFace from "./HappyFace"
import sampleAnalyzer from "./sampleAnalyzer"
import TimeIndicator from "./TimeIndicator"

const canvas = document.querySelector("#sketch")
const canvasAttrs = canvas.getBoundingClientRect()
const height = canvasAttrs.height
const width = canvasAttrs.width

function sketch(p) {
  // An appoximate guess of the bpm of the sample
  const bpm = 120
  let set, fft
  // will hold our guesses at the beats
  let beats = []
  // Our analysis of the audio sample
  let sample = {}
  // Things being rendered on screen
  let entities = []
  // Count the number of beats
  let beatNumber = 0

  // Load a sample
  p.preload = function() {
    p.soundFormats("mp3", "m4a")
    set = p.loadSound(
      // load a random sample
      (arr => arr[Math.floor(Math.random() * arr.length)])([
        "sample.m4a",
        "sample4.m4a",
        "sample3.m4a"
      ]),
      a => console.log("File loaded", a)
    )
  }

  p.setup = function() {
    p.createCanvas(width, height)
    p.background(0)
    p.frameRate(60)
    // Create a fast fourier transform to use to make an equalizer
    fft = new p5.FFT(0.9, 16)
    // Enable a time indicator
    entities.push(new TimeIndicator({ p }))
  }

  p.draw = function() {
    p.background(0)
    // make some numbers
    const currentTime = p.millis()
    const setTime = set.currentTime()
    const currentBeat = head(beats)
    const beatDiff = currentTime - currentBeat
    const spectrum = fft.analyze()

    if (sample.peaks) {
      // When a peak passes, create some beats and remove the peak
      if (sample.modes.members[0] < setTime * 1000) {
        beats = Array(40)
          .fill("")
          .map((el, i) => sample.modes.members[0] + (i + 1) * sample.modes.diff)
        sample.modes.members = tail(sample.modes.members)
      }
      // remove a beat everytime it passes
      if (beats[0] < setTime * 1000) {
        beats = tail(beats)
        beatNumber++
      }
    }

    // update the entities
    entities = entities
      .filter(entity => entity.value.exists)
      .map((entity, i, arr) =>
        entity.update({
          setTime,
          currentTime,
          beatNumber,
          currentBeat,
          beatDiff,
          spectrum,
          arr,
          set,
          sample,
          beats
        })
      )

    // // rendering
    entities.forEach(entity => entity.render(p))
    p.stroke(255)
    p.ellipse(p.width / 2, p.height / 2, (beats[0] - setTime * 1000) / 10)
  }
  p.mousePressed = function() {
    if (sample.modes) {
      return
    }
    const queue = [
      {
        value: () =>
          HappyFace.of({
            time: p.millis(),
            p
          }),
        time: 100
      }
    ]

    // queue.forEach(f => {
    //   setTimeout(() => {
    //     entities = [f.value(), ...entities]
    //   }, f.time)
    // })

    sampleAnalyzer(set, bpm).then(r => {
      console.log(r)
      sample = r
    })
    set.play()
  }
}

const p5Canvas = new p5(sketch, canvas)

window.p5Canvas = p5Canvas
