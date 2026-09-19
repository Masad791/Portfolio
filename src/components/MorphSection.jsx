import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { profileData } from '../data/profileData';

gsap.registerPlugin(ScrollTrigger);

export default function MorphSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    });

    // 1. Simultaneous Cross-fade Morph Blend:
    // Both image and text animate together from the very start (time 0)
    // creating a seamless, cinematic dissolve between the photo and typography.
    tl.to(
      '#dev-image',
      {
        scale: 0.88,
        opacity: 0,
        duration: 1.5,
        ease: 'power1.inOut'
      },
      0
    );

    tl.fromTo(
      '#dev-text',
      {
        opacity: 0,
        scale: 0.85
      },
      {
        opacity: 1,
        scale: 1.2,
        duration: 1.5,
        ease: 'power1.inOut'
      },
      0
    );

    // 2. Hold Phase:
    // Once the morph blend finishes (image reaches 0% and text reaches 100%),
    // keep the text fully visible and hold the state before un-sticking.
    tl.to({}, { duration: 0.6 });

    return () => {
      tl.kill();
    };
  }, { scope: containerRef });

  return (
    <section id="morph-section" ref={containerRef}>
      <div className="morph-wrapper">
        <img src={profileData.morphImage} id="dev-image" alt={profileData.name} />
        <h2 id="dev-text">{profileData.name}</h2>
      </div>
    </section>
  );
}
