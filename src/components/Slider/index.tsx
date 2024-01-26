import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import styles from "./styles.module.css";

interface Props {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
}

const getRotation = (value: number, min: number, max: number): number => {
  // Calculate the range of values
  const range = max - min;

  // Calculate the percentage of the value within the range
  const percentage = (value - min) / range;

  // Calculate the angle in degrees based on the percentage
  const angle = percentage * 360;

  // Return the angle
  return angle;
};
export const Slider: React.FC<Props> = ({
  min,
  max,
  step,
  value,
  onChange,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<number | null>(null);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const rotation = getRotation(value, min, max);
    onChange(value);
  };

  const rotationHandler = useCallback((e: MouseEvent) => {
    if (!knobRef.current) return;

    const knob = knobRef.current;

    const initialX = e.clientX - knob.offsetLeft + (xRef.current || 0);

    const handleMouseMove = (e: MouseEvent) => {
      const xDiff = e.clientX - initialX;
      xRef.current = xDiff * -1;
      const angle = (xDiff * 180) / 200;

      knob.style.transform = `rotate(${angle}deg)`;

      onChange(((angle % 360) / 360) * max);
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
      <div ref={knobRef} className={styles.knob} />
    </div>
  );
};
