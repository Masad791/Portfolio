import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profileData';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('hero');
  const [timeStr, setTimeStr] = useState('');
  const indicatorRef = useRef(null);
  const navLinksRef = useRef({});
  const activeSectionRef = useRef('hero');
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  // Liquid-glass morph: the bar shrinks into a 3-dot droplet on scroll down.
  const navRef = useRef(null);
  const innerRef = useRef(null);
  const dotsRef = useRef(null);
  const rippleRef = useRef(null);
  const collapsedRef = useRef(false);
  const morphRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [canRefract] = useState(() => !!navigator.userAgentData?.brands?.some((b) => b.brand === 'Chromium'));

  // Keep activeSectionRef synced
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

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
      duration: isClick ? 0.4 : 0.35,
      ease: isClick ? 'power3.out' : 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        if (isClick) {
          gsap.fromTo(
            indicator,
            { x: targetEl.offsetLeft - 3 },
            { x: targetEl.offsetLeft, duration: 0.08, yoyo: true, repeat: 2 }
          );
        }
      }
    });
  };

  // Initial positioning of indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      moveIndicator(activeSectionRef.current, false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate indicator position on window resize
  useEffect(() => {
    const handleResize = () => {
      const targetEl = navLinksRef.current[activeSectionRef.current];
      const indicator = indicatorRef.current;
      if (targetEl && indicator) {
        gsap.set(indicator, {
          x: targetEl.offsetLeft,
          width: targetEl.offsetWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll spy: Track current section on scroll and move nav indicator
  useEffect(() => {
    if (location.pathname !== '/') return;

    let triggers = [];

    const initScrollSpy = () => {
      triggers.forEach((t) => t.kill());
      triggers = [];

      const heroEl = document.getElementById('hero');
      const skillsEl = document.getElementById('skills');
      const projectsEl = document.getElementById('projects');
      const contactEl = document.getElementById('contact');

      if (!heroEl || !skillsEl || !projectsEl || !contactEl) return;

      // 1. Hero / Index
      triggers.push(
        ScrollTrigger.create({
          trigger: heroEl,
          start: 'top top-=200',
          endTrigger: skillsEl,
          end: 'top 50%',
          onEnter: () => {
            if (!isClickingRef.current) moveIndicator('hero');
          },
          onEnterBack: () => {
            if (!isClickingRef.current) moveIndicator('hero');
          }
        })
      );

      // 2. Stack / Skills
      triggers.push(
        ScrollTrigger.create({
          trigger: skillsEl,
          start: 'top 50%',
          endTrigger: projectsEl,
          end: 'top 50%',
          onEnter: () => {
            if (!isClickingRef.current) moveIndicator('skills');
          },
          onEnterBack: () => {
            if (!isClickingRef.current) moveIndicator('skills');
          }
        })
      );

      // 3. Work / Projects (active throughout horizontal scroll pin)
      triggers.push(
        ScrollTrigger.create({
          trigger: projectsEl,
          start: 'top 50%',
          endTrigger: contactEl,
          end: 'top 50%',
          onEnter: () => {
            if (!isClickingRef.current) moveIndicator('projects');
          },
          onEnterBack: () => {
            if (!isClickingRef.current) moveIndicator('projects');
          }
        })
      );

      // 4. Hire / Contact (active through form section and canvas footer)
      triggers.push(
        ScrollTrigger.create({
          trigger: contactEl,
          start: 'top 50%',
          end: 'max',
          onEnter: () => {
            if (!isClickingRef.current) moveIndicator('contact');
          },
          onEnterBack: () => {
            if (!isClickingRef.current) moveIndicator('contact');
          }
        })
      );

      // Set initial active state based on current scroll position
      const scrollY = window.scrollY;
      if (scrollY < 80) {
        moveIndicator('hero');
      } else if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        moveIndicator('contact');
      } else {
        for (const t of triggers) {
          if (t.isActive) {
            const sec =
              t.trigger === heroEl
                ? 'hero'
                : t.trigger === skillsEl
                ? 'skills'
                : t.trigger === projectsEl
                ? 'projects'
                : 'contact';
            moveIndicator(sec);
            break;
          }
        }
      }
    };

    const timer = setTimeout(initScrollSpy, 300);

    // Passive scroll listener for extreme top and bottom edges
    const handleScrollEdges = () => {
      if (isClickingRef.current) return;
      if (window.scrollY < 60) {
        if (activeSectionRef.current !== 'hero') {
          moveIndicator('hero');
        }
      } else if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 30
      ) {
        if (activeSectionRef.current !== 'contact') {
          moveIndicator('contact');
        }
      }
    };

    window.addEventListener('scroll', handleScrollEdges, { passive: true });

    return () => {
      clearTimeout(timer);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      window.removeEventListener('scroll', handleScrollEdges);
      triggers.forEach((t) => t.kill());
    };
  }, [location.pathname]);

  const morph = (toCollapsed, instant = false) => {
    const nav = navRef.current, inner = innerRef.current, dots = dotsRef.current;
    if (!nav || collapsedRef.current === toCollapsed) return;
    collapsedRef.current = toCollapsed;
    setCollapsed(toCollapsed);
    inner.inert = toCollapsed; // keep hidden links out of the tab order

    const cs = getComputedStyle(nav);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const full = { width: inner.offsetWidth + padX + 2, height: inner.offsetHeight + padY + 2 };
    const pill = { width: 64, height: 42 };
    const reduce = instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    morphRef.current?.kill();
    const tl = gsap.timeline({
      onComplete: () => { if (!toCollapsed) gsap.set(nav, { clearProps: 'width,height' }); },
    });
    morphRef.current = tl;
    if (reduce) tl.timeScale(20);

    const from = { width: nav.offsetWidth, height: nav.offsetHeight };
    const to = toCollapsed ? pill : full;

    if (toCollapsed) {
      tl.to(inner, { opacity: 0, scale: 0.9, filter: 'blur(6px)', duration: 0.2, ease: 'power2.in' }, 0)
        .fromTo(nav, from, { ...to, duration: 1.1, ease: 'elastic.out(1, 0.55)' }, 0.06)
        .fromTo(dots, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.6)' }, 0.32)
        .fromTo(dots.children, { y: 0 }, { y: -4, duration: 0.16, ease: 'sine.out', yoyo: true, repeat: 1, stagger: 0.06 }, 0.5);
    } else {
      tl.to(dots, { opacity: 0, scale: 0.4, duration: 0.18, ease: 'power2.in' }, 0)
        .fromTo(nav, from, { ...to, duration: 1, ease: 'elastic.out(1, 0.65)' }, 0.04)
        .fromTo(inner, { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out', clearProps: 'filter,scale' }, 0.18);
    }
    // Droplet squash: wide and flat on impact, then springs back.
    tl.fromTo(nav, { scaleX: 1, scaleY: 1 },
      { keyframes: [{ scaleX: 1.08, scaleY: 0.86, duration: 0.14, ease: 'power2.out' },
                    { scaleX: 0.97, scaleY: 1.05, duration: 0.18, ease: 'sine.inOut' },
                    { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }] }, 0.06);
    // Ripple the refraction while the glass moves, then let it settle.
    if (rippleRef.current) {
      tl.fromTo(rippleRef.current, { attr: { scale: 6 } },
        { keyframes: [{ attr: { scale: 38 }, duration: 0.18, ease: 'power2.out' },
                      { attr: { scale: 6 }, duration: 0.9, ease: 'power2.out' }] }, 0.04);
    }
  };

  const openMenu = () => morph(false);

  // Full bar only at the very top (the hero). Anywhere else, any scroll closes it,
  // including after it was opened from the droplet.
  useEffect(() => {
    const TOP = 60;
    let lastY = window.scrollY;
    if (lastY >= TOP) morph(true, true);

    const onScroll = () => {
      const y = window.scrollY;
      if (y < TOP) morph(false);
      else if (Math.abs(y - lastY) > 2) morph(true);
      lastY = y;
    };
    const closeIfOutside = (e) => {
      if (!collapsedRef.current && window.scrollY >= TOP && !navRef.current?.contains(e.target)) morph(true);
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && window.scrollY >= TOP) morph(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', closeIfOutside);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', closeIfOutside);
      window.removeEventListener('keydown', onKey);
      morphRef.current?.kill();
    };
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 1000);

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
      <div className="side-detail side-left">
        {profileData.established} // {profileData.coordinates}
      </div>
      <div className="side-detail side-right" id="time-date">
        {timeStr || 'LOADING...'}
      </div>

      {/* Refraction for the glass: low-frequency noise bends what's behind the nav. */}
      <svg className="nav-filter-defs" aria-hidden="true" focusable="false">
        <filter id="nav-liquid" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap ref={rippleRef} in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <nav id="main-nav" ref={navRef} className={`${collapsed ? 'is-collapsed' : ''} ${canRefract ? 'can-refract' : ''}`.trim()}>
        <div className="nav-inner" ref={innerRef} aria-hidden={collapsed}>
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
        </div>

        <button
          type="button"
          className="nav-dots"
          ref={dotsRef}
          aria-label="Open navigation"
          aria-expanded={!collapsed}
          tabIndex={collapsed ? 0 : -1}
          onClick={openMenu}
        >
          <i /><i /><i />
        </button>
      </nav>
    </>
  );
}
