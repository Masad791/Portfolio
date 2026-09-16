import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('hero');
  const [timeStr, setTimeStr] = useState('');
  const indicatorRef = useRef(null);
  const navLinksRef = useRef({});

  // Clock in Karachi timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const datePart = now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          timeZone: 'Asia/Karachi'
        });
        const timePart = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi'
        });
        setTimeStr(`${datePart} // ${timePart}`);
      } catch {
        setTimeStr(now.toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update sliding indicator position
  const moveIndicator = (targetKey, isClick = false) => {
    setActiveSection(targetKey);
    const targetEl = navLinksRef.current[targetKey];
    const indicator = indicatorRef.current;
    if (!targetEl || !indicator) return;

    gsap.to(indicator, {
      x: targetEl.offsetLeft,
      width: targetEl.offsetWidth,
      duration: 0.4,
      ease: 'power3.out',
      onComplete: () => {
        if (isClick) {
          gsap.fromTo(
            indicator,
            { x: targetEl.offsetLeft - 4 },
            { x: targetEl.offsetLeft, duration: 0.08, yoyo: true, repeat: 3 }
          );
        }
      }
    });
  };

  useEffect(() => {
    // Position indicator initially
    const timer = setTimeout(() => {
      moveIndicator(activeSection, false);
    }, 150);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    moveIndicator(sectionId, true);

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div className="side-detail side-left">EST. 2026 // LAT 29.3957° N</div>
      <div className="side-detail side-right" id="time-date">
        {timeStr || 'LOADING...'}
      </div>

      <nav id="main-nav">
        <div className="nav-links">
          <div id="nav-indicator" ref={indicatorRef} />
          
          <a
            href="#hero"
            ref={el => (navLinksRef.current['hero'] = el)}
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            data-target="hero"
            onClick={e => handleNavClick(e, 'hero')}
          >
            <span>Index</span>
            <span>Home</span>
          </a>

          <a
            href="#skills"
            ref={el => (navLinksRef.current['skills'] = el)}
            className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
            data-target="skills"
            onClick={e => handleNavClick(e, 'skills')}
          >
            <span>Stack</span>
            <span>Stack</span>
          </a>

          <a
            href="#projects"
            ref={el => (navLinksRef.current['projects'] = el)}
            className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
            data-target="projects"
            onClick={e => handleNavClick(e, 'projects')}
          >
            <span>Work</span>
            <span>Work</span>
          </a>

          <a
            href="#contact"
            ref={el => (navLinksRef.current['contact'] = el)}
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            data-target="contact"
            onClick={e => handleNavClick(e, 'contact')}
          >
            <span>Hire</span>
            <span>Hire</span>
          </a>
        </div>

        <button
          className="theme-toggle"
          id="theme-toggle"
          aria-label="Toggle Dark Mode"
          onClick={toggleTheme}
        >
          {isDark ? (
            <svg
              id="sun-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              id="moon-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </nav>
    </>
  );
}
