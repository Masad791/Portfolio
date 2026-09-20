import React from 'react';
import { MoPortalLink } from '../context/PortalTransitionContext';

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="card-inner">
        {/* Front Face */}
        <div className="card-front">
          <img src={project.image} alt={project.title} loading="lazy" />
          <div className="card-front-overlay">
            <span className="card-num mo-glitch-text" data-text={`${project.num} //`}>
              {project.num} //
            </span>
            <h3 className="card-project-title">{project.title}</h3>
          </div>
        </div>

        {/* Back Face */}
        <div className="card-back">
          <span className="card-num-back mo-glitch-text" data-text={`PROJECT ${project.num}`}>
            PROJECT {project.num}
          </span>
          <h3 className="card-project-title">{project.title}</h3>
          <p>{project.shortDesc}</p>
          <div className="project-tags">
            {project.stack.map(tag => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <MoPortalLink
            to={`/project/${project.id}`}
            transition={project.transition || 'organic-blob'}
            word={project.transitionWord || project.title}
            className="project-link-btn"
          >
            <span>View Case Study</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </MoPortalLink>
        </div>
      </div>
    </div>
  );
}
