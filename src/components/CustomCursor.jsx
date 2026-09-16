import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const cc = canvasRef.current;
    if (!cc) return;
    const cctx = cc.getContext('2d');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ps = [];
    let animationFrameId;

    const handleResize = () => {
      cc.width = window.innerWidth;
      cc.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    class P {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.size = Math.random() * 1.9 + 0.2;
      }
      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const d = Math.hypot(dx, dy);
        if (d < 170) {
          const f = (140 - d) / 140;
          this.vx += (dx / d) * f * 0.3;
          this.vy += (dy / d) * f * 0.3;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= 0.0225;
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 3; i++) {
        ps.push(new P(mouse.x + (Math.random() - 0.5) * 40, mouse.y + (Math.random() - 0.5) * 40));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animC = () => {
      cctx.clearRect(0, 0, cc.width, cc.height);
      const darkActive = document.documentElement.getAttribute('data-theme') === 'dark';
      const coreColor = darkActive ? 'rgba(242,240,235,0.9)' : 'rgba(255,255,255,0.9)';
      const innerColor = darkActive ? 'rgba(10,10,11,1)' : 'rgba(14,14,15,1)';
      const strokeColor = 'rgba(255, 74, 28, 0.4)';

      // Core
      cctx.fillStyle = coreColor;
      cctx.beginPath();
      cctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
      cctx.fill();

      cctx.fillStyle = innerColor;
      cctx.beginPath();
      cctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      cctx.fill();

      cctx.strokeStyle = strokeColor;
      cctx.lineWidth = 1.5;
      cctx.beginPath();
      cctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
      cctx.stroke();

      // Particles
      const pColor = darkActive ? '242,240,235' : '14,14,15';
      for (let i = ps.length - 1; i >= 0; i--) {
        ps[i].update();
        cctx.fillStyle = `rgba(${pColor},${ps[i].life})`;
        cctx.beginPath();
        cctx.arc(ps[i].x, ps[i].y, ps[i].size, 0, Math.PI * 2);
        cctx.fill();
        if (ps[i].life <= 0) ps.splice(i, 1);
      }
      animationFrameId = requestAnimationFrame(animC);
    };
    animC();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="cursor-canvas" ref={canvasRef} />;
}
