import p5 from "p5";

type Params = {
  count: number;
  delay: number;
  onTrigger: (index: number) => void;
};

export class Rotation {
  // Instance variables
  params: Params;
  fps = 60;
  currentFrame = 0;
  isPLaying = false;
  W = 400;
  H = 400;
  startAngle = 360;

  // Indexed trigger counter
  hasTriggeredCallback: boolean[] = [];

  // Initialization
  constructor(params: Params) {
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
  play = () => (this.isPLaying = true);
  pause = () => (this.isPLaying = false);
  stop = () => {
    this.isPLaying = false;
    this.currentFrame = 0;
  };
  step = () => {
    if (this.isPLaying) {
      this.currentFrame++;
    }
  };

  // Timing
  sec = () => (this.currentFrame / this.fps) * 100;
  ms = () => this.sec() / 1000;

  // Sketching

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
      const {
        // Retrieve instance variables
        W,
        isPLaying,
        startAngle,
        hasTriggeredCallback,
        center,
        params: { count, delay, onTrigger },

        // Retrieve instance methods
        step,
        sec,
      } = this;

      p.translate(center.x, center.y);
      p.background(0);

      step();

      let speed = 0.1;

      for (let n = 0; n < count; n++) {
        // Get current angle of a circle
        let ca = startAngle + sec();

        // Apply rotation speed based on point index and delay
        ca *= speed + delay * (n + 1);

        // Constrain angle in 0–360 degrees range
        const da = ca % 360;

        // Calculate point's distance from the center
        const radius = Math.floor(180 - (n / count) * 160);

        // Calculate point coordinates
        const x = radius * p.cos(da);
        const y = radius * p.sin(da);

        p.stroke(40);
        p.noFill();
        p.circle(0, 0, (radius-4) * 2);
        p.fill(255);
        p.noStroke();
        p.circle(x, y, 8);

        // Round point's angle for correct trigger event comparison
        const angleCheck = Math.floor(Math.abs(da));

        // Check if circle should trigger or reset
        const shouldTrigger = angleCheck === 0 && !hasTriggeredCallback[n];
        const shouldReset = angleCheck > 0 && hasTriggeredCallback[n];

        // Enable trigger state + execute callback
        if (shouldTrigger) {
          onTrigger(n);
          hasTriggeredCallback[n] = true;
        }

        // Reset trigger state
        if (shouldReset) {
          hasTriggeredCallback[n] = false;
        }
      }

      p.noFill();
      p.stroke(255);
      p.line(0, 0, 180, 0);
    };
  };
}
