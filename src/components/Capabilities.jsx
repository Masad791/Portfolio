import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Capabilities() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const items = containerRef.current.querySelectorAll('.cap-item');
    items.forEach(item => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section id="capabilities" ref={containerRef}>
      <div className="container">
        <div className="caps-grid">
          <div className="cap-item">
            <h4>// 01. Design & Motion</h4>
            <h3>Immersive Interfaces</h3>
            <p>
              Crafting dimensional web experiences using GSAP, Three.js, and pixel-perfect CSS.
              Bridging the gap between functionality and high-end art.
            </p>
          </div>
          <div className="cap-item">
            <h4>// 02. Scalable Infrastructure</h4>
            <h3>Distributed Systems</h3>
            <p>
              Deploying resilient backends with Docker and Kubernetes. Capable of handling
              50k+ concurrent connections with zero downtime.
            </p>
          </div>
          <div className="cap-item">
            <h4>// 03. Data & State</h4>
            <h3>Event-Driven Logic</h3>
            <p>
              Architecting normalized databases and realtime state management. Ensuring
              data consistency across the entire event horizon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
