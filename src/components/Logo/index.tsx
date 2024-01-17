import Image from "next/image";
import styles from "./styles.module.css";
import logo from "./logo-256.png";

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <Image alt="Limbus Logo" src={logo} width={64} height={64} />

      <h1>
        Limbus
      </h1>
    </div>
  );
};
