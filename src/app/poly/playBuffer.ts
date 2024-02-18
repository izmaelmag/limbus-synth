import { ntf, detune } from "@/utils/sound";

type Options = {
  ctx: AudioContext;
  buffer: AudioBuffer;
  baseNote: string;
  detuneNote: string;
  gain?: number;
  detuneOffset?: number;
};

export const detuneDuration = (
  fq1: number,
  fq2: number,
  duration: number
): number => {
  return duration * (fq1 / fq2);
};

export const playBuffer = ({
  ctx,
  buffer,
  baseNote,
  detuneNote,
  gain: gainValue,
  
  detuneOffset = 0,
}: Options): AudioBufferSourceNode => {
  const source = new AudioBufferSourceNode(ctx, { buffer });
  const gain = new GainNode(ctx, { gain: gainValue || 1 });

  // Get notes frequencies
  const baseFq = ntf(baseNote);
  const detuneFq = ntf(detuneNote || baseNote);

  // Calculate timing
  const timeStart = ctx.currentTime;
  const timeEnd =
    ctx.currentTime + detuneDuration(baseFq, detuneFq, buffer.duration);

  // Apply detune
  source.detune.value = detune(baseFq, detuneFq + detuneOffset);

  source.connect(gain).connect(ctx.destination);

  // Setup playback gate
  source.start(timeStart);
  source.stop(timeEnd);

  return source;
};
