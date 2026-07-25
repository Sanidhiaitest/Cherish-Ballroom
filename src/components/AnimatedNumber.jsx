import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const isNumeric = typeof value === "number";
    if (!isNumeric) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <>{display}</>;
}
