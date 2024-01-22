"use client";

import { Headline } from "@/modules/Headline";
import { Keyboard } from "@/modules/Keyboard";
import styles from "./page.module.css";
import GridLayout from "react-grid-layout";

const Home = () => {
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2 },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <Headline />
      </div>

      <div className={styles.layout}>
        <div className={styles.modulesLayout}>
          <GridLayout
            className={styles.gridLayout}
            autoSize={true}
            layout={layout}
            margin={[0, 0]}
            cols={8}
            preventCollision={true}
            rowHeight={64}
            width={1920}
          >
            <div className={styles.gridCell} key="a">
              a
            </div>
            <div className={styles.gridCell} key="b">
              b
            </div>
            <div className={styles.gridCell} key="c">
              c
            </div>
          </GridLayout>
        </div>
      </div>

      <div className={styles.bottom}>
        <Keyboard />
      </div>
    </main>
  );
};

export default Home;
