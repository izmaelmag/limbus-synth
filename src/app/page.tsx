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
  ntfs("C3", "D3", "E3", "G3", "A3"), // C Major Pentatonic (3rd Octave)
  ntfs("E4", "G4", "A4", "C4", "D4"), // E Minor Pentatonic (4th Octave) - Shares notes with C Major
  ntfs("G4", "A4", "B4", "D5", "E5"), // G Major Pentatonic (4th and 5th Octave)
  ntfs("A3", "C4", "E4", "G4", "A4"), // A Minor Pentatonic (3rd and 4th Octave)
];

const FQS: number[] = shuffleArray(chords.flat());

const Home = () => {
  const { ctx } = useAudio();
  const [sketchInstance, setSketchInstance] = useState<Rotation>();
  const [isPlaying, setPLayingState] = useState<boolean>(false);
  const masterGainRef = useRef<GainNode | null>(null);

  const [ADSR, setADSR] = useState<number[]>([0.05, 0, 0, 1]);

  const handleTrigger = useCallback(
    (index: number) => {
      if (ctx) {
        const [attack, sustain, decay, release] = ADSR;
        const noteLength = attack + sustain + decay + release;

        const lfo = new OscillatorNode(ctx, {
          frequency: 2,
        });

        const lfoGain = new GainNode(ctx, {
          gain: 1,
        });

        lfo.connect(lfoGain);

        const time = ctx.currentTime;

        const osc = new OscillatorNode(ctx, {
          frequency: FQS[index],
        });

        lfo.connect(osc.frequency);

        const gain = new GainNode(ctx);
        lfoGain.connect(gain);

        gain.gain.cancelScheduledValues(time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + attack);
        gain.gain.linearRampToValueAtTime(0, time + attack + sustain + release);
        osc.connect(gain);

        if (masterGainRef.current) {
          gain.connect(masterGainRef.current);
          lfo.start(time);
          osc.start(time);
          osc.stop(time + noteLength);
          lfo.stop(time + noteLength);
        }
      }
    },
    [ctx, ADSR]
  );

  useEffect(() => {
    const initContext = async (ctx: AudioContext) => {
      await ctx.audioWorklet.addModule("/worklets/randNoise.js");

      masterGainRef.current = new GainNode(ctx, {
        gain: 0.1,
      });

      masterGainRef.current.connect(ctx.destination);
    };

    if (ctx) {
      initContext(ctx);

      const sketch = new Rotation({
        count: FQS.length,
        delay: 0.01,
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
