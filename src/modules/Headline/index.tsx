import { Logo } from "@/components/Logo";
import styles from "./styles.module.css";
import p5 from "p5";
import { P5 } from "@/components/P5";

const sketch = (p: p5) => {
  const modFuncs = [
    (x: number) => p.sin(x * p.TWO_PI * (2 - p.sin(p.millis() / 1000))),
  ];
  const lineMod = (x: number) =>
    p.map(
      modFuncs.reduce((sum, func) => {
        return (sum += func(x));
      }, 0),
      0,
      modFuncs.length,
      0,
      1
    );

  p.setup = () => {
    p.createCanvas(100, 48);
    p.background(0);
    p.stroke(255);
    p.noFill();
    p.strokeWeight(0.5);
    p.strokeJoin(p.ROUND);
  };

  p.draw = () => {
    p.background(0);
    const cy = p.height / 2;
    const amp = cy * 1;

    p.beginShape();

    for (let x = 0; x < p.width; x++) {
      const dx = x / p.width;
      const ymod = lineMod(dx);

      const fq = p.width * 0.1;
      const theta = p.TWO_PI * -dx;
      const dt = (p.millis() / 1000) * 5;
      const dy = amp * ymod * Math.sin(theta * fq + dt);
      p.vertex(x, cy + dy);
    }

    p.endShape();
  };
};

export const Headline = () => {
  return (
    <div className={styles.headline}>
      <Logo />

      <P5 sketch={sketch} />
    </div>
  );
};
