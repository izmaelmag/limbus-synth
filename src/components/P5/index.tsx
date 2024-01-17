import p5 from "p5";
import { useEffect, useRef, useState } from "react";

type Props = {
  sketch: (p: p5) => void;
};

type Size = {
  width: number;
  height: number;
};

export const P5 = ({ sketch }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [P5, setP5] = useState<p5 | null>(null);

  useEffect(() => {
    if (!P5) {
      console.log(P5);
      if (containerRef.current) {
        const _p5 = new p5(sketch, containerRef.current);
        setP5(_p5);
      }
    }
  }, [P5, sketch]);

  return <div ref={containerRef} />;
};
