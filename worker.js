self.onmessage = ({ data }) => {
    const { timeseries, testFrequencies, sampleRate } = data;
    const frequencyAmplitudes = computeCorrelations(timeseries, testFrequencies, sampleRate);
    self.postMessage({ timeseries, frequencyAmplitudes });
};
  
const computeCorrelations = (timeseries, testFrequencies, sampleRate) => {
    const scaleFactor = (2 * Math.PI) / sampleRate;
  
    return testFrequencies.map(({ frequency }) => {
      let accumulator = [0, 0]; // Represents a complex number as [real, imaginary].
  
      timeseries.forEach((value, t) => {
        accumulator[0] += value * Math.cos(scaleFactor * frequency * t);
        accumulator[1] += value * Math.sin(scaleFactor * frequency * t);
    });
  
      return accumulator;
    });
};
