import { createContext } from "react";

interface AudioContextProps {
  ctx: AudioContext | null;
}

export const AudioCTX = createContext<AudioContextProps>({
  ctx: typeof window !== "undefined" ? new AudioContext() : null,
});
