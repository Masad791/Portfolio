import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projects } from '../data/projectsData';
import { useTheme, LIQUID_METAL_PALETTE } from '../context/ThemeContext';
import { MoPortalLink } from '../context/PortalTransitionContext';
import { LiquidMetalText } from 'motion-organic/react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const currentIndex = projects.findIndex((p) => String(p.id) === String(id));
  const project = projects[currentIndex] || projects[0];

  const nextIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!project) {
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2>Project Not Found</h2>
        <Link to="/" className="project-link-btn" style={{ marginTop: '20px' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Project Detail Navigation Header */}
      <header className="project-detail-nav">
        <MoPortalLink to="/#projects" className="back-btn">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span>Back to Works</span>
        </MoPortalLink>
        <span className="project-nav-center">
          // PROJECT {project.num} OF {String(projects.length).padStart(2, '0')}
        </span>
        <button
          className="theme-toggle"
          id="theme-toggle"
          aria-label="Toggle Dark Mode"
          onClick={toggleTheme}
        >
          {isDark ? (
            <svg
              id="sun-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              id="moon-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </header>

      {/* Main Case Study Content */}
      <main className="container">
        {/* 1. Project Hero */}
        <section className="project-hero">
          <span className="project-hero-badge mo-glitch-text" data-text={project.badge}>{project.badge}</span>
          <h1>
            <LiquidMetalText
              key={`title-${isDark ? 'dark' : 'light'}-${project.id}`}
              colors={isDark ? LIQUID_METAL_PALETTE.dark : LIQUID_METAL_PALETTE.light}
              speed={6}
            >
              {project.title}
            </LiquidMetalText>
          </h1>
          <p className="project-hero-summary">{project.summary}</p>

          {/* Meta Information Cards */}
          <div className="project-meta-grid">
            <div className="meta-card">
              <h5>Role</h5>
              <p>{project.role}</p>
            </div>
            <div className="meta-card">
              <h5>Timeline</h5>
              <p>{project.timeline}</p>
            </div>
            <div className="meta-card">
              <h5>Core Stack</h5>
              <p>{project.stack.join(' · ')}</p>
            </div>
            <div className="meta-card">
              <h5>Status</h5>
              <p>{project.status}</p>
            </div>
          </div>

          {/* Main Visual Showcase */}
          <div className="project-visual-showcase">
            <div className="main-feature-img-wrapper">
              <img src={project.image} alt={`${project.title} Featured Visual`} />
            </div>
          </div>
        </section>

        {/* 2. Case Study: Challenge & Context */}
        {project.challenge && (
          <section className="case-section">
            <div className="case-grid">
              <div className="case-left">
                <h3>{project.challenge.tag}</h3>
                <h2>{project.challenge.title}</h2>
              </div>
              <div className="case-right">
                {project.challenge.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {project.challenge.points && (
                  <ul className="feature-points">
                    {project.challenge.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. Case Study: System Architecture */}
        {project.architecture && (
          <section className="case-section">
            <div className="case-grid">
              <div className="case-left">
                <h3>{project.architecture.tag}</h3>
                <h2>
                  <LiquidMetalText
                    key={`arch-${isDark ? 'dark' : 'light'}-${project.id}`}
                    colors={isDark ? LIQUID_METAL_PALETTE.dark : LIQUID_METAL_PALETTE.light}
                    speed={6}
                  >
                    {project.architecture.title}
                  </LiquidMetalText>
                </h2>
              </div>
              <div className="case-right">
                {project.architecture.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {project.architecture.points && (
                  <ul className="feature-points">
                    {project.architecture.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. Gallery Showcase */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-header">
              <h3>03 // SHOWCASE</h3>
              <h2>Visual Records & Interfaces</h2>
            </div>
            <div className="gallery-grid">
              {project.gallery.map((item, i) => (
                <div className="gallery-item" key={i}>
                  <img src={item.src} alt={`Showcase visual ${i + 1}`} loading="lazy" />
                  <div className="gallery-item-caption">{item.caption}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Measured Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <section className="metrics-section">
            <div className="metrics-grid">
              {project.metrics.map((m, i) => (
                <div className="metric-box" key={i}>
                  <div className="number">{m.number}</div>
                  <div className="label">{m.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Next Project Bar */}
      {nextProject && (
        <div className="next-project-bar">
          <div className="container">
            <MoPortalLink
              to={`/project/${nextProject.id}`}
              transition={nextProject.transition || 'organic-blob'}
              word={nextProject.transitionWord || nextProject.title}
              className="next-project-link"
            >
              <span className="sublabel mo-aurora-text">// NEXT CASE STUDY</span>
              <h2>
                {nextProject.title} <span>→</span>
              </h2>
            </MoPortalLink>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="minimal-page-footer">
        <div className="container page-footer-content">
          <span>© 2026 Muhammad Asad // Software Engineer</span>
          <a href="mailto:muhammadasaddev31@gmail.com">muhammadasaddev31@gmail.com</a>
          <Link to="/">Return to Home [↑]</Link>
        </div>
      </footer>
    </>
  );
}
