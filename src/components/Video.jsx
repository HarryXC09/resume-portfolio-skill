import { useEffect, useRef, useState } from "react";
import { asset, useReduced } from "../lib/motion";
export default function Video({
  id,
  priority = false,
  className = "",
  label = "",
}) {
  const ref = useRef(null),
    reduce = useReduced();
  const inView = useRef(false);
  const [loaded, setLoaded] = useState(priority),
    [failed, setFailed] = useState(false),
    [playing, setPlaying] = useState(false);
  const n = String(id).padStart(2, "0");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setLoaded(true);
      },
      { rootMargin: "400px" },
    );
    near.observe(el);
    const visible = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (e.isIntersecting && !reduce && !document.hidden)
        el.play().catch(() => {});
      else el.pause();
    });
    visible.observe(el);
    const visibility = () => {
      if (document.hidden) el.pause();
      else if (inView.current && !reduce) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      near.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduce, loaded]);
  return (
    <div className={`video ${className}`}>
      <img
        src={asset(`posters/poster-${n}.webp`)}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = asset("placeholder.svg"); }}
        alt={label}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        style={{
          visibility: playing && !failed && !reduce ? "hidden" : "visible",
        }}
      />
      <video
        ref={ref}
        src={
          loaded && !reduce && !failed
            ? asset(`videos/doctor-idle-${n}.webm`)
            : undefined
        }
        muted
        loop
        playsInline
        onLoadedData={() => {
          if (inView.current && !reduce && !document.hidden)
            ref.current.play().catch(() => {});
          else ref.current.pause();
        }}
        preload={priority ? "auto" : "none"}
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        onError={() => setFailed(true)}
        style={{ visibility: failed || reduce ? "hidden" : "visible" }}
      />
    </div>
  );
}
