"use client";

import { useRef } from "react";
import { Trigger } from "@/modules/Trigger";
import styles from './styles.module.css'

const Playground = () => {
  const ctx = useRef<AudioContext>();
  const osc = useRef<OscillatorNode>();

  return (
    <div className={styles.page}>
      <h1>Playground</h1>

      <Trigger onTrigger={console.log} />
    </div>
  );
};

export default Playground;
