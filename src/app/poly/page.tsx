"use client";

import { Headline } from "@/modules/Headline";
import styles from "./page.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { playBuffer } from "./playBuffer";
import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/Button";
import { Pendulum } from "./sketch";
import P5Component from "@/components/P5";
import { ntfs } from "@/utils/sound";

const Cmaj7_3 = ["B3", "G3", "E3", "C4"];
const Cm7_2 = ["A#2", "G5", "D#2", "C2"];
const Cshm7_2 = ["C#2", "E2", "G#2", "B2"];

const NOTES = [Cmaj7_3, Cm7_2, Cshm7_2, Cm7_2].flat();

const sounds = [
  {
    name: "synth",
    path: "sounds/sound.wav",
  },

  {
    name: "pad",
    path: "sounds/pad-1.wav",
  },
];

type SoundData = {
  name: string;
  buffer: AudioBuffer;
};

const Poly = () => {
  const { ctx } = useAudio();

  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [sketch, setSketch] = useState<Pendulum>();

  const soundBufferRef = useRef<SoundData[]>([]);

  const playSound = useCallback(
    async (n: number) => {
      if (ctx && soundBufferRef.current) {
        await playBuffer({
          ctx,
          buffer: soundBufferRef.current[0].buffer,
          baseNote: "C4",
          gain: 0.7,
          detuneNote: NOTES[n],
        });

        await playBuffer({
          ctx,
          buffer: soundBufferRef.current[1].buffer,
          baseNote: "C4",
          detuneNote: NOTES[n],
        });
      }
    },
    [ctx]
  );

  useEffect(() => {
    const initContext = async (ctx: AudioContext) => {
      const soundResponse = await Promise.all(
        sounds.map((sound) => fetch(sound.path))
      );

      soundResponse.forEach(async (response, index) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const soundBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(soundBuffer);

        soundBufferRef.current.push({
          name: sounds[index].name,
          buffer: audioBuffer,
        });
      });

      toggleLoading(false);
    };

    if (ctx) {
      toggleLoading(true);

      const sketch = new Pendulum({
        count: NOTES.length,
        delay: 0.1,
        smallCount: 4,
        onTrigger: playSound,
      });

      setSketch(sketch);

      initContext(ctx);
    }
  }, [ctx, playSound]);

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <Headline />
      </div>

      <div className={styles.layout}>
        {sketch && <P5Component sketch={sketch.sketch} />}

        <Button disabled={isLoading} onClick={() => sketch?.play()}>
          <PlayIcon />
        </Button>
      </div>

      <div className={styles.bottom}></div>
    </main>
  );
};

export default Poly;
