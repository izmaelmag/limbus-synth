import p5 from "p5";

type Params = {
  count: number;
  delay: number;
  onTrigger: (index: number) => void;
};

export class Sketch<ParamsType extends Params> {
  // Instance variables
  params: ParamsType;
  fps = 60;
  currentFrame = 0;
  isPlaying = false;
  W = 400;
  H = 400;
  startAngle = 360;

  // Indexed trigger counter
  hasTriggeredCallback: boolean[] = [];

  // Initialization
  constructor(params: ParamsType) {
    this.params = params;
    this.init();
  }

  init = () => {
    for (let n = 0; n < this.params.count; n++) {
      this.hasTriggeredCallback[n] = false;
    }
  };

  // Computed values
  get center() {
    return {
      x: Math.round(this.W / 2),
      y: Math.round(this.H / 2),
    };
  }

  // PLayback control
  play = () => (this.isPlaying = true);
  pause = () => (this.isPlaying = false);
  stop = () => {
    this.isPlaying = false;
    this.currentFrame = 0;
  };
  step = () => {
    if (this.isPlaying) this.currentFrame++;
  };

  // Timing
  sec = () => (this.currentFrame / this.fps) * 100;
  ms = () => this.sec() / 1000;

  // Main sketch thread
  sketch = (p: p5) => {
    // Setup the sketch
    p.setup = () => {
      p.createCanvas(this.W, this.H);
      p.stroke(255);
      p.noFill();
      p.angleMode(p.DEGREES);
    };

    // Drawing loop
    p.draw = () => {
      p.translate(this.center.x, this.center.y);
      p.background(0);

      this.step();
    };
  };
}
