import React from 'react';

export default function Marquee() {
  const items = [
    'HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'PHP', 'THREE.JS', 'GSAP', 'WEBGL',
    'HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'Laravel', 'THREE.JS', 'GSAP', 'WEBGL'
  ];

  return (
    <div className="marquee">
      <div className="marquee-content">
        {items.map((tech, idx) => (
          <span key={idx}>{tech}</span>
        ))}
        {items.map((tech, idx) => (
          <span key={`dup-${idx}`}>{tech}</span>
        ))}
      </div>
    </div>
  );
}
