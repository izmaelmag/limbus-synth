import { useCallback } from "react";
import styles from "./styles.module.css";

type Props = JSX.IntrinsicElements["button"] & {
  onClick: () => void;
};

export const Button = ({ children, onClick }: Props) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      {children}
    </button>
  );
};
