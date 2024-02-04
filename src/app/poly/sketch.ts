import { Sketch } from "@/sketches/Sketch";
import p5 from "p5";

type Params = {
  count: number;
  delay: number;
  onTrigger: (index: number) => void;
  smallCount: number;
};

export class Pendulum extends Sketch<Params> {
  W = 360;
  H = 512;
  fps = 60;
  currentFrame = 0;

  stringAmp = 0;
  stringFq = 0;

  constructor(props: Params) {
    super(props);
  }

  drawString = (p: p5) => {
    p.push();
    p.translate(0, this.H * -0.5);
    p.beginShape();
    for (let y = 0; y < this.H; y++) {
      const angle = p.PI + y * this.stringFq + this.sec();
      const amp = this.stringAmp * p.sin(p.PI + y + this.sec());
      let x = amp * p.sin(angle);
      p.vertex(x, y);
    }
    p.endShape();
    p.pop();
  };

  checkStringAmp = () => {
    if (this.stringAmp > 4) {
      this.stringAmp -= 0.1;
    }

    if (this.stringFq > 2) {
      this.stringFq -= 0.1;
    }
  };

  // Main sketch thread
  sketch = (p: p5) => {
    // Setup the sketch
    p.setup = () => {
      p.createCanvas(this.W, this.H);
      p.stroke(255);
      p.background(0);
      p.noFill();
      p.angleMode(p.DEGREES);
      p.strokeWeight(0.5)
    };

    // Drawing loop
    p.draw = () => {
      const { hasTriggeredCallback, params, center, W, H } = this;

      p.translate(center.x, center.y);
      p.background(0, 50);

      for (let n = 1; n <= params.count; n++) {
        const fraction = n / params.count;
        const R = 170 - 120 * fraction;
        const speed = 0.5 * (0.2 + fraction * (0.3 + params.delay));

        let x = R * p.cos(speed * this.sec());
        let y =( R * this.H/this.W) * p.sin(speed * this.sec() * fraction + 0.25);

        p.stroke(50);
        p.stroke(255);
        p.fill(255);
        p.circle(x, y, 4);
        p.noFill();

        // Check if circle should trigger or reset
        const shouldTrigger = Math.round(x) === 0 && !hasTriggeredCallback[n];
        const shouldReset = x > 0 || (x < 0 && hasTriggeredCallback[n]);

        // Enable trigger state + execute callback
        if (shouldTrigger) {
          this.stringAmp += 10;
          this.stringFq += 5;
          params.onTrigger(n);
          hasTriggeredCallback[n] = true;
        }

        // Reset trigger state
        if (shouldReset) {
          hasTriggeredCallback[n] = false;
        }

        this.drawString(p);
        this.checkStringAmp();
      }

      this.step();
    };
  };
}
