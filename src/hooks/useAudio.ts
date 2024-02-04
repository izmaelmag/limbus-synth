import { AudioCTX } from "@/context/AudioContext";
import { useContext, useMemo } from "react";

type Output = {
  ctxReady: boolean;
  ctx: AudioContext | null;
};

export const useAudio = (): Output => {
  const { ctx: context } = useContext(AudioCTX);

  const output = useMemo(() => {
    if (context) return { ctxReady: true, ctx: context };

    return {
      ctxReady: false,
      ctx: null,
    };
  }, [context]);

  return output;
};
