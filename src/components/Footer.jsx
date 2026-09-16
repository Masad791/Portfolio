import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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

    // Initialize flowing particles evenly across the canvas
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

      // 1. Seamless top gradient blending into the page background
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

      // 2. Accretion disc glow at horizon center
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

      // 3. Fluid particle drift with graceful horizon gravity
      ctx.globalCompositeOperation = 'source-over';

      particles.forEach((p) => {
        // Gravitational pull toward center horizon
        const dx = bhX - p.x;
        const dy = (horizonY - curveDepth * 0.5) - p.y;
        const dist = Math.hypot(dx, dy);

        // Smooth guidance across the entire width so particles never freeze
        const pullFactor = Math.min(0.06, 40 / (dist + 200));
        p.vx += (dx / (dist + 1)) * pullFactor;
        p.vy += p.baseSpeed * 0.03;

        // Damping for fluid inertia
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Smooth fade-in at top
        if (p.alpha < p.maxAlpha && p.y < horizonY - 60) {
          p.alpha = Math.min(p.maxAlpha, p.alpha + 0.02);
        }

        // Dissolve seamlessly as particle approaches the curved horizon
        if (p.y >= horizonY - 40) {
          p.alpha *= 0.91;
        }

        // Respawn particle at top once fully dissolved or below horizon
        if (p.alpha <= 0.015 || p.y >= horizonY) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * -30;
          p.alpha = 0;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = p.baseSpeed;
        }

        // Draw particle
        const r = isDark ? 255 : 230;
        const g = isDark ? 85 : 75;
        const b = isDark ? 25 : 30;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Curved event horizon surface
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

      // 5. Horizon rim glow line
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
          {/* Column 1: Headline */}
          <div className="footer-col-left">
            <h2>
              Scaling Start-ups <br />
              <span className="by">for Growth.</span>
            </h2>
            <p className="footer-subtag">// Engineered with Precision & Speed</p>
          </div>

          {/* Column 2: Navigation shortcuts */}
          <div className="footer-col-mid">
            <span className="footer-col-label">/Quick links</span>
            <div className="footer-quick-pills">
              <a
                href="#hero"
                className="quick-pill"
                onClick={(e) => scrollToSection(e, 'hero')}
              >
                Home
              </a>
              <a
                href="#skills"
                className="quick-pill"
                onClick={(e) => scrollToSection(e, 'skills')}
              >
                Stack
              </a>
              <a
                href="#projects"
                className="quick-pill"
                onClick={(e) => scrollToSection(e, 'projects')}
              >
                Works
              </a>
              <a
                href="#contact"
                className="quick-pill"
                onClick={(e) => scrollToSection(e, 'contact')}
              >
                Contact
              </a>
            </div>
          </div>

          {/* Column 3: Contact & Back to Top */}
          <div className="footer-col-right">
            <span className="footer-col-label">/Contact</span>
            <a
              href="mailto:muhammadasaddev31@gmail.com"
              className="footer-email-link"
            >
              muhammadasaddev31@gmail.com
            </a>
            <div className="footer-actions">
              <button
                type="button"
                className="back-to-top-btn"
                id="footer-back-to-top"
                onClick={handleBackToTop}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Back to top [↑]
              </button>
            </div>
          </div>
        </div>

        <div className="footer-meta-bar" />
      </div>

      {/* Giant MAD Watermark (75% visible, 25% negative bottom) */}
      <div className="footer-watermark">MAD</div>
    </footer>
  );
}
