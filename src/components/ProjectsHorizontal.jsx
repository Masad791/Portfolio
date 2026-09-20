import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import { VariablePhysicsText, LiquidMetalText } from 'motion-organic/react';
import { MoAudio } from 'motion-organic';
import { useTheme, LIQUID_METAL_PALETTE } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsHorizontal() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeNum, setActiveNum] = useState('01');
  const [activeIndex, setActiveIndex] = useState(0);
  const { isDark } = useTheme();

  // Drag & touch swipe state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);
  const hasDraggedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  useGSAP(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    gsap.set('.project-card', { opacity: 1, y: 0 });

    const getScrollDist = () => {
      const totalW = track.scrollWidth;
      const pad = window.innerWidth * 0.05;
      return -(totalW - window.innerWidth + pad);
    };

    const horizontalTween = gsap.to(track, {
      x: getScrollDist,
      ease: 'none'
    });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () =>
        `+=${Math.max(
          window.innerHeight * 1.6,
          track.scrollWidth - window.innerWidth + 300
        )}`,
      pin: true,
      animation: horizontalTween,
      scrub: 0.8,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (self) => {
        const count = projects.length;
        const index = Math.min(
          count - 1,
          Math.max(0, Math.round(self.progress * (count - 1)))
        );
        setActiveIndex(index);
        setActiveNum(String(index + 1).padStart(2, '0'));
      }
    });

    triggerRef.current = trigger;

    // Refresh ScrollTrigger after any late asset layout shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      trigger.kill();
      horizontalTween.kill();
      triggerRef.current = null;
    };
  }, { scope: sectionRef, dependencies: [projects.length] });

  // Seamless manual navigation jumping to a specific project card
  const goToProject = (index) => {
    const targetIndex = Math.max(0, Math.min(projects.length - 1, index));
    setActiveIndex(targetIndex);
    setActiveNum(String(targetIndex + 1).padStart(2, '0'));

    try {
      MoAudio.play('liquid', { velocity: 0.9, volume: 0.22 });
    } catch {}

    const trigger = triggerRef.current;
    if (trigger) {
      const totalDist = trigger.end - trigger.start;
      if (totalDist > 0) {
        const targetProgress = targetIndex / (projects.length - 1);
        const targetScroll = trigger.start + targetProgress * totalDist;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  };

  // Keyboard navigation when section is in viewport
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.2;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        if (activeIndex < projects.length - 1) {
          e.preventDefault();
          goToProject(activeIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          e.preventDefault();
          goToProject(activeIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // Touch and pointer swipe handlers
  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    touchStartTime.current = Date.now();
    isSwiping.current = false;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (touchStartX.current === 0) return;
    const dx = e.clientX - touchStartX.current;
    const dy = e.clientY - touchStartY.current;

    if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      isSwiping.current = true;
      hasDraggedRef.current = true;
      setIsDraggingState(true);
    }
  };

  const handlePointerUp = (e) => {
    if (touchStartX.current === 0) return;
    if (isSwiping.current) {
      const dx = e.clientX - touchStartX.current;
      const dt = Math.max(1, Date.now() - touchStartTime.current);
      const velocity = dx / dt;

      if (dx < -35 || velocity < -0.3) {
        goToProject(activeIndex + 1);
      } else if (dx > 35 || velocity > 0.3) {
        goToProject(activeIndex - 1);
      }
    }
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
    setIsDraggingState(false);
  };

  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  return (
    <section id="projects" className="projects-horizontal-section" ref={sectionRef}>
      <div className="projects-horizontal-container">
        {/* Header with counter and manual controls */}
        <div className="projects-header-wrapper">
          <div className="container">
            <div className="projects-header">
              <div>
                <span className="section-badge">
                  <VariablePhysicsText color="var(--bh-red)" minWeight={400} maxWeight={900}>
                    // SELECTED WORK
                  </VariablePhysicsText>
                </span>
                <h2>
                  <LiquidMetalText
                    key={`arch-proj-${isDark ? 'dark' : 'light'}`}
                    colors={isDark ? LIQUID_METAL_PALETTE.dark : LIQUID_METAL_PALETTE.light}
                    speed={6}
                  >
                    Architected Projects
                  </LiquidMetalText>
                </h2>
              </div>

              <div className="projects-scroll-indicator">
                <div className="projects-controls-cluster">
                  <span className="hint-text">SLIDE OR SCROLL</span>
                  <span className="projects-counter">
                    <span id="active-project-num">{activeNum}</span> /{' '}
                    {String(projects.length).padStart(2, '0')}
                  </span>
                  <div className="projects-nav-arrows">
                    <button
                      type="button"
                      className="projects-nav-btn"
                      onClick={() => goToProject(activeIndex - 1)}
                      disabled={activeIndex === 0}
                      aria-label="Previous project"
                      title="Previous project"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="projects-nav-btn"
                      onClick={() => goToProject(activeIndex + 1)}
                      disabled={activeIndex === projects.length - 1}
                      aria-label="Next project"
                      title="Next project"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Interactive Project Jump Pills */}
                <div className="projects-pagination-pills" role="tablist" aria-label="Projects list">
                  {projects.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={activeIndex === idx}
                      className={`projects-pill ${activeIndex === idx ? 'active' : ''}`}
                      onClick={() => goToProject(idx)}
                      title={`Jump to ${p.title}`}
                    >
                      <span className="pill-dot" />
                      <span className="pill-label">{p.num}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Track with swipe and drag support */}
        <div
          className={`projects-track-wrapper ${isDraggingState ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClickCapture={handleClickCapture}
        >
          <div className="projects-track" id="projects-track" ref={trackRef}>
            {projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
