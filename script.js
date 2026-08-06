gsap.registerPlugin(ScrollTrigger);

  // DARK MODE LOGIC

const themeToggle = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  moonIcon.style.display = 'none'; sunIcon.style.display = 'block';
}

// Toggle Theme on Click
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    moonIcon.style.display = 'block'; sunIcon.style.display = 'none';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    moonIcon.style.display = 'none'; sunIcon.style.display = 'block';
  }
});


   // CUSTOM CURSOR (Particle Trail)

const cc = document.getElementById('cursor-canvas');
const cctx = cc.getContext('2d');
let mouse = { x: innerWidth/2, y: innerHeight/2 };
let ps = []; // Particle array
cc.width = innerWidth; cc.height = innerHeight;

// Resize Canvas on window resize
addEventListener('resize', () => { cc.width = innerWidth; cc.height = innerHeight; });

// Particle Class
class P {
  constructor(x, y) { 
    this.x = x; this.y = y; 
    this.vx = (Math.random()-0.5)*2; this.vy = (Math.random()-0.5)*2; 

    //Particls size
    this.life = 1; this.size = Math.random()*1.9+0.2; 
  }
  update() {
    // Calculate distance to mouse
    let dx = mouse.x - this.x, dy = mouse.y - this.y, d = Math.hypot(dx, dy);

    // Pull particle toward mouse if close
    if(d < 170) { let f = (140-d)/140; this.vx += (dx/d)*f*0.3; this.vy += (dy/d)*f*0.3; }
    this.x += this.vx; this.y += this.vy; 
    this.vx *= 0.95; this.vy *= 0.95; this.life -= 0.0225;
  }
}

// Get correct particle color based on theme
function getParticleColor() { return document.documentElement.getAttribute('data-theme') === 'dark' ? '242,240,235' : '14,14,15'; }

// Spawn particles on mouse move
addEventListener('mousemove', e => { 
  mouse.x = e.clientX; mouse.y = e.clientY; 
  for(let i=0; i<3; i++) ps.push(new P(mouse.x + (Math.random()-0.5)*40, mouse.y + (Math.random()-0.5)*40)); 
});

// Animation Loop
function animC() {
  cctx.clearRect(0,0,cc.width,cc.height);
  let coreColor = document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(242,240,235,0.9)' : 'rgba(255,255,255,0.9)';
  let innerColor = document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(10,10,11,1)' : 'rgba(14,14,15,1)';
  let strokeColor = 'rgba(255, 74, 28, 0.4)';
  
  // Draw Core
  cctx.fillStyle = coreColor; cctx.beginPath(); cctx.arc(mouse.x, mouse.y, 6, 0, Math.PI*2); cctx.fill();
  cctx.fillStyle = innerColor; cctx.beginPath(); cctx.arc(mouse.x, mouse.y, 3, 0, Math.PI*2); cctx.fill();
  cctx.strokeStyle = strokeColor; cctx.lineWidth = 1.5; cctx.beginPath(); cctx.arc(mouse.x, mouse.y, 10, 0, Math.PI*2); cctx.stroke();
  
  // Draw Particles
  let pColor = getParticleColor();
  for(let i=ps.length-1;i>=0;i--) { 
    ps[i].update(); 
    cctx.fillStyle = `rgba(${pColor},${ps[i].life})`; 
    cctx.beginPath(); 
    cctx.arc(ps[i].x, ps[i].y, ps[i].size, 0, Math.PI*2); 
    cctx.fill(); 
    if(ps[i].life<=0) ps.splice(i,1); 
  }
  requestAnimationFrame(animC);
}
animC();


   // ACTIVE NAV INDICATOR LOGIC

const navIndicator = document.getElementById('nav-indicator');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveColor(targetLink) {

  // 1. Remove 'active' class from all links
  navLinks.forEach(link => link.classList.remove('active'));
  
  //  Add active class 
  if(targetLink) {
    targetLink.classList.add('active');
  }
}

// Move indicator smoothly with GSAP
function moveIndicator(target, isClick = false) {
  if(!target) return;
  
  // Call the color function 
  setActiveColor(target);

  gsap.to(navIndicator, { 
    x: target.offsetLeft, duration: 0.4, ease: 'power3.out', 
    onComplete: () => {

      // Shake effect on click

      if(isClick) { gsap.fromTo(navIndicator, { x: target.offsetLeft - 5 }, { x: target.offsetLeft, duration: 0.1, yoyo: true, repeat: 3 }); }
    }
  });
}

// Set initial position
setTimeout(() => moveIndicator(document.querySelector('.nav-link[data-target="hero"]')), 100);

// Click event for nav links
navLinks.forEach(link => { 
  link.addEventListener('click', () => moveIndicator(link, true)); 
});



  // TIME UPDATER

function updTime() { 
  const n = new Date(); 
  document.getElementById('time-date').innerHTML = 
  `${n.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Karachi' })} // ` +
  `${n.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' })}`;
}
setInterval(updTime, 1000); updTime();


  // GSAP SCROLL ANIMATIONS
  
