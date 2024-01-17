"use client";

import p5 from "p5";
import { useEffect, useRef, useState } from "react";

type Props = {
  sketch: (p: p5) => void;
};

const P5 = ({ sketch }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [P5, setP5] = useState<p5 | null>(null);

  useEffect(() => {
    if (!P5 && containerRef.current) {
      setP5(new p5(sketch, containerRef.current));
    }
  }, [setP5, sketch, P5]);

  return <div ref={containerRef} />;
};

export default P5;
