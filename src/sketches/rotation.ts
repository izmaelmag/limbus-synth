import p5 from "p5";

type Params = {
  count: number;
  delay: number;
  onTrigger: (index: number) => void;
};

export class Rotation {
  params: Params;

  fps = 60;
  currentFrame = 0;
  progress = 0;
  isPLaying = false;

  W = 400;
  H = 720;

  constructor(params: Params) {
    this.params = params;
  }

  get center() {
    return {
      x: Math.round(this.W / 2),
      y: Math.round(this.H / 2),
    };
  }

  setProgress = (progress: number) => {
    this.progress = progress;
  };

  play = () => (this.isPLaying = true);
  pause = () => (this.isPLaying = false);
  stop = () => {
    this.pause();
    this.currentFrame = 0;
  };

  get dt() {
    return (this.currentFrame / this.fps) * 100;
  }

  sketch = (p: p5) => {
    const startAngle = 360;
    const hasTriggeredCallback: boolean[] = [];

    p.setup = () => {
      p.createCanvas(this.W, this.H);
      p.stroke(255);
      p.noFill();
      p.angleMode(p.DEGREES);

      p.rotate(-90);

      for (let n = 0; n < this.params.count; n++) {
        hasTriggeredCallback[n] = false;
      }
    };

    p.draw = () => {
      p.translate(this.center.x, this.center.y);
      p.background(0);

      if (this.isPLaying) {
        this.currentFrame++;
      }

      let speed = 0.1;

      for (let n = 0; n < this.params.count; n++) {
        let ca =
          (n % 2 === 0 ? 180 : 0) +
          startAngle +
          this.dt * (speed + this.params.delay * n);
        let da = ca % 360;

        let distance = Math.floor(180 - (n / this.params.count) * 160);

        let x = distance * p.cos(da);
        let y = distance * p.sin(da);

        p.stroke(20);
        // p.line(0, 0, x, y);
        p.noFill();
        p.circle(0, 0, distance * 2);
        p.fill(255);
        p.noStroke();
        p.circle(x, y, 8);

        let yCheck = Math.floor(Math.abs(y));
        let xCheck = Math.floor(x);

        p.push();
        p.fill(255);
        p.noStroke();
        // p.text(n, x - 7, y - 14);
        p.pop();

        // Check if angle is close to 0 and callback hasn't been triggered
        if (yCheck === 0 && xCheck > 0 && !hasTriggeredCallback[n]) {
          this.params.onTrigger(n);
          hasTriggeredCallback[n] = true;
        }

        // Reset hasTriggeredCallback if angle moves away from 0 beyond epsilon
        if (yCheck > 0 && xCheck < 0 && hasTriggeredCallback[n]) {
          hasTriggeredCallback[n] = false;
        }
      }

      p.noFill();
      p.stroke(100);
      p.circle(0, 0, 360);
      p.stroke(255);
      p.line(0, 0, this.W, 0);
    };
  };
}
