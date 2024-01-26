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

const Home = () => {
  const { ctx } = useAudio();
  const [sketchInstance, setSketchInstance] = useState<Rotation>();

  const handleTrigger = useCallback((n: number) => {
    const osc = new OscillatorNode(ctx, {
      frequency: 220 + 20 * n,
    });

    osc.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1)
  }, []);

  useEffect(() => {
    setSketchInstance(
      new Rotation({
        onTrigger: handleTrigger,
      })
    );
  }, [handleTrigger]);

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <Headline />
      </div>

      <div className={styles.layout}>
        {sketchInstance && <P5Component sketch={sketchInstance.sketch} />}
      </div>

      <div className={styles.bottom}>
        <Keyboard />
      </div>
    </main>
  );
};

export default Home;
