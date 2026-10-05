import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LiquidMetalText } from 'motion-organic/react';
import { projects } from '../data/projectsData';
import { MoPortalLink, usePortalTransition } from '../context/PortalTransitionContext';
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

const BASE_TILT = 16; // degrees the orbit plane leans toward the viewer
const AUTO_SPEED = 0.12; // degrees per frame when idle

export default function OrbitShowcase() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const outerRefs = useRef([]);
  const innerRefs = useRef([]);
  const ringRefs = useRef([]);
  const labelRef = useRef(null);
  const draggedRef = useRef(false);
  const { isDark } = useTheme();
  const { navigateWithPortal } = usePortalTransition();

  const n = projects.length;
  const step = 360 / n;

  // All per-frame state lives here, never in React state.
  const s = useRef({ rot: 0, vel: AUTO_SPEED, tilt: BASE_TILT, tiltTarget: BASE_TILT, steer: 0, snap: null, R: 420, r: 200, front: -1 });

  useEffect(() => {
    const st = s.current;
    const stage = stageRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const auto = reduce ? 0 : AUTO_SPEED;

    const measure = () => {
      const w = stage.clientWidth;
      const narrow = w <= 900; // matches the 900px CSS breakpoint
      st.R = Math.min(w * (narrow ? 0.44 : 0.4), 560);
      st.r = st.R * 0.5;
      // Phones get a steeper lean so the ring spreads vertically instead of piling up.
      st.base = narrow ? 34 : BASE_TILT;
      st.tiltTarget = st.base;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    const place = (el, a, R, tilt, scaleBase, zShift = 0) => {
      if (!el) return;
      const rad = (a * Math.PI) / 180;
      const t = (tilt * Math.PI) / 180;
      const c = Math.cos(rad);
      const x = Math.sin(rad) * R;
      const y = c * R * Math.sin(t);
      const z = c * R * Math.cos(t);
      const depth = (c + 1) / 2; // 1 = front, 0 = back
      el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(Math.sin(rad) * 18).toFixed(1)}deg) scale(${scaleBase})`;
      el.style.opacity = (0.22 + depth * 0.78).toFixed(3);
      el.style.zIndex = String(Math.round(depth * 1000) + zShift);
    };

    const tick = () => {
      if (st.snap !== null) {
        const d = st.snap - st.rot;
        st.rot += d * 0.12;
        if (Math.abs(d) < 0.05) st.snap = null;
      } else if (!st.dragging) {
        st.vel += (auto + st.steer - st.vel) * 0.04;
        st.rot += st.vel;
      }
      st.tilt += (st.tiltTarget - st.tilt) * 0.08;

      outerRefs.current.forEach((el, i) => place(el, st.rot + i * step, st.R, st.tilt, 1));
      const m = innerRefs.current.length;
      innerRefs.current.forEach((el, i) => place(el, -st.rot * 1.35 + i * (360 / m), st.r, st.tilt, 1, -500)); // chips sit under cards at equal depth
      ringRefs.current.forEach((el) => {
        if (el) el.style.transform = `translate(-50%, -50%) rotateX(${(90 - st.tilt).toFixed(2)}deg)`;
      });

      // Front-most project = the one whose angle is closest to 0.
      const front = ((Math.round(-st.rot / step) % n) + n) % n;
      if (front !== st.front && labelRef.current) {
        st.front = front;
        labelRef.current.textContent = `${projects[front].num} // ${projects[front].title}`;
      }
    };

    // Only animate while the section is on screen.
    let running = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { gsap.ticker.add(tick); running = true; }
      else if (!entry.isIntersecting && running) { gsap.ticker.remove(tick); running = false; }
    });
    io.observe(sectionRef.current);
    tick();

    // Scrolling through the section gives the orbit a push.
    const trigger = reduce ? null : ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (!st.dragging && st.snap === null) st.vel += gsap.utils.clamp(-1.2, 1.2, self.getVelocity() / 3000);
      },
    });

    return () => {
      ro.disconnect();
      io.disconnect();
      trigger?.kill();
      gsap.ticker.remove(tick);
    };
  }, [n, step]);

  const onPointerMove = (e) => {
    const st = s.current;
    const rect = stageRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;
    if (st.dragging) {
      const dx = e.clientX - st.lastX;
      st.lastX = e.clientX;
      st.rot += dx * 0.25;
      st.vel = dx * 0.25;
      if (Math.abs(e.clientX - st.startX) > 6) draggedRef.current = true;
      return;
    }
    if (e.pointerType === 'mouse') {
      st.tiltTarget = st.base + my * -18;
      st.steer = mx * 0.9;
    }
  };

  const onPointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.snap = null;
    st.startX = st.lastX = e.clientX;
    draggedRef.current = false;
  };

  const endDrag = () => {
    s.current.dragging = false;
  };

  const onPointerLeave = () => {
    const st = s.current;
    st.dragging = false;
    st.steer = 0;
    st.tiltTarget = st.base;
  };

  // A drag should never also count as a click on a card.
  const onClickCapture = (e) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  const onKeyDown = (e) => {
    const st = s.current;
    const current = Math.round(-st.rot / step);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      st.snap = -(current + (e.key === 'ArrowRight' ? 1 : -1)) * step;
    } else if (e.key === 'Enter') {
      const p = projects[((current % n) + n) % n];
      navigateWithPortal(`/project/${p.id}`, null, { transition: p.transition, word: p.transitionWord || p.title });
    }
  };

  return (
    <section id="orbit" className="orbit-section" ref={sectionRef}>
      <div className="container orbit-header">
        <h2>
          <LiquidMetalText
            key={`orbit-${isDark ? 'dark' : 'light'}`}
            colors={isDark ? LIQUID_METAL_PALETTE.dark : LIQUID_METAL_PALETTE.light}
            speed={6}
          >
            Everything in orbit
          </LiquidMetalText>
        </h2>
        <p>My projects on the outer ring, the stack behind them on the inner one. Drag to spin, or focus it and use the arrow keys.</p>
      </div>

      <div
        className="orbit-stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label="Project orbit. Use left and right arrow keys to rotate, Enter to open the front project."
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={onPointerLeave}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        <div className="orbit-ring orbit-ring-outer" ref={(el) => (ringRefs.current[0] = el)} />
        <div className="orbit-ring orbit-ring-inner" ref={(el) => (ringRefs.current[1] = el)} />
        <div className="orbit-core" aria-hidden="true" />

        {STACK.map(([name, icon], i) => (
          <div className="orbit-chip" key={name} ref={(el) => (innerRefs.current[i] = el)}>
            <img src={`${DEVICON}/${icon}.svg`} alt="" loading="lazy" draggable="false" />
            <span>{name}</span>
          </div>
        ))}

        {projects.map((p, i) => (
          <div className="orbit-card" key={p.id} ref={(el) => (outerRefs.current[i] = el)}>
            <MoPortalLink
              to={`/project/${p.id}`}
              transition={p.transition}
              word={p.transitionWord || p.title}
              className="orbit-card-link"
              tabIndex={-1}
              draggable="false"
            >
              <span className="orbit-card-media">
                <img src={p.image} alt={p.title} loading="lazy" draggable="false" />
              </span>
              <span className="orbit-card-title">{p.num} // {p.title}</span>
            </MoPortalLink>
          </div>
        ))}
      </div>

      <p className="orbit-front" aria-live="polite" ref={labelRef} />
    </section>
  );
}
