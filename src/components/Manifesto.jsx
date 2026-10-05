import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Words wrapped in *asterisks* get the accent color.
const TEXT =
  'I build *backends* that hold up under real users and *interfaces* people remember. Lately that means *AI voice conversion* on a laptop CPU, a *Chrome extension* that lives on every page, and a permission-first *finance API*.';

// Split into words, tracking whether each one sits inside an *accent* run.
let inAccent = false;
const WORDS = TEXT.split(' ').map((w) => {
  const starts = w.startsWith('*');
  if (starts) inAccent = true;
  const word = { text: w.replace(/\*/g, ''), accent: inAccent };
  if (w.replace(/[.,]$/, '').endsWith('*')) inAccent = false;
  return word;
});

export default function Manifesto() {
  const ref = useRef(null);

  useGSAP(() => {
    const words = ref.current.querySelectorAll('.mf-word');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(words, { opacity: 1 });
      return;
    }
    // Pinned read: each word lights up as you scroll, so the sentence is read at scroll speed.
    gsap.fromTo(words, { opacity: 0.12 }, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.6,
      },
    });
  }, { scope: ref });

  return (
    <section id="manifesto" className="manifesto-section" ref={ref}>
      <p className="manifesto-text container">
        {WORDS.map((w, i) => (
          <span key={i} className={`mf-word${w.accent ? ' mf-accent' : ''}`}>
            {w.text}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
