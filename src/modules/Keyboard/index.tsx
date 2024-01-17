import cn from "classnames";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";

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

export const Keyboard = ({}: Props) => {
  const [isMouseDown, setMouseDown] = useState<boolean>(false);
  const [activeNotes, updateActiveNotes] = useState<string[]>([]);

  useEffect(() => {
    document.addEventListener("mousedown", () => {
      setMouseDown(true);
    });

    document.addEventListener("mouseup", () => {
      setMouseDown(false);
    });
  }, []);

  const updateNotes = (notes: string[]) => {
    updateActiveNotes(Array.from(new Set(notes)));

    console.log(activeNotes);
  };

  const addNote = (note: string) => () => {
    updateNotes([...activeNotes, note]);
  };

  const removeNote = (note: string) => () => {
    updateNotes(activeNotes.filter((activeNote) => activeNote !== note));
  };

  return (
    <div onMouseLeave={() => setMouseDown(false)} className={styles.keyboard}>
      {notes.map((note) => {
        return (
          <div
            key={note}
            className={cn(styles.key, {
              [styles.sharp]: note.endsWith("#"),
              [styles.active]: activeNotes.includes(note),
            })}
          >
            <button
              type="button"
              // Add note
              onMouseDown={addNote(note)}
              onMouseEnter={isMouseDown ? addNote(note) : undefined}
              // Remove notes
              onMouseUp={removeNote(note)}
              onMouseLeave={isMouseDown ? removeNote(note) : undefined}
              // Class
              className={styles.keyButton}
            >
              {note}
            </button>
          </div>
        );
      })}
    </div>
  );
};
