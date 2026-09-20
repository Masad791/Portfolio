import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spring, engine, MoAudio, isReducedMotionPreferred } from 'motion-organic';

const PortalTransitionContext = createContext(null);

/**
 * 1. Generates an organic harmonic Catmull-Rom cubic bezier SVG spline
 */
function generateSplinePath(cx, cy, radius, phase, numPoints = 14, wobble = 0.18) {
  if (radius <= 1) return '';
  const pts = [];
  const angleStep = (Math.PI * 2) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    const harmonic1 = Math.sin(angle * 3 + phase) * 0.55;
    const harmonic2 = Math.cos(angle * 5 - phase * 1.2) * 0.35;
    const harmonic3 = Math.sin(angle * 2 + phase * 0.7) * 0.25;
    const wobbleFactor = (harmonic1 + harmonic2 + harmonic3) * wobble;
    const r = Math.max(0, radius * (1 + wobbleFactor));

    pts.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    });
  }

  if (pts.length < 3) return '';

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

/**
 * 2. Generates 9-blade mechanical camera aperture shutter paths
 */
function generateApertureBlades(t, cx, cy, R, n = 9) {
  const step = (Math.PI * 2) / n;
  const innerR = R * Math.max(0, 1 - t);
  const rot = t * step * 0.55;
  const blades = [];

  for (let i = 0; i < n; i++) {
    const a0 = i * step;
    const a1 = (i + 1) * step;
    const ox0 = cx + Math.cos(a0) * R;
    const oy0 = cy + Math.sin(a0) * R;
    const ox1 = cx + Math.cos(a1) * R;
    const oy1 = cy + Math.sin(a1) * R;
    const ix1 = cx + Math.cos(a1 + rot) * innerR;
    const iy1 = cy + Math.sin(a1 + rot) * innerR;
    const ix0 = cx + Math.cos(a0 + rot) * innerR;
    const iy0 = cy + Math.sin(a0 + rot) * innerR;

    blades.push(
      `M ${ox0.toFixed(1)} ${oy0.toFixed(1)} L ${ox1.toFixed(1)} ${oy1.toFixed(1)} L ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z`
    );
  }
  return blades;
}

