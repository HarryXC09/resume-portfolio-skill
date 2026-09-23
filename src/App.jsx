import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Video from "./components/Video";
import Field from "./components/Field";
import Research from "./sections/Research";
import Clinical from "./sections/Clinical";
import Journey from "./sections/Journey";
import Publication from "./sections/Publication";
import Contact from "./sections/Contact";
import { useReduced } from "./lib/motion";
import { profile } from "./content/profile";
gsap.registerPlugin(ScrollTrigger, useGSAP);
// ScrollTrigger caches the browser restoration mode when its plugin registers.
ScrollTrigger.clearScrollMemory("manual");
export default function App() {
  const [lang, setLang] = useState("zh");
  const reduce = useReduced(),
    root = useRef();
  const t = (zh, en) => (lang === "zh" ? zh : en);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, [lang]);
  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        ({ conditions }) => {
          const mobile = conditions.mobile;
          const paths = gsap.utils.toArray(
            ".hero-signature-path",
            root.current,
          );
          paths.forEach((path) => {
            const length = typeof path.getTotalLength === "function" ? path.getTotalLength() : path.getComputedTextLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              autoAlpha: 0,
            });
          });
          const timeline = gsap.timeline({
            scrollTrigger: {
              id: "hero",
              trigger: ".hero",
              pin: true,
              start: "top top",
              end: mobile ? "+=120%" : "+=200%",
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(
              ".hero-media-clip",
              {
                clipPath: mobile
                  ? "inset(27% 8% 27% 8% round 6px)"
                  : "inset(30% 33% 30% 33% round 6px)",
                duration: 0.88,
                ease: "none",
              },
              0,
            )
            .to(
              ".hero-media-surface",
              { opacity: 1, duration: 0.65, ease: "none" },
              0,
            )
            .to(
              ".hero-media-veil",
              { opacity: 0.14, duration: 0.88, ease: "power2.inOut" },
              0,
            )
            .to(
              ".hero-portrait",
              {
                scale: mobile ? 0.8 : 0.62,
                y: () =>
                  innerHeight * (mobile ? 0.3 : 0.33) -
                  root.current.querySelector(".hero-portrait").offsetTop,
                ease: "none",
                duration: 0.88,
              },
              0,
            )
            .to(".hero-corners", { opacity: 0, y: 18, duration: 0.3 }, 0)
            .fromTo(
              ".hero-end",
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.12 },
              0.88,
            );
          // Reveal the English name as a hand-drawn signature while the hero contracts.
          paths.forEach((path, i) => {
            const start = 0.22 + i * 0.085;
            timeline
              .set(path, { autoAlpha: 1 }, start)
              .to(
                path,
                { strokeDashoffset: 0, duration: 0.13, ease: "none" },
                start,
              );
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduce], revertOnUpdate: true },
  );
  return (
    <div ref={root}>
      <a className="skip" href="#about">
        {t("跳至正文", "Skip to content")}
      </a>
      <header>
        <a
          className="wordmark"
          href="#hero"
          aria-label={`${profile.identity.name} home`}
          onPointerMove={(e) => {
            if (reduce || e.pointerType === "touch") return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.08}px ${(e.clientY - r.top - r.height / 2) * 0.1}px`;
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.translate = "0px 0px";
          }}
        >
          {profile.identity.name}<span>+</span>
        </a>
        <div className="language" aria-label="Language">
          <button aria-pressed={lang === "zh"} onClick={() => setLang("zh")}>
            CN
          </button>
          <span>/</span>
          <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
      </header>
      <main>
        <section id="hero" className="hero">
          <div className="marquees" aria-hidden="true">
            {[
              `${profile.identity.role} · ${profile.identity.name} · `,
              `${profile.identity.focus} · ${profile.identity.focusDetail} · `,
            ].map((s, i) => (
              <div className={`marquee row-${i}`} key={s}>
                <div>
                  {Array.from({ length: 4 }, (_, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h1 className="hero-name">{profile.identity.name}</h1>
          <div className="hero-media-clip">
            <div className="hero-media-surface" />
            <div className="hero-portrait">
              <Video id={profile.media.hero} priority label={profile.identity.displayName} />
            </div>
            <div className="hero-media-veil" />
          </div>
          <div className="hero-corners">
            <div>
              <span className="meta">ROLE</span>
              <strong>{profile.identity.role}</strong>
              <p>{t(`${profile.identity.displayName} / ${profile.identity.roleZh}`, `${profile.identity.name} / ${profile.identity.role}`)}</p>
            </div>
            <div>
              <span className="meta">FOCUS</span>
              <strong>{profile.identity.focus}</strong>
              <p>{profile.identity.focusDetail}</p>
            </div>
          </div>
          <svg
            className="hero-signature"
            viewBox="0 0 1920 1080"
            role="img"
            aria-label={`${profile.identity.name} signature animation`}
          >
            <text className="hero-signature-path" x="960" y="720" textAnchor="middle">{profile.identity.name}</text>
          </svg>
          <p className="hero-end meta">
            {profile.identity.heroTagline}
          </p>
        </section>
        <About t={t} />
        <Clinical t={t} />
        <Journey t={t} />
        <Research t={t} />
        <Publication t={t} />
        <Contact t={t} />
      </main>
      <footer>
        <span>© {profile.identity.name}</span>
        <span>THANK YOU FOR VISITING</span>
      </footer>
    </div>
  );
}
function About({ t }) {
  const [active, setActive] = useState(0), dimensions = profile.about.dimensions;
  return (
    <section id="about" className="about section">
      <Field />
      <h2>ABOUT ME</h2>
      <p className="section-intro">
        {t(...profile.about.intro)}
      </p>
      <div className="about-stage">
        <div className="letter-grid">
          {dimensions.map((_, i) => String(i + 1)).map((l, i) => (
            <button
              key={i}
              className={active === i ? "active" : ""}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={dimensions[i][0]}
              aria-pressed={active === i}
            >
              {l}
            </button>
          ))}
        </div>
        <Video id={profile.media.about} className="about-portrait" label={profile.identity.displayName} />
        <div className="about-detail" aria-live="polite">
          <span className="meta">{dimensions[active][0]}</span>
          <h3>{t(dimensions[active][1], dimensions[active][0])}</h3>
          <p>{t(dimensions[active][2], dimensions[active][3])}</p>
        </div>
      </div>
    </section>
  );
}

