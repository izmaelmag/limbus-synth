export const clamp = (val: number, min: number = 0, max: number = 1): number =>
  Math.min(Math.max(val, min), max);

export const roundValue = (value: number): number =>
  value % 1 > 0 ? Number(value.toFixed(2)) : value;
