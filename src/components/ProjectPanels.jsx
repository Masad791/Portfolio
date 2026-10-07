import React, { useState } from 'react';
import { projects as allProjects } from '../data/projectsData';
import { MoPortalLink } from '../context/PortalTransitionContext';

// Featured projects get their own stacked section; these panels show the rest.
const projects = allProjects.filter((p) => !p.featured);

export default function ProjectPanels() {
  const [active, setActive] = useState(0);

  return (
    <section id="more-work" className="panels-section">
      <div className="container">
        <div className="panels-head">
          <div>
            <span className="section-badge">// MORE WORK</span>
            <h2>More Projects</h2>
          </div>
          <p>Hover or tap a panel to open it.</p>
        </div>

        <div className="panels">
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
                <div className="panel-shade" />
                <span className="panel-spine" aria-hidden={open}>{p.title}</span>
                <div className="panel-body" aria-hidden={!open}>
                  <span className="panel-num">{p.num}</span>
                  <h3>{p.title}</h3>
                  <p>{p.shortDesc}</p>
                  <div className="panel-meta">
                    <span>{p.stack.slice(0, 3).join(' · ')}</span>
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
