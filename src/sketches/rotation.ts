import p5 from "p5";

type Props = {
  onTrigger: (n: number) => void;
};

export class Rotation {
  trigger: (n: number) => void;

  constructor(props: Props) {
    this.trigger = props.onTrigger;
  }

  sketch = (p: p5) => {
    let frames = 0;

    p.setup = () => {
      p.createCanvas(400, 400);
      p.stroke(255);
      p.noFill();
    };

    p.draw = () => {
      p.background(30);
      p.circle(200, 200, 100);

      for (let n = 1; n <= 10; n++) {
        const da = (n / 10) * p.PI + frames * n * 0.001;
        let x = 200 + 5 * n * p.cos(da);
        let y = 200 + 5 * n * p.sin(da);

        if (da % p.PI > 0 && da % p.PI < 0.01) {
          // this.trigger(n);
        }

        p.circle(x, y, 4);
      }

      frames++;
    };
  };
}
