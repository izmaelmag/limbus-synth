import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { clamp, roundValue } from "./utils";
import { angleThreshold, angleRange } from "./constants";
import styles from "./styles.module.css";

interface Props {
  min: number;
  max: number;
  step: number;
  value?: number;
  sensitivity?: number;
  onChange: (value: number) => void;
}

export const Knob = ({
  min,
  max,
  step,
  value: defaultValue = 0.5,
  sensitivity = 200,
  onChange,
}: Props) => {
  // Dom ref
  const knobRef = useRef<HTMLDivElement>(null);

  // Value refs
  const xRef = useRef<number>(0);
  const angleRef = useRef<number>(0);
  const valueRef = useRef<number>(defaultValue);

  const [value, setValue] = useState<number>(defaultValue);

  const stepsCount = useMemo(() => (max - min) / step, [max, min, step]);

  const rotationHandler = useCallback(
    (e: MouseEvent) => {
      const knob = knobRef.current;

      if (!knob) return;

      const initialX = xRef.current + e.clientX - knob.offsetLeft;

      const handleMouseMove = (e: MouseEvent) => {
        // Calculate X coordinate drag offset and save it in ref
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

        const knobAngle =
          -angleThreshold + (angleRange / stepsCount) * stepsTaken;
        const knobValue = min + stepsTaken * step;

        if (angleRef.current !== knobAngle) {
          knob.style.transform = `rotate(${knobAngle}deg)`;
          angleRef.current = knobAngle;
        }

        if (valueRef.current !== knobValue) {
          valueRef.current = knobValue; // Update the ref
          setValue(knobValue);
          onChange(knobValue);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [max, min, onChange, sensitivity, step, stepsCount]
  );

  useEffect(() => {
    const knob = knobRef.current;

    if (knob) {
      knob.addEventListener("mousedown", rotationHandler);

      return () => knob.removeEventListener("mousedown", rotationHandler);
    }
  }, [rotationHandler]);

  useEffect(() => {
    valueRef.current = defaultValue;
    const stepsTaken = Math.round((defaultValue - min) / step);
    const knobAngle = -angleThreshold + (angleRange / stepsCount) * stepsTaken;

    console.log(knobAngle);

    angleRef.current = knobAngle;

    if (knobRef.current) {
      knobRef.current.style.transform = `rotate(${knobAngle}deg)`;
    }
  }, [defaultValue, min, step, stepsCount]);

  return (
    <div className={styles.customSlider}>
      <div className={styles.knobContainer}>
        <div ref={knobRef} className={styles.knob} />
      </div>

      <div className={styles.value}>{roundValue(value)}</div>
      <div className={styles.min}>{roundValue(min)}</div>
      <div className={styles.max}>{roundValue(max)}</div>
    </div>
  );
};
