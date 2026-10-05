import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LiquidMetalText } from 'motion-organic/react';
import { projects } from '../data/projectsData';
import { MoPortalLink } from '../context/PortalTransitionContext';
import { useTheme, LIQUID_METAL_PALETTE } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const featured = projects.filter((p) => p.featured);

export default function FeaturedWork() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = gsap.utils.toArray('.feature-card');

    cards.forEach((card, i) => {
      // Image drifts a little inside its frame while the card is on screen.
      gsap.fromTo(card.querySelector('.feature-media img'), { yPercent: -6 }, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      if (i === cards.length - 1) return;
      // Sticky stack: pin each card, then shrink and dim it while the next one slides over.
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        endTrigger: cards[cards.length - 1],
        end: 'top top',
        pin: true,
        pinSpacing: false,
      });
      const recede = { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true };
      gsap.to(card.querySelector('.feature-inner'), { scale: 0.9, ease: 'none', scrollTrigger: recede });
      // Fade a solid shade over the card (not the card itself) so cards never show through each other.
      gsap.to(card.querySelector('.feature-shade'), { opacity: 0.7, ease: 'none', scrollTrigger: recede });
    });
  }, { scope: containerRef });

  return (
    <section id="projects" className="featured-section" ref={containerRef}>
      <div className="container featured-header">
        <span className="section-badge">// SELECTED WORK</span>
        <h2>
          <LiquidMetalText
            key={`featured-${isDark ? 'dark' : 'light'}`}
            colors={isDark ? LIQUID_METAL_PALETTE.dark : LIQUID_METAL_PALETTE.light}
            speed={6}
          >
            Featured Work
          </LiquidMetalText>
        </h2>
      </div>

      {featured.map((p) => (
        <article className="feature-card" key={p.id} style={{ '--card-accent': p.accent }}>
          <div className="feature-inner">
            <div className="feature-copy">
              <span className="feature-num">{p.num}</span>
              <h3>{p.title}</h3>
              <p className="feature-badge">{p.badge}</p>
              <p className="feature-desc">{p.shortDesc}</p>
              <ul className="feature-facts">
                {p.metrics.slice(0, 3).map((m) => (
                  <li key={m.label}>
                    <strong>{m.number}</strong>
                    <span>{m.label}</span>
                  </li>
                ))}
              </ul>
              <div className="project-tags">
                {p.stack.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="feature-actions">
                <MoPortalLink
                  to={`/project/${p.id}`}
                  transition={p.transition}
                  word={p.transitionWord || p.title}
                  className="project-link-btn"
                >
                  <span>Case Study</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </MoPortalLink>
                {p.github && (
                  <a className="feature-ghost-btn" href={p.github} target="_blank" rel="noopener noreferrer">
                    Source on GitHub
                  </a>
                )}
              </div>
            </div>
            <div className="feature-media">
              <img src={p.image} alt={`${p.title} preview`} loading="lazy" />
            </div>
            <div className="feature-shade" aria-hidden="true" />
          </div>
        </article>
      ))}
    </section>
  );
}
