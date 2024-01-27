class RandomNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.port.onmessage = (message) => {
      console.log(message.data);
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];

    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = Math.random() * (1 - (1 / channel.length) * 2 - 1);
      }
    });

    return true;
  }
}

registerProcessor("random-noise-processor", RandomNoiseProcessor);
