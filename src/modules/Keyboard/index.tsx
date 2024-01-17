import cn from "classnames";
import styles from "./styles.module.css";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Key } from "./Key";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const noteFqMap: Record<string, number> = {
  C: 16.35,
  "C#": 17.32,
  D: 18.35,
  "D#": 19.45,
  E: 20.6,
  F: 21.83,
  "F#": 23.12,
  G: 24.5,
  "G#": 25.96,
  A: 27.5,
  "A#": 29.14,
  B: 30.87,
};

type Props = {};

const getNotesSet = (notes: string[]): string[] => {
  return Array.from(new Set(notes));
};

export const Keyboard = ({}: Props) => {
  return (
    <div className={styles.keyboard}>
      {notes.map((note, index) => {
        const style = {
          "--index": index,
        } as CSSProperties;

        return <Key style={style} key={note} note={note} />;
      })}
    </div>
  );
};
