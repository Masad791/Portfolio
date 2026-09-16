import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Hero Entry Animation
    gsap.from('#hero h1', {
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out'
    });

    gsap.from('.hero-meta', {
      y: 20,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });

    // Tech Boxes In/Out scrub
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      onEnter: () =>
        gsap.to('.tech-box', {
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out'
        }),
      onLeaveBack: () =>
        gsap.to('.tech-box', {
          y: 50,
          duration: 0.4,
          stagger: 0.2,
          ease: 'power3.out'
        }),
      onEnterBack: () =>
        gsap.to('.tech-box', {
          y: -50,
          duration: 0.5,
          stagger: 0.2,
          ease: 'power3.out'
        }),
      onLeave: () =>
        gsap.to('.tech-box', {
          y: -50,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.in'
        })
    });
  }, { scope: containerRef });

  return (
    <section id="hero" ref={containerRef}>
      <div className="tech-box tb-tl">
        <h4>PHP</h4>
        <p>// Server Side</p>
      </div>
      <div className="tech-box tb-tr">
        <h4>Javascript</h4>
        <p>// Web Front-end</p>
      </div>
      <div className="tech-box tb-br">
        <h4>Laravel</h4>
        <p>// MVC Framework</p>
      </div>
      <h1>
        Software <br />
        <span className="italic">Engineer</span>
      </h1>
      <div className="hero-meta">
        <span>// V 4.0.1</span>
        <span>SCROLL TO EXPLORE [↓]</span>
        <span>STATUS: AVAILABLE</span>
      </div>
    </section>
  );
}
