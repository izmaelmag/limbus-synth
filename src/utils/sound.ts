export const ntf = (note: string): number => {
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

export const ntfs = (...note: string[]): number[] => note.map(ntf);

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
