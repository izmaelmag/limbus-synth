import cn from "classnames";
import {
  ReactEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.css";
import { useAudio } from "@/hooks/useAudio";
import { Slider } from "@/components/Slider";
import {
  CircularInput,
  CircularProgress,
  CircularThumb,
  CircularTrack,
} from "react-circular-input";

type Props = {
  interval?: number;
  onTrigger: (count: number) => void;
};

export const Trigger = ({ interval = 1000, onTrigger }: Props) => {
  const [active, toggle] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const [intervalMS, changeInterval] = useState<number>(interval);
  const { ctx } = useAudio();

  const trigger = useCallback(() => {
    if (active) {
      setCount(count + 1);
      onTrigger(count);
    }
  }, [onTrigger, count, active]);

  useEffect(() => {
    const intId = setInterval(() => {
      trigger();
    }, intervalMS);

    return () => clearInterval(intId);
  }, [trigger]);

  const handleDelayChange = (val: number) => {
    console.log(val);
    changeInterval(val);
  };

  return (
    <div className={styles.container}>
      {/* <div
        key={`lamp-count-${count}`}
        className={cn(styles.lamp, { [styles.blink]: active && count > 0 })}
      /> */}

      <Slider
        onChange={handleDelayChange}
        min={100}
        max={1000}
        step={10}
        value={500}
      />

      <div>{intervalMS} ms</div>
      {/* <div>Tick: {count}</div> */}
      {/* 
      <button type="button" onClick={() => toggle(!active)}>
        {active ? "off" : "on"}
      </button> */}
    </div>
  );
};
