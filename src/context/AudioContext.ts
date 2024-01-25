import { createContext } from "react";

interface AudioContextProps {
  ctx: AudioContext;
}

export const AudioCTX = createContext<AudioContextProps>({
  ctx: new AudioContext(),
});
