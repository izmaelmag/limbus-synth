import { AudioCTX } from "@/context/AudioContext";
import { useContext, useMemo } from "react";

export const useAudio = () => {
  const { ctx: context } = useContext(AudioCTX);

  const output = useMemo(() => {
    if (context) {
      console.log("Context init: ", context);
      return { ctxReady: true, ctx: context };
    }

    return {
      ctxReady: false,
      ctx: null,
    };
  }, [context]);

  return output;
};
