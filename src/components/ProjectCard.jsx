import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="card-inner">
        {/* Front Face */}
        <div className="card-front">
          <img src={project.image} alt={project.title} loading="lazy" />
          <div className="card-front-overlay">
            <span className="card-num">{project.num} //</span>
            <h3>{project.title}</h3>
          </div>
        </div>

        {/* Back Face */}
        <div className="card-back">
          <span className="card-num-back">PROJECT {project.num}</span>
          <h3>{project.title}</h3>
          <p>{project.shortDesc}</p>
          <div className="project-tags">
            {project.stack.map(tag => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <Link to={`/project/${project.id}`} className="project-link-btn">
            <span>View Case Study</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
