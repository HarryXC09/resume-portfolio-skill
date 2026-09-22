import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Video from "../components/Video";
import { useReduced } from "../lib/motion";
import { profile } from "../content/profile";
export default function Contact({ t }) {
  const ref = useRef(),
    reduce = useReduced();
  useGSAP(
    () => {
      if (reduce) return;
      gsap.to(".tile", {
        scaleY: 0,
        transformOrigin: "top",
        stagger: { each: 0.018, from: "random" },
        duration: 0.65,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".contact-films",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [reduce], revertOnUpdate: true },
  );
  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="contact-films">
        {profile.media.contact.map((id, i) => (
          <div className="contact-film" key={id}>
            <span aria-hidden="true">{i === 0 ? "RESEARCH" : "PRACTICE"}</span>
            <Video
              id={id}
              label={t(
                i === 0 ? "显微镜研究场景" : "书写工作场景",
                i === 0 ? "Microscope research scene" : "Writing at a desk",
              )}
            />
            <div className="tiles" aria-hidden="true">
              {Array.from({ length: 24 }, (_, j) => (
                <i className="tile" key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="contact-body">
        <h2>
          LET’S
          <br />
          CONNECT.
        </h2>
        <div className="contact-links">
          {profile.contact.email && <a className="email-link" href={`mailto:${profile.contact.email}`}>
            <span className="meta">EMAIL</span>
            <span>
              {profile.contact.email} <b aria-hidden="true">↗</b>
            </span>
          </a>}
          {profile.contact.wechat && <div className="wechat-contact">
            <span className="meta">Wechat</span>
          <span>{profile.contact.wechat}</span>
          </div>}
        </div>
      </div>
    </section>
  );
}
