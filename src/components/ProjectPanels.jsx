import React, { useEffect, useRef, useState } from 'react';
import { projects as allProjects } from '../data/projectsData';
import { MoPortalLink } from '../context/PortalTransitionContext';

// Featured projects get their own stacked section; these panels show the rest.
const projects = allProjects.filter((p) => !p.featured);

const ADVANCE_MS = 5000;

export default function ProjectPanels() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Only run the auto-advance while the section is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const next = () => setActive((i) => (i + 1) % projects.length);

  return (
    <section id="more-work" className="panels-section" ref={sectionRef}>
      <div className="container">
        <div className="panels-head">
          <div>
            <span className="section-badge">// MORE WORK</span>
            <h2>More Projects</h2>
          </div>
          <p>Opens the next one every 5 s. Hover or tap to pick.</p>
        </div>

        <div className={`panels${inView ? ' is-running' : ''}`} style={{ '--advance': `${ADVANCE_MS}ms` }}>
          {projects.map((p, i) => {
            const open = i === active;
            return (
              <div
                key={p.id}
                className={`panel${open ? ' is-open' : ''}`}
                tabIndex={open ? -1 : 0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <img src={p.image} alt={`${p.title} preview`} loading="lazy" draggable="false" />
                {p.video && open && (
                  // Mounted only while open, so the clip never downloads or plays for closed panels.
                  <video src={p.video} poster={p.image} autoPlay muted loop playsInline aria-hidden="true" />
                )}
                <div className="panel-shade" />
                {open && (
                  // The line is the timer: when its 5 s fill finishes, the next project opens.
                  <span className="panel-progress" key={p.id} onAnimationEnd={next} aria-hidden="true" />
                )}
                <span className="panel-spine" aria-hidden={open}>{p.title}</span>
                <div className="panel-body" aria-hidden={!open}>
                  <span className="panel-num">{p.num}</span>
                  <h3>{p.title}</h3>
                  <p>{p.shortDesc}</p>
                  <div className="panel-meta">
                    <span>{p.stack.slice(0, 3).join(' · ')}</span>
                    {open && p.live && (
                      <a className="panel-link panel-link-ghost" href={p.live} target="_blank" rel="noopener noreferrer">
                        Live ↗
                      </a>
                    )}
                    {open && (
                      <MoPortalLink
                        to={`/project/${p.id}`}
                        transition={p.transition}
                        word={p.transitionWord || p.title}
                        className="panel-link"
                      >
                        Case study →
                      </MoPortalLink>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