export function PortalTransitionProvider({ children }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isAnimatingRef = useRef(false);

  const svgRef = useRef(null);
  const blobGroupRef = useRef(null);
  const fillPathRef = useRef(null);
  const rimPathRef = useRef(null);

  const apertureGroupRef = useRef(null);
  const textPortalGroupRef = useRef(null);
  const textPortalWordRef = useRef(null);
  const textPortalBgRef = useRef(null);

  const curtainGroupRef = useRef(null);

  const springRef = useRef(null);

  useEffect(() => {
    springRef.current = new Spring({ stiffness: 110, damping: 20 });

    // Interactive liquid sheen specular reflection tracking mouse coordinates
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--sheen-x', `${x.toFixed(1)}%`);
      document.documentElement.style.setProperty('--sheen-y', `${y.toFixed(1)}%`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      springRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navigateWithPortal = useCallback(
    async (toUrl, clickEvent, options = {}) => {
      if (isAnimatingRef.current) return;

      if (isReducedMotionPreferred && isReducedMotionPreferred()) {
        navigate(toUrl);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      isAnimatingRef.current = true;
      setIsTransitioning(true);

      const svg = svgRef.current;
      const spring = springRef.current;

      if (!svg || !spring) {
        navigate(toUrl);
        window.scrollTo({ top: 0, behavior: 'instant' });
        isAnimatingRef.current = false;
        setIsTransitioning(false);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = clickEvent?.clientX ?? (clickEvent?.touches ? clickEvent.touches[0].clientX : w / 2);
      const cy = clickEvent?.clientY ?? (clickEvent?.touches ? clickEvent.touches[0].clientY : h / 2);

      const transitionType = options.transition || 'organic-blob';
      const word = options.word || 'SYSTEMS';

      svg.style.opacity = '1';
      svg.style.pointerEvents = 'all';

      // Reset all transition groups
      if (blobGroupRef.current) blobGroupRef.current.style.display = 'none';
      if (apertureGroupRef.current) apertureGroupRef.current.style.display = 'none';
      if (textPortalGroupRef.current) textPortalGroupRef.current.style.display = 'none';
      if (curtainGroupRef.current) curtainGroupRef.current.style.display = 'none';

      // ──────────────────────────────────────────────────────────────────────────
      // TYPE 1: TEXT PORTAL ZOOM (Stencil Stargate Dive)
      // ──────────────────────────────────────────────────────────────────────────
      if (transitionType === 'text-portal') {
        const textGroup = textPortalGroupRef.current;
        const textWord = textPortalWordRef.current;
        const textBg = textPortalBgRef.current;

        if (textGroup && textWord && textBg) {
          textGroup.style.display = '';
          textWord.textContent = word;
          textBg.style.opacity = '0';

          try {
            MoAudio.play('portal', { velocity: 1.2 });
          } catch {}

          // Phase 1: Dive straight into typography stencil (1x -> 40x scale)
          await new Promise((resolve) => {
            spring.jumpTo(0);
            spring.onUpdate = (val) => {
              const t = Math.max(0, Math.min(1, val));
              const scale = 1 + Math.pow(t, 2.2) * 38;
              textWord.setAttribute('transform', `translate(${w / 2}, ${h / 2}) scale(${scale.toFixed(2)})`);
              textWord.style.opacity = String(Math.min(1, t * 2.5));
              textBg.style.opacity = String(Math.max(0, (t - 0.45) / 0.55));
            };
            spring.onSettle = resolve;
            spring.set(1);
            engine.add(spring);
          });

          navigate(toUrl);
          window.scrollTo({ top: 0, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 60));

          try {
            MoAudio.play('whoosh', { volume: 0.3 });
          } catch {}

          // Phase 2: Fade & expand out to reveal destination
          await new Promise((resolve) => {
            spring.jumpTo(0);
            spring.onUpdate = (val) => {
              const t = Math.max(0, Math.min(1, val));
              svg.style.opacity = String(Math.max(0, 1 - t));
            };
            spring.onSettle = resolve;
            spring.set(1);
            engine.add(spring);
          });

          textGroup.style.display = 'none';
          svg.style.opacity = '0';
          svg.style.pointerEvents = 'none';
          isAnimatingRef.current = false;
          setIsTransitioning(false);
          return;
        }
      }

      // ──────────────────────────────────────────────────────────────────────────
      // TYPE 2: MECHANICAL CAMERA IRIS APERTURE
      // ──────────────────────────────────────────────────────────────────────────
      if (transitionType === 'aperture') {
        const apGroup = apertureGroupRef.current;
        if (apGroup) {
          apGroup.style.display = '';
          const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.15;
          const bladeEls = Array.from(apGroup.querySelectorAll('.mo-ap-blade'));

          try {
            MoAudio.play('shutter', { velocity: 1.3 });
          } catch {}

          // Phase 1: Close blades over the viewport (0 -> 1)
          await new Promise((resolve) => {
            spring.jumpTo(0);
            spring.onUpdate = (val) => {
              const t = Math.max(0, Math.min(1, val));
              const paths = generateApertureBlades(t, cx, cy, maxR, 9);
              bladeEls.forEach((b, i) => {
                if (paths[i]) b.setAttribute('d', paths[i]);
              });
            };
            spring.onSettle = resolve;
            spring.set(1);
            engine.add(spring);
          });

          navigate(toUrl);
          window.scrollTo({ top: 0, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 60));

          try {
            MoAudio.play('shutter', { velocity: 1.0 });
          } catch {}

          // Phase 2: Snap open blades onto new page (1 -> 0)
          await new Promise((resolve) => {
            spring.jumpTo(1);
            spring.onUpdate = (val) => {
              const t = Math.max(0, Math.min(1, val));
              const paths = generateApertureBlades(t, cx, cy, maxR, 9);
              bladeEls.forEach((b, i) => {
                if (paths[i]) b.setAttribute('d', paths[i]);
              });
            };
            spring.onSettle = resolve;
            spring.set(0);
            engine.add(spring);
          });

          apGroup.style.display = 'none';
          svg.style.opacity = '0';
          svg.style.pointerEvents = 'none';
          isAnimatingRef.current = false;
          setIsTransitioning(false);
          return;
        }
      }

      // ──────────────────────────────────────────────────────────────────────────
      // TYPE 3: MULTI-COLUMN CHROMATIC CURTAIN CASCADE
      // ──────────────────────────────────────────────────────────────────────────
      if (transitionType === 'curtain') {
        const curGroup = curtainGroupRef.current;
        if (curGroup) {
          curGroup.style.display = '';
          const colEls = Array.from(curGroup.querySelectorAll('.mo-curtain-col'));

          try {
            MoAudio.play('whoosh', { velocity: 1.2 });
          } catch {}

          // Phase 1: Columns cascade downwards
          await new Promise((resolve) => {
            spring.jumpTo(0);
            spring.onUpdate = (val) => {
              const t = Math.max(0, Math.min(1, val));
              colEls.forEach((col, i) => {
                const colT = Math.max(0, Math.min(1, (t - i * 0.08) / 0.68));
                col.setAttribute('height', String(h * colT));
              });
            };
            spring.onSettle = resolve;
            spring.set(1);
            engine.add(spring);
          });

          navigate(toUrl);
          window.scrollTo({ top: 0, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 60));

          try {
            MoAudio.play('whoosh', { volume: 0.25 });
          } catch {}

          // Phase 2: Columns sweep down to reveal
          await new Promise((resolve) => {
            spring.jumpTo(0);
            spring.onUpdate = (val) => {
              const t = Math.max(0, Math.min(1, val));
              colEls.forEach((col, i) => {
                const colT = Math.max(0, Math.min(1, (t - i * 0.08) / 0.68));
                col.setAttribute('y', String(h * colT));
                col.setAttribute('height', String(h * (1 - colT)));
              });
            };
            spring.onSettle = resolve;
            spring.set(1);
            engine.add(spring);
          });

          colEls.forEach((col) => {
            col.setAttribute('y', '0');
            col.setAttribute('height', '0');
          });

          curGroup.style.display = 'none';
          svg.style.opacity = '0';
          svg.style.pointerEvents = 'none';
          isAnimatingRef.current = false;
          setIsTransitioning(false);
          return;
        }
      }

      // ──────────────────────────────────────────────────────────────────────────
      // TYPE 4: FOODNIA HARMONIC LIQUID BLOB PORTAL (Default)
      // ──────────────────────────────────────────────────────────────────────────
      const blobGroup = blobGroupRef.current;
      const fillPath = fillPathRef.current;
      const rimPath = rimPathRef.current;

      if (blobGroup && fillPath && rimPath) {
        blobGroup.style.display = '';
        const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.25;

        try {
          MoAudio.play('liquid', { velocity: 1.1 });
        } catch {}

        // Phase 1: Harmonic blob expands to cover screen
        await new Promise((resolve) => {
          spring.jumpTo(0);
          spring.onUpdate = (val) => {
            const t = Math.max(0, Math.min(1, val));
            const currentR = maxR * Math.pow(t, 1.35);
            const phase = t * 8.5;
            const blobD = generateSplinePath(cx, cy, currentR, phase, 14, 0.16 * (1 - t * 0.3));

            fillPath.setAttribute('d', blobD);
            rimPath.setAttribute('d', blobD);

            const rimOpacity = t < 0.05 ? t * 20 : (t > 0.9 ? (1 - t) * 10 : 1);
            rimPath.style.opacity = String(Math.max(0, Math.min(1, rimOpacity)));
          };

          spring.onSettle = resolve;
          spring.set(1);
          engine.add(spring);
        });

        navigate(toUrl);
        window.scrollTo({ top: 0, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));

        try {
          MoAudio.play('whoosh', { volume: 0.25 });
        } catch {}

        // Phase 2: Dilate aperture hole from center to reveal destination
        const centerCx = w / 2;
        const centerCy = h / 2;
        const revealMaxR = Math.hypot(centerCx, centerCy) * 1.3;

        await new Promise((resolve) => {
          spring.jumpTo(0);
          spring.onUpdate = (val) => {
            const t = Math.max(0, Math.min(1, val));
            const currentHoleR = revealMaxR * Math.pow(t, 1.3);
            const phase = t * 7.5;
            const holeD = generateSplinePath(centerCx, centerCy, currentHoleR, phase, 14, 0.14 * (1 - t * 0.4));

            const compoundD = `M 0 0 H ${w} V ${h} H 0 Z ${holeD}`;
            fillPath.setAttribute('d', compoundD);
            rimPath.setAttribute('d', holeD);

            const rimOpacity = t > 0.85 ? Math.max(0, (1 - t) / 0.15) : Math.min(1, t * 5);
            rimPath.style.opacity = String(rimOpacity);
          };

          spring.onSettle = resolve;
          spring.set(1);
          engine.add(spring);
        });

        fillPath.setAttribute('d', '');
        rimPath.setAttribute('d', '');
        rimPath.style.opacity = '0';
        blobGroup.style.display = 'none';
      }

      svg.style.opacity = '0';
      svg.style.pointerEvents = 'none';
      isAnimatingRef.current = false;
      setIsTransitioning(false);
    },
    [navigate]
  );

  return (
    <PortalTransitionContext.Provider value={{ navigateWithPortal, isTransitioning }}>
      {children}

      {/* Multi-Transition Engine Root SVG Overlay */}
      <svg
        ref={svgRef}
        className="mo-portal-overlay-svg"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <defs>
          <filter id="mo-rim-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="var(--bh-red, #ff4a1c)" floodOpacity="0.85" />
            <feDropShadow dx="0" dy="0" stdDeviation="22" floodColor="#d7ed45" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 1. Organic Blob Portal Layer */}
        <g ref={blobGroupRef}>
          <path
            ref={fillPathRef}
            fill="var(--bg, #0a0a0b)"
            fillRule="evenodd"
            d=""
          />
          <path
            ref={rimPathRef}
            fill="none"
            stroke="var(--bh-red, #ff4a1c)"
            strokeWidth="3.5"
            filter="url(#mo-rim-glow)"
            opacity="0"
            d=""
          />
        </g>

        {/* 2. Text Stencil Stargate Zoom Layer */}
        <g ref={textPortalGroupRef} style={{ display: 'none' }}>
          <rect ref={textPortalBgRef} x="0" y="0" width="100%" height="100%" fill="var(--bg, #0a0a0b)" opacity="0" />
          <text
            ref={textPortalWordRef}
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--fg, #ffffff)"
            stroke="var(--bh-red, #ff4a1c)"
            strokeWidth="2"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 900,
              letterSpacing: '0.08em',
              fontSize: '12vw',
              transformOrigin: '0 0',
              willChange: 'transform, opacity',
            }}
          >
            SYSTEMS
          </text>
        </g>

        {/* 3. 9-Blade Mechanical Camera Aperture Layer */}
        <g ref={apertureGroupRef} style={{ display: 'none' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              className="mo-ap-blade"
              fill={i % 2 === 0 ? 'var(--bg, #0a0a0b)' : '#121316'}
              stroke="var(--line, rgba(255, 74, 28, 0.3))"
              strokeWidth="1"
              d=""
            />
          ))}
        </g>

        {/* 4. Multi-Column Waterfall Curtain Layer */}
        <g ref={curtainGroupRef} style={{ display: 'none' }}>
          {['#0a0a0b', '#121317', '#17191e', '#1c1e24', '#0d0e11'].map((color, idx) => (
            <rect
              key={idx}
              className="mo-curtain-col"
              x={`${idx * 20}%`}
              y="0"
              width="20.5%"
              height="0"
              fill={color}
            />
          ))}
        </g>
      </svg>
    </PortalTransitionContext.Provider>
  );
}

export function usePortalTransition() {
  const context = useContext(PortalTransitionContext);
  if (!context) {
    throw new Error('usePortalTransition must be used within a PortalTransitionProvider');
  }
  return context;
}

/**
 * <MoPortalLink> — Universal drop-in anchor component supporting multi-transition modes
 */
export function MoPortalLink({
  to,
  transition = 'organic-blob',
  word,
  onClick,
  children,
  className = '',
  ...props
}) {
  const { navigateWithPortal, isTransitioning } = usePortalTransition();

  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    onClick?.(e);
    if (isTransitioning) return;
    navigateWithPortal(to, e, { transition, word });
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`mo-portal-link ${className}`.trim()}
      data-transition={transition}
      data-transitioning={isTransitioning ? 'true' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
