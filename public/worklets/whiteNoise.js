class WhiteNoiseProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    console.log(inputs, outputs);
    const output = outputs[0];
    const input = inputs[0];

    for (let channel = 0; channel < output.length; ++channel) {
      for (let i = 0; i < output[channel].length; ++i) {
        output[channel][i] = input[channel][i];
      }
    }

    return true;
  }
}

registerProcessor("whiteNoise", WhiteNoiseProcessor);
