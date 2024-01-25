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

type Props = {
  interval?: number;
  onTrigger: (t: number) => void;
};

export const Trigger = ({ interval = 1000, onTrigger }: Props) => {
  const [active, toggle] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const [intervalMS, changeInterval] = useState<number>(interval);
  const { ctx } = useAudio();

  const trigger = useCallback(
    (time: number) => {
      if (active) {
        console.log("Trigger tick");
        setCount(count + 1);
        onTrigger(time);
      }
    },
    [onTrigger, count, active]
  );

  useEffect(() => {
    const intId = setInterval(() => {
      trigger(ctx.currentTime);
    }, intervalMS);

    return () => clearInterval(intId);
  }, [trigger]);

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeInterval(Number(e.currentTarget.value));
  };

  return (
    <div className={styles.container}>
      <div
        key={`lamp-count-${count}`}
        className={cn(styles.lamp, { [styles.blink]: active && count > 0 })}
      />

      <input
        onChange={handleDelayChange}
        type="range"
        min={50}
        max={1000}
        step={10}
        value={intervalMS}
      />

      <span>{intervalMS} ms</span>
      <div>Tick: {count}</div>

      <button type="button" onClick={() => toggle(!active)}>
        {active ? "off" : "on"}
      </button>
    </div>
  );
};
