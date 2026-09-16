import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const rows = containerRef.current.querySelectorAll('.skill-row');
    rows.forEach(row => {
      gsap.to(row, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section id="skills" ref={containerRef}>
      <div className="container">
        <div className="skills-header">
          <h2>System Architecture</h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#ab3503f1' }}>
            // The stack that powers the singularity
          </p>
        </div>
        <div className="skills-grid">
          <div>
            <div className="skill-row">
              <h3>Frontend</h3>
              <p>React / Vue</p>
            </div>
            <div className="skill-row meow">
              <h3>Backend</h3>
              <p>PHP / Laravel</p>
            </div>
            <div className="skill-row">
              <h3>Database</h3>
              <p>Postgres / MySql / Redis</p>
            </div>
          </div>
          <div>
            <div className="skill-row">
              <h3>WebGL</h3>
              <p>Three.js / GLSL</p>
            </div>
            <div className="skill-row meow">
              <h3>DevOps</h3>
              <p>Docker</p>
            </div>
            <div className="skill-row">
              <h3>Realtime</h3>
              <p>WebSockets</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
