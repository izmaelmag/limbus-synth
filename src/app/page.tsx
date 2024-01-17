"use client";

import { Headline } from "@/modules/Headline";
import { Keyboard } from "@/modules/Keyboard";
import styles from './page.module.css'

const Home = () => {
  return (
    <main className={styles.main}>
      <Headline />
      <Keyboard />
    </main>
  );
};

export default Home;
