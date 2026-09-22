import React, { useEffect, useRef, useState } from "react";
import { useReduced } from "../lib/motion";
import { profile } from "../content/profile";
export default function Research({ t }) {
  const ref = useRef(),
    canvas = useRef(),
    reduce = useReduced();
  const [status, setStatus] = useState("waiting");
  useEffect(() => {
    let cleanup,
      cancelled = false;
    const el = ref.current;
    const near = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        setStatus("loading");
        try {
          const { mountCell } = await import("../lib/cell");
          if (cancelled) return;
          cleanup = await mountCell(canvas.current, el, reduce, () => {
            if (!cancelled) setStatus("ready");
          });
          if (cancelled) cleanup?.();
        } catch {
          if (!cancelled) setStatus("error");
        }
      },
      { rootMargin: "600px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      cleanup?.();
    };
  }, [reduce]);
  return (
    <section id="research" className="research" ref={ref}>
      <div className="research-copy">
        <span className="meta">RESEARCH FOCUS</span>
        <h2>
          THE WORLD
          <br />
          WITHIN.
        </h2>
        <div className="research-topics">
          {profile.research.topics.map(([en, zh, enBody]) => <React.Fragment key={en}><h3>{en.split("\n").map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h3><p>{t(zh, enBody)}</p></React.Fragment>)}
        </div>
      </div>
      <div className="cell-space">
        <canvas
          ref={canvas}
          role="img"
          aria-label={t(
            "可拖动旋转的肿瘤细胞三维示意模型",
            "Interactive illustrative tumor cell model",
          )}
          tabIndex={0}
        />
        {status !== "ready" && (
          <p className="model-status">
            {status === "error"
              ? t(
                  "三维影像暂不可用，研究内容仍可阅读。",
                  "3D image unavailable. Research information remains available.",
                )
              : t("正在准备微观视角…", "Preparing a closer look…")}
          </p>
        )}
        <span className="cell-caption meta">
          {t(
            "肿瘤细胞示意 / 拖动探索",
            "ILLUSTRATIVE TUMOR CELL / DRAG TO EXPLORE",
          )}
        </span>
      </div>
      <span className="research-foot meta">
        CLINICAL QUESTIONS, MICROSCOPIC PERSPECTIVES.
      </span>
    </section>
  );
}
