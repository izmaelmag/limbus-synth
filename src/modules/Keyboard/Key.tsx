import cn from "classnames";
import styles from "./styles.module.css";

type Props = JSX.IntrinsicElements["div"] & {
  note: string;
};

export const Key = ({ note, ...domProps }: Props) => {
  return (
    <div
      {...domProps}
      key={note}
      className={cn(styles.key, {
        [styles.sharp]: note.endsWith("#"),
      })}
    >
      <button type="button" className={styles.keyButton}>
        {note}
      </button>
    </div>
  );
};
