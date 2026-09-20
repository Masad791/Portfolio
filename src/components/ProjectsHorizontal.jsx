import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import { VariablePhysicsText, LiquidMetalText } from 'motion-organic/react';
import { useTheme, LIQUID_METAL_PALETTE } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsHorizontal() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeNum, setActiveNum] = useState('01');
  const { isDark } = useTheme();

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
          count,
          Math.max(1, Math.round(self.progress * (count - 1)) + 1)
        );
        setActiveNum(String(index).padStart(2, '0'));
      }
    });

    // Refresh ScrollTrigger after any late asset layout shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      trigger.kill();
      horizontalTween.kill();
    };
  }, { scope: sectionRef, dependencies: [projects.length] });

  return (
    <section id="projects" className="projects-horizontal-section" ref={sectionRef}>
      <div className="projects-horizontal-container">
        {/* Header with counter */}
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
                <span className="hint-text">SCROLL TO EXPLORE [→]</span>
                <span className="projects-counter">
                  <span id="active-project-num">{activeNum}</span> /{' '}
                  {String(projects.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="projects-track-wrapper">
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
