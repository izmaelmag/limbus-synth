"use client";

import { Headline } from "@/modules/Headline";
import { Keyboard } from "@/modules/Keyboard";
import styles from "./page.module.css";
import GridLayout from "react-grid-layout";
import { Trigger } from "@/modules/Trigger";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { Rotation } from "@/sketches/rotation";
import P5Component from "@/components/P5";

type OscillatorsParams = {
  count: number;
  delay: number; // from 0 to 1
  frequencies: number[];
};

type OscillatorsOutput = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

const createOscillators = (
  ctx: AudioContext,
  { count, frequencies, delay }: OscillatorsParams
): OscillatorsOutput[] => {
  const nodes: OscillatorsOutput[] = [];

  const normalDelay = Math.min(Math.max(delay, 0), 1);

  if (frequencies.length !== count)
    throw new Error("count and frequencies length should be the same ");

  for (let n = 0; n < count; n++) {
    const oscillator = new OscillatorNode(ctx, {
      frequency: frequencies[n],
    });

    const gain = new GainNode(ctx, {
      gain: 1,
    });

    oscillator.connect(gain);

    nodes[n] = {
      oscillator,
      gain,
    };
  }

  return nodes;
};

const Home = () => {
  const { ctx } = useAudio();
  const [sketchInstance, setSketchInstance] = useState<Rotation>();
  const oscillatorsRef = useRef<OscillatorsOutput[]>([]);

  const handleTrigger = useCallback(
    (index: number) => {
      if (ctx) {
        const [a, d, s, r] = [0.05, 0, 0, 2];

        let { currentTime: time } = ctx;
        let noteLength = 3;

        const { oscillator, gain } = oscillatorsRef.current[index];

        const osc = new OscillatorNode(ctx, {
          frequency: oscillator.frequency.value,
        });

        osc.connect(gain);

        gain.gain.cancelScheduledValues(time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(1, time + a);
        gain.gain.linearRampToValueAtTime(0, time + noteLength - r);

        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + noteLength);
      }
    },
    [ctx]
  );

  useEffect(() => {
    const initContext = async (ctx: AudioContext) => {
      await ctx.audioWorklet.addModule("/worklets/randNoise.js");

      oscillatorsRef.current = createOscillators(ctx, {
        count: 5,
        delay: 1,
        frequencies: [110, 140, 150, 200, 220],
      });
    };

    if (ctx) {
      initContext(ctx);

      const sketch = new Rotation({
        count: 5,
        delay: 0.25,
        onTrigger: handleTrigger,
      });

      setSketchInstance(sketch);
    }
  }, [ctx, handleTrigger]);

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <Headline />
      </div>

      <div className={styles.layout}>
        {sketchInstance && <P5Component sketch={sketchInstance.sketch} />}

        <button onClick={() => sketchInstance?.play()} type="button">
          Start
        </button>

        <button onClick={() => sketchInstance?.stop()} type="button">
          Stop
        </button>
      </div>

      <div className={styles.bottom}></div>
    </main>
  );
};

export default Home;
