export default function(data, estimatedBPM) {
  return new Promise(function(resolve, reject) {
    const length = data.buffer.length
    const duration = data.buffer.duration
    // Create an offline context for the sample
    const offlineContext = new OfflineAudioContext(
      1,
      length,
      data.buffer.sampleRate
    )
    const source = offlineContext.createBufferSource()
    source.buffer = data.buffer
    // Use a lowpass filter
    const filter = offlineContext.createBiquadFilter()
    filter.type = "lowpass"
    source.connect(filter)
    filter.connect(offlineContext.destination)
    // Render the sample
    source.start(0)
    offlineContext.startRendering()
    // When it's finished rendering analyse the output
    offlineContext.oncomplete = function(e) {
      const filteredBuffer = e.renderedBuffer
      const channelData = filteredBuffer.getChannelData(0)
      // Recursively genereate peaks until you gan an answer the is about the correct number of beats for this sample
      const getPeaks = (channelData, threshold, exit) => {
        if (exit++ > 100) return // prevent infinite loop
        const peaks = getPeaksAtThreshold(channelData, threshold)
        // Only use it if there is about the number of peaks as beats in the sample
        if (peaks.length < duration * estimatedBPM / 60 * 0.9 || peaks.length > duration * estimatedBPM / 60 * 1.1) {
          return getPeaks(channelData, threshold + 0.01)
        } else return peaks
      }
      const allPeaks = getPeaks(channelData, 0, 0)
      const peakDiffs = allPeaks
        .map((e, i, r) => {
          try {
            return { diff: Math.floor(r[i + 1] - e), time: e }
          } catch (error) {
            return { diff: 0, time: e }
          }
        })
      // Gets the most commonly repeated beats and their timestamps
      function mode(numbers) {
        const modes = numbers.reduce((acc, el, i, arr) => {
          if (!acc[el.diff]) {
            acc[el.diff] = {
              count: 0,
              members: [],
              diff: el.diff
            }
          }
          acc[el.diff].count++
          acc[el.diff].members = [...acc[el.diff].members, el.time]
          return acc
        }, {})
        let max = { count: 0 }
        for (const mode in modes) {
          if (modes[mode].count > max.count) {
            max = modes[mode]
          }
        }
        return max
      }
      resolve({
        peaks: allPeaks,
        length: data.buffer.length,
        modes: mode(peakDiffs)
      })
    }
    // Function to identify peaks
    function getPeaksAtThreshold(data, threshold) {
      let peaksArray = []
      let length = data.length
      for (let i = 0; i < length; ) {
        if (data[i] ** 2 > threshold ** 2) {
          peaksArray.push(i / 48)
          // Skip forward get past this peak.
          i += 4000 // TODO: guess this number using bpm
        }
        i++
      }
      return peaksArray
    }
  })
}
