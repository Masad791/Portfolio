import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profileData';

export default function Footer() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const footerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const footerEl = footerRef.current;
    if (!canvas || !footerEl) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = footerEl.clientHeight || window.innerHeight * 0.45;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const particleCount = 140;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.65),
        radius: Math.random() * 1.5 + 0.6,
        vx: (Math.random() - 0.5) * 0.2,
        vy: Math.random() * 0.35 + 0.15,
        baseSpeed: Math.random() * 0.35 + 0.15,
        alpha: Math.random() * 0.6 + 0.2,
        maxAlpha: Math.random() * 0.4 + 0.5
      });
    }

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bhX = canvas.width / 2;
      const horizonY = canvas.height * 0.72;
      const curveDepth = Math.min(65, canvas.height * 0.2);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        bgGrad.addColorStop(0, 'rgba(10, 10, 11, 0)');
        bgGrad.addColorStop(0.25, 'rgba(10, 10, 11, 0.45)');
        bgGrad.addColorStop(0.6, 'rgba(18, 9, 4, 0.85)');
        bgGrad.addColorStop(0.85, 'rgba(25, 8, 4, 0.96)');
        bgGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      } else {
        bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        bgGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.4)');
        bgGrad.addColorStop(0.6, 'rgba(250, 248, 245, 0.75)');
        bgGrad.addColorStop(0.85, 'rgba(242, 239, 235, 0.9)');
        bgGrad.addColorStop(1, 'rgba(235, 231, 226, 0.98)');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      const glowGrad = ctx.createRadialGradient(
        bhX,
        horizonY,
        0,
        bhX,
        horizonY,
        canvas.width * 0.55
      );
      glowGrad.addColorStop(0, isDark ? 'rgba(242, 57, 11, 0.32)' : 'rgba(255, 74, 28, 0.16)');
      glowGrad.addColorStop(0.35, isDark ? 'rgba(255, 100, 40, 0.1)' : 'rgba(255, 100, 40, 0.05)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, canvas.width, horizonY);

      ctx.globalCompositeOperation = 'source-over';
      particles.forEach((p) => {
        const dx = bhX - p.x;
        const dy = (horizonY - curveDepth * 0.5) - p.y;
        const dist = Math.hypot(dx, dy);

        const pullFactor = Math.min(0.06, 40 / (dist + 200));
        p.vx += (dx / (dist + 1)) * pullFactor;
        p.vy += p.baseSpeed * 0.03;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        if (p.alpha < p.maxAlpha && p.y < horizonY - 60) {
          p.alpha = Math.min(p.maxAlpha, p.alpha + 0.02);
        }

        if (p.y >= horizonY - 40) {
          p.alpha *= 0.91;
        }

        if (p.alpha <= 0.015 || p.y >= horizonY) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * -30;
          p.alpha = 0;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = p.baseSpeed;
        }

        const r = isDark ? 255 : 230;
        const g = isDark ? 85 : 75;
        const b = isDark ? 25 : 30;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const surfaceGrad = ctx.createLinearGradient(
        0,
        horizonY - curveDepth,
        0,
        canvas.height
      );
      if (isDark) {
        surfaceGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        surfaceGrad.addColorStop(0.25, 'rgba(0, 0, 0, 0.45)');
        surfaceGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.95)');
        surfaceGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      } else {
        surfaceGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        surfaceGrad.addColorStop(0.25, 'rgba(235, 230, 225, 0.25)');
        surfaceGrad.addColorStop(0.65, 'rgba(215, 208, 200, 0.65)');
        surfaceGrad.addColorStop(1, 'rgba(195, 188, 180, 0.9)');
      }
      ctx.fillStyle = surfaceGrad;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.quadraticCurveTo(bhX, horizonY - curveDepth, canvas.width, horizonY);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.shadowColor = isDark ? 'rgba(255, 74, 28, 0.5)' : 'rgba(255, 74, 28, 0.3)';
      ctx.shadowBlur = isDark ? 30 : 20;
      ctx.strokeStyle = isDark ? 'rgba(255, 95, 35, 0.4)' : 'rgba(220, 70, 25, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.quadraticCurveTo(bhX, horizonY - curveDepth, canvas.width, horizonY);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-bh" ref={footerRef}>
      <div className="footer-blend-top" />
      <canvas id="footer-canvas" ref={canvasRef} />

      <div className="footer-content">
        <div className="footer-columns-grid">
          {/* Column 1: Headline & Status */}
          <div className="footer-col-left">
            <h2>
              {profileData.footerHeadline.line1} <br />
              <span className="by">{profileData.footerHeadline.highlight}</span>
            </h2>
            <p className="footer-subtag">{profileData.footerHeadline.subtag}</p>
            <div className="footer-status-badge">
              <span className="footer-status-dot" />
              <span>AVAILABLE FOR HIRE & FREELANCE</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col-mid">
            <span className="footer-col-label">/QUICK NAVIGATION</span>
            <div className="footer-nav-list">
              <a href="#hero" className="footer-nav-item" onClick={(e) => scrollToSection(e, 'hero')}>
                <span className="item-num">01 //</span>
                <span>Home</span>
              </a>
              <a href="#skills" className="footer-nav-item" onClick={(e) => scrollToSection(e, 'skills')}>
                <span className="item-num">02 //</span>
                <span>Stack & Architecture</span>
              </a>
              <a href="#projects" className="footer-nav-item" onClick={(e) => scrollToSection(e, 'projects')}>
                <span className="item-num">03 //</span>
                <span>Selected Works</span>
              </a>
              <a href="#contact" className="footer-nav-item" onClick={(e) => scrollToSection(e, 'contact')}>
                <span className="item-num">04 //</span>
                <span>Contact & Inquiries</span>
              </a>
            </div>
          </div>

          {/* Column 3: Direct Reach, WhatsApp, LinkedIn, GitHub */}
          <div className="footer-col-right">
            <span className="footer-col-label">/DIRECT REACH & HIRE</span>

            <a href={profileData.socials.email} className="footer-email-bold" title="Send Email">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>{profileData.email}</span>
            </a>

            <div className="footer-social-channels">
              <a
                href={profileData.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="footer-channel-btn whatsapp"
                aria-label="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32" />
                </svg>
                <span>WhatsApp</span>
              </a>

              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="footer-channel-btn linkedin"
                aria-label="LinkedIn Profile"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="footer-channel-btn github"
                aria-label="GitHub Profile"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>

            <div className="footer-actions">
              <button
                type="button"
                className="back-to-top-btn"
                id="footer-back-to-top"
                onClick={handleBackToTop}
              >
                <span>Back to top</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Meta Bar */}
        <div className="footer-meta-bar">
          <span>© 2026 {profileData.fullName} // ALL RIGHTS RESERVED</span>
          <span>{profileData.established} · {profileData.coordinates}</span>
        </div>
      </div>

      <div className="footer-watermark">{profileData.watermark}</div>
    </footer>
  );
}
