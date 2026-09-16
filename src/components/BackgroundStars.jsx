import React from 'react';

export default function BackgroundStars() {
  return (
    <>
      <svg className="bg-stars" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="star-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.4" />
            <circle cx="80" cy="50" r="0.5" fill="currentColor" opacity="0.3" />
            <circle cx="50" cy="90" r="1.5" fill="currentColor" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#star-pattern)" style={{ color: 'var(--fg)' }} />
      </svg>
      <div className="noise-overlay"></div>
    </>
  );
}
