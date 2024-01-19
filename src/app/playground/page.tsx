"use client";

import P5Component from "@/components/P5";
import { useCallback, useEffect, useRef } from "react";
import { sketch } from "./sketch";

const Playground = () => {
  const ctx = useRef<AudioContext>();
  const osc = useRef<OscillatorNode>();

  const fq = 35;

  useEffect(() => {
    const context = new AudioContext();
    ctx.current = context;
  }, []);

  const play = useCallback(() => {
    if (osc.current) {
      osc.current.stop();
      osc.current = undefined;
    } else {
      if (ctx.current) {
        // Oscillator
        const gain = new GainNode(ctx.current, {
          gain: 1,
        });

        const oscillator = new OscillatorNode(ctx.current, {
          frequency: fq,
          type: "sine",
        });

        oscillator.connect(gain);
        oscillator.start();

        // LFO
        const lfo = new OscillatorNode(ctx.current, {
          frequency: 5,
          type: "sine",
        });

        const LFOGain = new GainNode(ctx.current, {
          gain: 1,
        });

        lfo.start();
        lfo.connect(LFOGain);
        // ======================

        // LFOGain2.connect(oscillator.frequency);
        LFOGain.connect(gain.gain);

        gain.connect(ctx.current.destination);

        // Save oscillator
        osc.current = oscillator;
      }
    }
  }, []);

  return (
    <>
      <h1>Playground</h1>
      <button onClick={play}>Play</button>

      <P5Component sketch={sketch} />
    </>
  );
};

export default Playground;
