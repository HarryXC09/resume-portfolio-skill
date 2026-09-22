import { useEffect, useRef } from "react";
import { useReduced } from "../lib/motion";
export default function Field() {
  const ref = useRef(),
    reduce = useReduced();
  useEffect(() => {
    const c = ref.current,
      ctx = c.getContext("2d");
    let w, h;
    let pointer = { x: -999, y: -999 };
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let x = 12; x < w; x += 32)
        for (let y = 12; y < h; y += 32) {
          const d = Math.hypot(x - pointer.x, y - pointer.y),
            f = !reduce ? Math.max(0, 1 - d / 140) : 0;
          ctx.beginPath();
          ctx.fillStyle = `rgba(111,150,160,${0.13 + f * 0.3})`;
          ctx.arc(
            x + (x - pointer.x) * f * 0.1,
            y + (y - pointer.y) * f * 0.1,
            1 + f * 1.2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
    }
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w;
      c.height = h;
      draw();
    };
    const move = (e) => {
      const r = c.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      draw();
    };
    const leave = () => {
      pointer = { x: -999, y: -999 };
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    c.parentElement.addEventListener("pointermove", move);
    c.parentElement.addEventListener("pointerleave", leave);
    return () => {
      ro.disconnect();
      c.parentElement?.removeEventListener("pointermove", move);
      c.parentElement?.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);
  return <canvas className="field" ref={ref} aria-hidden="true" />;
}
