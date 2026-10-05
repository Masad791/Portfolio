import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LiquidMetalText } from 'motion-organic/react';
import { projects } from '../data/projectsData';
import { MoPortalLink } from '../context/PortalTransitionContext';
import { useTheme, LIQUID_METAL_PALETTE } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';
const STACK = [
  ['PHP', 'php/php-original'],
  ['Laravel', 'laravel/laravel-original'],
  ['JavaScript', 'javascript/javascript-original'],
  ['React', 'react/react-original'],
  ['Vue', 'vuejs/vuejs-original'],
  ['Node.js', 'nodejs/nodejs-original'],
  ['Python', 'python/python-original'],
  ['Electron', 'electron/electron-original'],
  ['MySQL', 'mysql/mysql-original'],
  ['Postgres', 'postgresql/postgresql-original'],
  ['MongoDB', 'mongodb/mongodb-original'],
  ['Redis', 'redis/redis-original'],
  ['Docker', 'docker/docker-original'],
  ['Three.js', 'threejs/threejs-original'],
];
const WORDS = ['BACKEND', 'REAL-TIME', 'WEBGL', 'TOOLING'];

// The world is one 2240x1400 chunk that repeats in every direction.
// 4 columns x 2 rows of cells; each cell holds a project, one of its numbers and two stack chips.
const CELL_W = 560;
const CELL_H = 700;
const CW = CELL_W * 4;
const CH = CELL_H * 2;
const PROJECT_W = [440, 380, 460, 400];
const PROJECT_Y = [40, 300, 80, 360];

// f = pan factor, d = mouse-parallax depth. Everything pans together (f = 1) so tiles never drift
// into each other; only the outlined background words lag. Depth comes from the mouse offset,
// which is bounded, so layers shift a little relative to each other but can't pile up.
const TILES = [];
projects.forEach((p, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4) % 2;
  const cx = col * CELL_W;
  const cy = row * CELL_H;
  const w = PROJECT_W[col];
  const y = cy + PROJECT_Y[col];
  const h = w * 0.625 + 34;
  TILES.push({ kind: 'project', p, x: cx + (CELL_W - w) / 2, y, w, f: 1, d: 1 });

  const topHeavy = PROJECT_Y[col] < 200;
  const mx = cx + (col % 2 ? 40 : 330);
  const my = topHeavy ? y + h + 60 : y - 210;
  TILES.push({ kind: 'metric', p, m: p.metrics[0], x: mx, y: my, w: 230, f: 1, d: 0.6 });

  const chipX = col % 2 ? mx + 260 : mx - 230;
  [i, i + 8].filter((k) => k < STACK.length).forEach((k, j) => {
    TILES.push({ kind: 'chip', s: STACK[k], x: chipX + j * 100, y: my + 10 + j * 90, w: 84, f: 1, d: 1.7 });
  });
});
WORDS.forEach((word, i) => {
  const col = i % 2 ? 3 : 1;
  const row = i < 2 ? 0 : 1;
  TILES.push({ kind: 'word', word, x: col * CELL_W + 20, y: row * CELL_H + (col === 1 ? 600 : 690), f: 0.6, d: 0.3 });
});

const DRIFT_X = -0.35;
const DRIFT_Y = -0.18;

// Wraps a world coordinate into the chunk so the visible window sits in its middle.
const wrap = (v, size, view) => ((((v + (size - view) / 2) % size) + size) % size) - (size - view) / 2;

