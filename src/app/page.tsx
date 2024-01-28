"use client";

import { Headline } from "@/modules/Headline";
import styles from "./page.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { Rotation } from "@/sketches/rotation";
import P5Component from "@/components/P5";

const ntf = (note: string): number => {
  const A4 = 440;
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const octave = parseInt(note.slice(-1));
  const noteIndex = notes.indexOf(note.slice(0, -1));

  // Distance of the note from A4 in semitones
  const semitoneDistance = (octave - 4) * 12 + noteIndex - 9; // -9 adjusts from C to A

  return A4 * Math.pow(2, semitoneDistance / 12);
};

const ntfs = (...note: string[]): number[] => note.map(ntf);

function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const chords: number[][] = [
  shuffleArray(ntfs("C4", "D4", "E4", "F4", "G4", "A4", "B4")),
  shuffleArray(ntfs("C#4", "D#4", "F#4", "G#4", "A#4")),
];

// const frequenciesOnePitchHigher = [
//   45 * semitoneRatio, // C (was B)
//   73.42 * semitoneRatio, // D# (was D)
//   82.41 * semitoneRatio, // F (was E)
//   103.83 * semitoneRatio, // G# (was G)
//   110 * semitoneRatio, // C (was B)
//   // ... 1 octave lower than the base, raised by 1 pitch

//   138.59 * semitoneRatio, // F (was E)
//   146.83 * semitoneRatio, // G (was F#)
//   164.81 * semitoneRatio, // A (was G#)
//   207.65 * semitoneRatio, // C# (was C)
//   // ... Base pentatonic, raised by 1 pitch

//   220 * semitoneRatio, // C (was B)
//   277.18 * semitoneRatio, // F# (was F)
//   293.66 * semitoneRatio, // G# (was G)
//   329.63 * semitoneRatio, // A# (was A)
//   415.3 * semitoneRatio, // D (was C#)
//   // ... 1 octave higher, raised by 1 pitch
// ];

const FQS: number[] = shuffleArray(chords.flat());

const Home = () => {
  const { ctx } = useAudio();
  const [sketchInstance, setSketchInstance] = useState<Rotation>();
  const [isPlaying, setPLayingState] = useState<boolean>(false);
  const masterGainRef = useRef<GainNode | null>(null);

  const [ADSR, setADSR] = useState<number[]>([0, 4, 0, 0]);

  const handleTrigger = useCallback(
    (index: number) => {
      if (ctx) {
        const [attack, sustain, decay, release] = ADSR;
        const noteLength = attack + sustain + decay + release + 0.05;

        const time = ctx.currentTime;

        const osc = new OscillatorNode(ctx, {
          frequency: FQS[index],
        });

        const gain = new GainNode(ctx);

        gain.gain.cancelScheduledValues(time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(1, time + attack);
        gain.gain.linearRampToValueAtTime(0, time + attack + sustain + release);

        if (masterGainRef.current) {
          osc.connect(gain).connect(masterGainRef.current);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + noteLength);
        }
      }
    },
    [ctx]
  );

  useEffect(() => {
    const initContext = async (ctx: AudioContext) => {
      await ctx.audioWorklet.addModule("/worklets/randNoise.js");

      masterGainRef.current = new GainNode(ctx, {
        gain: 0.5,
      });

      masterGainRef.current.connect(ctx.destination);
    };

    if (ctx) {
      initContext(ctx);

      const sketch = new Rotation({
        count: FQS.length,
        delay: 0.02,
        onTrigger: handleTrigger,
      });

      setSketchInstance(sketch);
    }
  }, [ctx, handleTrigger]);

  const handlePlayStart = useCallback(() => {
    if (isPlaying) {
      sketchInstance?.pause();
      setPLayingState(false);
    } else {
      sketchInstance?.play();
      setPLayingState(true);
    }
  }, [isPlaying, sketchInstance]);

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <Headline />
      </div>

      <div className={styles.layout}>
        {sketchInstance && <P5Component sketch={sketchInstance.sketch} />}

        <button onClick={handlePlayStart} type="button">
          ⏯️
        </button>

        <button onClick={() => sketchInstance?.stop()} type="button">
          ⏹️
        </button>
      </div>

      <div className={styles.bottom}></div>
    </main>
  );
};

export default Home;
