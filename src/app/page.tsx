"use client";

import { Headline } from "@/modules/Headline";
import { Keyboard } from "@/modules/Keyboard";
import styles from "./page.module.css";
import GridLayout from "react-grid-layout";
import { Trigger } from "@/modules/Trigger";
import { useContext, useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

const Home = () => {
  const { ctx } = useAudio();

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <Headline />
      </div>

      <div className={styles.layout}>
        <div className={styles.modulesLayout}>
          <Trigger
            onTrigger={(time) => {
              const osc = new OscillatorNode(ctx, {
                frequency: 220,
              });
            }}
          />
        </div>
      </div>

      <div className={styles.bottom}>
        <Keyboard />
      </div>
    </main>
  );
};

export default Home;
