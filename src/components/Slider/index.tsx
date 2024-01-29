import React, {
  ChangeEvent,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import styles from "./styles.module.css";

interface Props {
  min: number;
  max: number;
  step: number;
  value?: number;
  sensitivity?: number;
  onChange: (value: number) => void;
}

const clamp = (val: number, min: number = 0, max: number = 1) =>
  Math.min(Math.max(val, min), max);

const angleThreshold = 135;
const angleRange = Math.abs(angleThreshold) * 2;

const visualValue = (value: number) =>
  value % 1 > 0 ? value.toFixed(2) : value;

export const Slider: React.FC<Props> = ({
  min,
  max,
  step,
  value: defaultValue = 0.5,
  sensitivity = 200,
  onChange,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<number | null>(null);
  const [value, setValue] = useState<number>(defaultValue);

  const rotationHandler = useCallback((e: MouseEvent) => {
    const knob = knobRef.current;

    if (!knob) return;

    const initialX = e.clientX - knob.offsetLeft + (xRef.current || 0);

    const handleMouseMove = (e: MouseEvent) => {
      const valueRange = max - min;
      const stepsCount = valueRange / step;
      const angleStep = angleRange / stepsCount;

      // Calculate X coordinate drag offset
      const xDiff = clamp(e.clientX - initialX, -sensitivity, sensitivity);
      xRef.current = xDiff * -1;

      // Floating values
      const angle = clamp(
        xDiff * (180 / sensitivity),
        -angleThreshold,
        angleThreshold
      );
      const value = clamp(
        max * ((angle + angleThreshold) / angleRange),
        min,
        max
      );

      const stepsTaken = Math.round((value - min) / step);

      const knobAngle = -angleThreshold + angleStep * stepsTaken;
      const knobValue = min + stepsTaken * step;

      knob.style.transform = `rotate(${knobAngle}deg)`;

      setValue(knobValue);
      onChange(knobValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    const knob = knobRef.current;

    if (knob) {
      knob.addEventListener("mousedown", rotationHandler);

      () => knob.removeEventListener("mousedown", rotationHandler);
    }
  }, [rotationHandler]);

  return (
    <div className={styles.customSlider}>
      <div className={styles.knobContainer}>
        <div ref={knobRef} className={styles.knob} />
      </div>

      <div className={styles.value}>{visualValue(value)}</div>

      <div className={styles.min}>{visualValue(min)}</div>
      <div className={styles.max}>{visualValue(max)}</div>
    </div>
  );
};
