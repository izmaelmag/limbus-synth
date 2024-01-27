import p5 from "p5";

type Params = {
  count: number;
  delay: number;
  onTrigger: (index: number) => void;
};

export class Rotation {
  params: Params;

  fps = 60;
  duration = 10;
  currentFrame = 0;
  progress = 0;
  isPLaying = false;

  W = 400;
  H = 400;

  constructor(params: Params) {
    this.params = params;
  }

  get totalFrames() {
    return this.fps * this.duration * this.params.count;
  }

  updateProgress() {
    if (this.isPLaying) {
      let progress = (this.currentFrame % this.totalFrames) / this.totalFrames;

      if (progress >= 1) {
        this.currentFrame = 0;
      }

      this.setProgress(progress);
    }
  }

  get center() {
    return {
      x: Math.round(this.W / 2),
      y: Math.round(this.W / 2),
    };
  }

  setProgress = (progress: number) => {
    this.progress = progress;
  };

  play = () => (this.isPLaying = true);
  pause = () => (this.isPLaying = false);
  stop = () => {
    this.pause();
    this.setProgress(0);
  };

  sketch = (p: p5) => {
    const startAngle = (p.PI / 2) * -1; // 45 deg anti-clockwise

    p.setup = () => {
      p.createCanvas(this.W, this.H);
      p.stroke(255);
      p.noFill();
    };

    p.draw = () => {
      p.translate(this.center.x, this.center.y);
      p.background(30);
      p.circle(0, 0, 200);
      p.line(0, 0, 0, this.H * -0.5);

      if (this.isPLaying) {
        this.currentFrame++;
        this.updateProgress();
      } else return;

      for (let n = 0; n < this.params.count; n++) {
        let circleDelay = 1 - this.params.delay * (n + 1);

        let da =
          startAngle + p.TWO_PI * circleDelay * this.progress;

        let distance = 100 - n * 10;

        let x = distance * p.cos(da);
        let y = distance * p.sin(da);

        p.circle(x, y, 10);
        p.line(0, 0, x, y);
        p.text(this.currentFrame, 10, 10);

        // if (da === p.PI * -0.5) {
        //   this.params.onTrigger(n);
        // }
      }

      if (this.currentFrame === this.totalFrames) {
        this.currentFrame = 0;
        this.setProgress(0);
      }
    };
  };
}