// Hero Entry Animation
gsap.from("#hero h1", { y: 50, opacity: 0, duration: 1.5, ease: "power3.out" });
gsap.from(".hero-meta", { y: 20, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });

// Tech Boxes In/Out
ScrollTrigger.create({ 
  trigger: "#hero", start: "top top", end: "bottom top", 
  onEnter: () => gsap.to('.tech-box', { y: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' }), 
  onLeaveBack: () => gsap.to('.tech-box', { y: 50, duration: 0.4, stagger: 0.2, ease: 'power3.out' }), 
  onEnterBack: () => gsap.to('.tech-box', { y: -50, duration: 0.5, stagger: 0.2, ease: 'power3.out' }), 
  onLeave: () => gsap.to('.tech-box', { y: -50, duration: 0.7, stagger: 0.1, ease: 'power3.in' }) 
});

// Morph: Image scales down and vanishes, text scales up
gsap.to("#dev-image", { scale: 0.9, opacity: 0, ease: "none", scrollTrigger: { trigger: "#morph-section", start: "top top", end: "bottom bottom", scrub: true } });
gsap.to("#dev-text", { opacity: 1, scale: 1.2, ease: "none", scrollTrigger: { trigger: "#morph-section", start: "top top", end: "bottom bottom", scrub: true } });

// Skills: Play on scroll down, reverse on scroll up
document.querySelectorAll('.skill-row').forEach(row => { 
  gsap.to(row, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none reverse" } }); 
});

// Capabilities: Play on scroll down, reverse on scroll up
document.querySelectorAll('.cap-item').forEach(item => { 
  gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" } }); 
});

// Projects: 3D Flip Cards entry
document.querySelectorAll('.project-card').forEach(card => { 
  gsap.to(card, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } }); 
});

// Auto Move Nav Indicator on Section Enter
ScrollTrigger.create({ trigger: "#hero", start: "top center", end: "bottom center", onEnter: () => moveIndicator(document.querySelector('.nav-link[data-target="hero"]')), onEnterBack: () => moveIndicator(document.querySelector('.nav-link[data-target="hero"]')) });
ScrollTrigger.create({ trigger: "#skills", start: "top center", end: "bottom center", onEnter: () => moveIndicator(document.querySelector('.nav-link[data-target="skills"]')), onEnterBack: () => moveIndicator(document.querySelector('.nav-link[data-target="skills"]')) });
ScrollTrigger.create({ trigger: "#projects", start: "top center", end: "bottom center", onEnter: () => moveIndicator(document.querySelector('.nav-link[data-target="projects"]')), onEnterBack: () => moveIndicator(document.querySelector('.nav-link[data-target="projects"]')) });
ScrollTrigger.create({ trigger: "#contact", start: "top center", end: "bottom center", onEnter: () => moveIndicator(document.querySelector('.nav-link[data-target="contact"]')), onEnterBack: () => moveIndicator(document.querySelector('.nav-link[data-target="contact"]')) });

/* ==========================================
   6. CTA FORM ADVANCED ANIMATION
   ========================================== */
const form = document.getElementById('contact-form');
const formWrapper = document.getElementById('form-wrapper');
const emailCore = document.getElementById('email-core');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Shrink and blur form
  gsap.to(formWrapper, { scale: 0.8, opacity: 0.3, filter: 'blur(5px)', duration: 0.5, ease: 'power2.in' });
  
  // Animate Email Core
  gsap.fromTo(emailCore, { opacity: 0, scale: 0.5, x: 0, y: 0 }, { 
    opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', 
    onComplete: () => {
      // Fly up and right
      gsap.to(emailCore, { 
        x: window.innerWidth * 0.5, y: -window.innerHeight * 0.5, scale: 0.2, duration: 1.2, ease: 'power3.in', 
        onUpdate: () => {
          // Spawn particle trail
          let rect = emailCore.getBoundingClientRect(); 
          for(let i=0; i<5; i++) ps.push(new P(rect.left + 10, rect.top + 10)); 
        }, 
        onComplete: () => { 
          // Reset form
          form.reset(); 
          gsap.to(formWrapper, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, delay: 0.2 }); 
          gsap.set(emailCore, { opacity: 0, scale: 0.5, x: 0, y: 0 }); 
        } 
      });
    }
  });
});

/* ==========================================
   7. FOOTER BLACK HOLE (Orange Particles & Centered Layout)
   ========================================== */
const fc = document.getElementById('footer-canvas');
const fctx = fc.getContext('2d');
fc.width = innerWidth; fc.height = innerHeight;

// Initialize Stars
let fStars = [];
for(let i=0; i<800; i++) {
  fStars.push({ 
    x: Math.random()*fc.width, 
    y: Math.random()*fc.height*0.5, 
    s: Math.random()*1.5 + 0.5, // Slightly larger for visibility
    vx: (Math.random()-0.5)*0.1, 
    vy: 0, 
    baseVy: Math.random()*0.1 + 0.05 
  });
}

// Resize Footer Canvas
addEventListener('resize', () => { fc.width = innerWidth; fc.height = innerHeight; });

