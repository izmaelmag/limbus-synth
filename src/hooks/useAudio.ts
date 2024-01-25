import { AudioCTX } from "@/context/AudioContext";
import { useContext, useMemo } from "react";

export const useAudio = () => {
  const { ctx: context } = useContext(AudioCTX);

  const output = useMemo(() => {
    console.log("Context init: ", context);
    return { ctx: context };
  }, [context]);

  return output;
};
