import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReduced, asset } from "../lib/motion";
import JourneyIcon from "../components/JourneyIcon";
import { profile } from "../content/profile";
export default function Journey({ t }) {
  const entries = profile.journey.entries;
  const ref = useRef(),
    reduce = useReduced();
  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width:768px)", () => {
        const cards = gsap.utils.toArray(".journey-card", ref.current);
        cards.slice(0, -1).forEach((c, i) =>
          gsap.to(c, {
            scale: 0.94,
            y: -10,
            opacity: 0.82,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 440px",
              end: "top 120px",
              scrub: true,
            },
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [reduce], revertOnUpdate: true },
  );
  return (
    <section id="journey" className="journey section" ref={ref}>
      <h2>THE JOURNEY</h2>
      <p className="section-intro">
        {t(
          ...profile.journey.intro
        )}
      </p>
      <div className="journey-stack">
        {entries.map((e, i) => (
          <article
            className={`journey-card journey-${i}`}
            key={e[1]}
            style={{ "--i": i }}
          >
            <div className="journey-top meta">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{e[0]}</span>
            </div>
            <div className="journey-main">
              <div>
                <h3>{e[1]}</h3>
                <h4>
                  {t(e[2], e[1])}
                </h4>
                <p>{t(e[3], e[4])}</p>
              </div>
              {e[5] ? (
                <img src={asset("logos/" + e[5])} alt={e[2]} loading="lazy" />
              ) : (
                <JourneyIcon type={i} />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