// Footer Animation Loop
function animFooter() {
  let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  let bgColor = isDark ? '10, 10, 11' : '242, 240, 235';
  
  // Clear canvas completely
  fctx.clearRect(0, 0, fc.width, fc.height);
  let bhX = fc.width / 2;
  let horizonY = fc.height * 0.7; // Where the flat surface starts
  let curveDepth = 120; // How much the horizon curves up
  
  // 1. Seamless Background Blend (Solid colors, NO transparency to prevent white spots)
  let bgGrad = fctx.createLinearGradient(0, 0, 0, fc.height);
  bgGrad.addColorStop(0, `rgba(${bgColor}, 1)`); // Solid body color at top
  // Blend directly into dark crimson/brown so orange stars pop immediately
  bgGrad.addColorStop(0.4, `rgba(${isDark ? '20, 10, 5' : '80, 40, 20'}, 1)`); 
  bgGrad.addColorStop(0.7, `rgba(30, 10, 5, 1)`); 
  bgGrad.addColorStop(1, `rgba(0, 0, 0, 1)`); // Deep space black
  fctx.fillStyle = bgGrad;
  fctx.fillRect(0, 0, fc.width, fc.height);

  // 2. Draw Orange Radiation / Accretion Cloud (Additive Blending for Glow)
  fctx.globalCompositeOperation = 'lighter';
  let radGrad = fctx.createRadialGradient(bhX, horizonY, 0, bhX, horizonY, fc.width * 0.8);
  radGrad.addColorStop(0, 'rgba(242, 57, 11, 0.4)');
  radGrad.addColorStop(0.2, 'rgba(255, 100, 40, 0.15)');
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  fctx.fillStyle = radGrad;
  fctx.fillRect(0, 0, fc.width, horizonY);

  // 3. Draw Strictly Orange/Red Shiny Stars (Gentle Swirl)
  // MUST be source-over so they don't add up to white on the background
  fctx.globalCompositeOperation = 'source-over'; 
  
  fStars.forEach(s => {
    let targetX = bhX;
    let targetY = horizonY - curveDepth * 1.05; 
    let dx = targetX - s.x;
    let dy = targetY - s.y;
    let dist = Math.hypot(dx, dy);

    // Gravity Pull
    if (dist < 800) {
      let force = Math.pow((800 - dist) / 1800, 2) * 0.5;
      s.vx += (dx / dist) * force;
      s.vy += (dy / dist) * force;
      let perpX = -dy / dist; let perpY = dx / dist;
      s.vx += perpX * force * 1.2; s.vy += perpY * force * 1.2;
    } else {
      s.vy += s.baseVy * 0.01;
    }

    s.vx *= 0.98; s.vy *= 0.98; // Damping
    s.x += s.vx; s.y += s.vy;

    // Consume particle if it hits the surface curve
    if (s.y >= horizonY - 30) {
      s.x = Math.random() * fc.width;
      s.y = Math.random() * fc.height * 1.3;
      s.vx = 0; s.vy = 0;
    }
    
    // STRICT FIERY ORANGE/RED COLOR LOGIC (Never White)
    let speed = Math.hypot(s.vx, s.vy);
    let heat = Math.min(2, speed / 1.2 + (1 - dist / 800) * 0.5);
    
    let r = 255;
    let g = 40 + (heat * 40);  
    let b = 10;
    let alpha = 1.0;
    
    fctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    fctx.beginPath();
    fctx.arc(s.x, s.y, s.s * (1 + heat * 0.5), 0, Math.PI * 2);
    fctx.fill();
  });

  // 4. Draw Flat Black Hole Surface (Transparent to Solid Black)
  let surfaceGrad = fctx.createLinearGradient(0, horizonY - curveDepth, 0, horizonY + 200);
  surfaceGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  surfaceGrad.addColorStop(0.2, 'rgba(0, 0, 0, 0.4)');
  surfaceGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.9)');
  surfaceGrad.addColorStop(0.7, 'rgba(0, 0, 0, 1)');
  fctx.fillStyle = surfaceGrad;
  fctx.beginPath();
  fctx.moveTo(0, horizonY); 
  fctx.quadraticCurveTo(bhX, horizonY - curveDepth, fc.width, horizonY);
  fctx.lineTo(fc.width, fc.height);
  fctx.lineTo(0, fc.height);
  fctx.closePath();
  fctx.fill();

  // 5. Soft Horizon Rim Glow (Atmospheric light bleeding onto the surface)
  fctx.save();
  fctx.shadowColor = 'rgba(250, 65, 4, 0.6)';
  fctx.shadowBlur = 50;
  fctx.strokeStyle = 'rgba(243, 103, 9, 0.57)';
  fctx.lineWidth = 4;
  fctx.beginPath();
  fctx.moveTo(0, horizonY);
  fctx.quadraticCurveTo(bhX, horizonY - curveDepth, fc.width, horizonY);
  fctx.stroke();
  fctx.restore();

  requestAnimationFrame(animFooter);
}
animFooter();


