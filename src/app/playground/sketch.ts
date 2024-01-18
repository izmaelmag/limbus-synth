import p5 from "p5";

export const sketch = (p: p5) => {
  const fq = 35;

  const normalSin = (x: number, dt: number): number => {
    let cx = p.constrain(x, 0, 1);

    return p.sin(cx * p.PI * 2 + dt);
  };

  p.setup = () => {
    p.createCanvas(256, 128);
    p.noFill();
    p.stroke(255);
  };

  p.draw = () => {
    p.background(0);

    let cy = p.height / 2;
    let amp = Math.floor(cy * 0.8);
    let dt = ((p.millis() / 1000) % p.width) * p.TWO_PI * 0.5;

    p.beginShape();
    p.strokeWeight(1)
    for (let x = 0; x < p.width; x++) {
      let dx = x / p.width; // 0 to 1
      let filteredAmp = normalSin(dx, dt) * amp;
      let y = cy + filteredAmp * p.sin(dx * p.TWO_PI * fq/2 + dt);

      p.vertex(x, y);
    }

    p.endShape();

    p.line(p.width / 2, 0, p.width / 2, p.height);
  };
};