export default function WorkCanvas() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const tileRefs = useRef([]);
  const hudRef = useRef(null);
  const draggedRef = useRef(false);
  const { isDark } = useTheme();

  // Per-frame state, kept out of React.
  const s = useRef({ x: 0, y: 0, vx: DRIFT_X, vy: DRIFT_Y, mx: 0, my: 0, tmx: 0, tmy: 0, scale: 1, vw: 1440, vh: 900, frame: 0 });

  useEffect(() => {
    const st = s.current;
    const world = worldRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const drift = reduce ? [0, 0] : [DRIFT_X, DRIFT_Y];

    const measure = () => {
      // ponytail: wrap needs (chunk - view) / 2 >= biggest tile; true up to ~1920px wide, edges are masked beyond that.
      // Measure the world box (not the section): on phones it starts below the heading.
      st.scale = gsap.utils.clamp(0.75, 1.4, world.clientWidth / 1200);
      st.vw = world.clientWidth / st.scale;
      st.vh = world.clientHeight / st.scale;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(world);

    const tick = () => {
      if (!st.dragging) {
        st.vx += (drift[0] - st.vx) * 0.03;
        st.vy += (drift[1] - st.vy) * 0.03;
        st.x += st.vx;
        st.y += st.vy;
      }
      st.mx += (st.tmx - st.mx) * 0.06;
      st.my += (st.tmy - st.my) * 0.06;

      TILES.forEach((t, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const x = wrap(t.x + st.x * t.f + st.mx * t.d, CW, st.vw);
        const y = wrap(t.y + st.y * t.f + st.my * t.d, CH, st.vh);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });

      // Fast flings zoom the world out a touch, like pulling a camera back.
      const speed = Math.hypot(st.vx, st.vy);
      // Scale from the top-left (so world coords [0, vw] x [0, vh] are exactly what's on screen),
      // and offset the fling zoom so it pulls back around the center.
      const k = 1 - Math.min(speed * 0.004, 0.05);
      const ox = (world.clientWidth * (1 - k)) / 2;
      const oy = (world.clientHeight * (1 - k)) / 2;
      worldRef.current.style.transform = `translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px) scale(${(st.scale * k).toFixed(4)})`;

      if (++st.frame % 6 === 0 && hudRef.current) {
        hudRef.current.textContent = `X ${Math.round(-st.x)}  Y ${Math.round(-st.y)}`;
      }
    };

    let running = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { gsap.ticker.add(tick); running = true; }
      else if (!entry.isIntersecting && running) { gsap.ticker.remove(tick); running = false; }
    });
    io.observe(sectionRef.current);
    tick();

    // Page scroll pushes the canvas vertically, so the section reacts to scrolling past it.
    const trigger = reduce ? null : ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (!st.dragging) st.vy -= gsap.utils.clamp(-3, 3, self.getVelocity() / 900);
      },
    });

    return () => {
      ro.disconnect();
      io.disconnect();
      trigger?.kill();
      gsap.ticker.remove(tick);
    };
  }, []);

  const onPointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.lastX = st.startX = e.clientX;
    st.lastY = st.startY = e.clientY;
    draggedRef.current = false;
  };

  const onPointerMove = (e) => {
    const st = s.current;
    if (st.dragging) {
      const dx = (e.clientX - st.lastX) / st.scale;
      const dy = (e.clientY - st.lastY) / st.scale;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.x += dx;
      st.y += dy;
      st.vx = dx;
      st.vy = dy;
      if (Math.hypot(e.clientX - st.startX, e.clientY - st.startY) > 6) draggedRef.current = true;
      return;
    }
    if (e.pointerType === 'mouse') {
      const rect = stageRef.current.getBoundingClientRect();
      st.tmx = -((e.clientX - rect.left) / rect.width - 0.5) * 120;
      st.tmy = -((e.clientY - rect.top) / rect.height - 0.5) * 80;
    }
  };

  const endDrag = () => {
    s.current.dragging = false;
  };

  const onPointerLeave = () => {
    const st = s.current;
    st.dragging = false;
    st.tmx = 0;
    st.tmy = 0;
  };

  // A drag must never also open a project.
  const onClickCapture = (e) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  const onKeyDown = (e) => {
    const push = { ArrowLeft: [14, 0], ArrowRight: [-14, 0], ArrowUp: [0, 14], ArrowDown: [0, -14] }[e.key];
    if (!push) return;
    e.preventDefault();
    s.current.vx = push[0];
    s.current.vy = push[1];
  };

  return (
    <section id="explore" className="cv-section" ref={sectionRef}>
      <div
        className="cv-stage"
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Work canvas. Drag or use the arrow keys to explore, click a project to open it."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={onPointerLeave}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        <div className="cv-viewport">
          <div className="cv-world" ref={worldRef}>
            {TILES.map((t, i) => {
              const ref = (el) => (tileRefs.current[i] = el);
              if (t.kind === 'project') {
                return (
                  <div className="cv-tile cv-project" key={`p-${t.p.id}`} ref={ref} style={{ width: t.w }}>
                    <MoPortalLink
                      to={`/project/${t.p.id}`}
                      transition={t.p.transition}
                      word={t.p.transitionWord || t.p.title}
                      draggable="false"
                    >
                      <span className="cv-media">
                        <img src={t.p.image} alt={t.p.title} loading="lazy" draggable="false" />
                      </span>
                      <span className="cv-caption">
                        <b>{t.p.num}</b> {t.p.title}
                        <i>{t.p.stack.slice(0, 2).join(' + ')}</i>
                      </span>
                    </MoPortalLink>
                  </div>
                );
              }
              if (t.kind === 'metric') {
                return (
                  <div className="cv-tile cv-metric" key={`m-${t.p.id}`} ref={ref} style={{ width: t.w }}>
                    <strong>{t.m.number}</strong>
                    <span>{t.m.label}</span>
                    <em>{t.p.title}</em>
                  </div>
                );
              }
              if (t.kind === 'chip') {
                return (
                  <div className="cv-tile cv-chip" key={`c-${t.s[0]}`} ref={ref}>
                    <img src={`${DEVICON}/${t.s[1]}.svg`} alt="" loading="lazy" draggable="false" />
                    <span>{t.s[0]}</span>
                  </div>
                );
              }
              return (
                <div className="cv-tile cv-word" key={`w-${t.word}`} ref={ref} aria-hidden="true">
                  {t.word}
                </div>
              );
            })}
          </div>
        </div>

        <div className="cv-overlay container">
          <h2>
            <LiquidMetalText
              key={`cv-${isDark ? 'dark' : 'light'}`}
              colors={isDark ? LIQUID_METAL_PALETTE.dark : LIQUID_METAL_PALETTE.light}
              speed={6}
            >
              Explore the work
            </LiquidMetalText>
          </h2>
          <p>Drag in any direction. Every tile is real: the projects, the numbers from their code, and the stack behind them.</p>
        </div>
        <div className="cv-hud" aria-hidden="true">
          <span ref={hudRef}>X 0  Y 0</span>
          <span>Drag to explore // Click a project</span>
        </div>
      </div>
    </section>
  );
}
