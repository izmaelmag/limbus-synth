import { Sketch } from "@/sketches/Sketch";
import p5 from "p5";

type Params = {
  count: number;
  delay: number;
  onTriggerX: (n: number, y: number) => void;
  onTriggerY: (n: number, x: number) => void;
  onTrigger: (index: number) => void;
  smallCount: number;
};

export class Pendulum extends Sketch<Params> {
  W = 360;
  H = Math.floor((this.W * 16) / 9);
  fps = 60;
  currentFrame = 0;

  stringAmp = 0;
  stringFq = 0;
  fadeValue = 50;

  constructor(props: Params) {
    super(props);
  }

  drawString = (p: p5) => {
    if (this.stringAmp > 10) {
      this.stringAmp -= 0.1;
    }

    if (this.stringFq > 2) {
      this.stringFq -= 0.4;
    }

    if (this.fadeValue < 50) {
      this.fadeValue += 0.02;
    }

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

  checkTriggerX = (x: number, y: number, n: number) => {
    const { hasTriggeredCallback, params } = this;

    // Check if circle should trigger or reset
    const shouldTrigger = Math.round(x) === 0 && !hasTriggeredCallback[n];
    const shouldReset = x > 0 || (x < 0 && hasTriggeredCallback[n]);

    // Enable trigger state + execute callback
    if (shouldTrigger) {
      // Increase string vibration
      this.stringAmp += 10;
      this.stringFq += y/10;
      this.fadeValue -= 6;

      // Trigger
      params.onTriggerX(n, y/-5);
      params.onTriggerY(n, y/5);

      // Switch triggered notes
      hasTriggeredCallback[n] = true;
    }

    // Reset trigger state
    if (shouldReset) {
      hasTriggeredCallback[n] = false;
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
      p.strokeWeight(0.5);
    };

    // Drawing loop
    p.draw = () => {
      const { hasTriggeredCallback, params, center, W, H } = this;

      p.translate(center.x, center.y);
      p.background(0, this.fadeValue);

      console.log(this.fadeValue);

      for (let n = 1; n <= params.count; n++) {
        const fraction = n / params.count;
        const R = 170 - 120 * fraction;
        const speed = 0.2 * (0.2 + fraction * (0.3 + params.delay));

        const xRad = speed * this.sec() * 3;
        const yRad = speed * this.sec() * 2;

        const xR = R;
        const yR = (R * this.H) / this.W;

        let x = xR * p.cos(xRad);
        let y = yR * p.sin(yRad);

        for (let i = 0; i < p.PI * 6; i += 0.2) {
          let progress = i / (p.PI * 6);
          let x = p.cos(progress * xRad) * xR;
          let y = p.sin(progress * yRad) * yR;
          p.stroke(100);
          p.strokeWeight(1);
          p.point(x, y);
          p.strokeWeight(0.5);
        }

        p.stroke(50);
        p.stroke(255);
        p.fill(255);
        p.circle(x, y, 2);
        p.noFill();
        p.circle(x, y, 12);

        this.checkTriggerX(x, y, n);

        this.drawString(p);
      }

      this.step();
    };
  };
}
