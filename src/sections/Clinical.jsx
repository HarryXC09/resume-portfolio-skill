import React, { useRef, useState } from "react";
import Video from "../components/Video";
import { profile } from "../content/profile";
export default function Clinical({ t }) {
  const cards = profile.clinical.cards;
  const [active, set] = useState(0);
  const drag = useRef(null);
  const next = (d) => set((v) => (v + d + cards.length) % cards.length);
  return (
    <section id="clinical" className="clinical section">
      <h2>PROFESSIONAL PRACTICE</h2>
      <p className="section-intro">
        {t(
          ...profile.clinical.intro
        )}
      </p>
      <div
        className="carousel"
        onPointerDown={(e) => {
          if (e.target.closest("button")) return;
          drag.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (drag.current !== null && Math.abs(e.clientX - drag.current) > 45)
            next(e.clientX < drag.current ? 1 : -1);
          drag.current = null;
        }}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            next(-1);
          }
        }}
        tabIndex={0}
        aria-label={t(
          "临床方向，可使用左右方向键或拖动切换",
          "Clinical focus carousel. Use arrow keys or drag.",
        )}
      >
        <button
          className="carousel-prev arrow"
          onClick={() => next(-1)}
          aria-label={t("上一项", "Previous clinical focus")}
        >
          ←
        </button>
        <button
          className="carousel-next arrow"
          onClick={() => next(1)}
          aria-label={t("下一项", "Next clinical focus")}
        >
          →
        </button>
        {cards.map((c, i) => {
          let d = (i - active + cards.length) % cards.length;
          if (d > cards.length / 2) d -= cards.length;
          return (
            <article
              key={c.name}
              className={`clinical-card ${d === 0 ? "current" : ""}`}
              style={{
                "--offset": d,
                "--abs": Math.abs(d),
                opacity: Math.abs(d) > 1 ? 0 : 1,
                visibility: Math.abs(d) > 1 ? "hidden" : "visible",
              }}
              aria-hidden={d !== 0}
            >
              <div className="card-copy">
                <span className="meta">
                  {String(i + 1).padStart(2, "0")} / {c.tag}
                </span>
                <h3>{t(c.zh, c.name)}</h3>
                <p>{t(...c.body)}</p>
              </div>
              <Video
                id={c.video}
                className="clinical-video"
                label="专业工作场景"
              />
              <span className="card-name meta">{c.name}</span>
            </article>
          );
        })}
      </div>
      <div className="carousel-bottom">
        <p className="meta" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
        </p>
        <span className="meta">
          {t("拖动切换 / 使用方向键", "DRAG TO EXPLORE / ARROW KEYS")}
        </span>
      </div>
    </section>
  );
}
