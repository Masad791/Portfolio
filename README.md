# Muhammad Asad — Software Engineer Portfolio

An interactive, high-performance developer portfolio built with **React 18**, **Vite**, and official **GSAP 3** (`@gsap/react`, `ScrollTrigger`). Features dimensional 3D interactions, smooth horizontal pinned scroll, physics-based canvas animations, dynamic routing, and working Netlify form integration.

---

## ⚡ Key Highlights & Architecture

- **React + Vite Architecture**: Lightning-fast build times, modular component structure, and optimized asset bundling.
- **GSAP Horizontal Pin Scroll**: Pinned right-to-left project gallery in `#projects` with dynamic scroll distance measurement, 3D card flips, and real-time counter indicators.
- **Fluid Morph Transition**: Simultaneous cross-fade dissolve from developer portrait into typography with hold buffering.
- **Interactive Canvas Physics**:
  - **Custom Cursor**: Particle trail with attraction physics responding to mouse velocity.
  - **Black Hole Footer**: Adaptive event horizon canvas with particle accretion, rim glow, and zero stuck edges.
- **Theme Engine**:
  - Instant pre-paint theme initialization (pure white `#ffffff` light mode and cosmic black `#0a0a0b` dark mode).
  - Synchronized via React Context and persisted in `localStorage` with zero refresh flash.
- **Dynamic Case Study Pages**: Reusable `/project/:id` route driven by `projectsData.js` featuring architecture breakdowns, tech stacks, visual galleries, and performance metrics.
- **Netlify Form Submissions**: Full SPA compatibility with static build crawler form in `index.html`, asynchronous URL-encoded AJAX submission, and animated GSAP launch envelope.

---

## 📁 Project Structure

```text
Portfolio/
├── public/                     # Static assets & routing configs
│   ├── _redirects              # Netlify SPA redirect rule (/* /index.html 200)
│   ├── ME.png                  # Developer portrait
│   └── *.png                   # Project preview thumbnails
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── BackgroundStars.jsx # Starfield pattern & noise overlay
│   │   ├── Capabilities.jsx    # Engineering capabilities grid
│   │   ├── ContactForm.jsx     # Netlify form + socials + flying animation
│   │   ├── CustomCursor.jsx    # 2D canvas particle cursor
│   │   ├── Footer.jsx          # Adaptive black hole canvas + MAD watermark
│   │   ├── Hero.jsx            # Headline & animated tech badge boxes
│   │   ├── Marquee.jsx         # Continuous scrolling tech stack ticker
│   │   ├── MorphSection.jsx    # Scrubbed cross-fade morph section
│   │   ├── Navbar.jsx          # Glass navbar with sliding active indicator
│   │   ├── ProjectCard.jsx     # 3D interactive flip card
│   │   ├── ProjectsHorizontal.jsx # Pinned horizontal ScrollTrigger track
│   │   └── Skills.jsx          # Architecture & stack table
│   ├── context/
│   │   └── ThemeContext.jsx    # Theme state provider (light / dark)
│   ├── data/
│   │   └── projectsData.js     # Structured project metadata & case studies
│   ├── pages/
│   │   ├── Home.jsx            # Main landing page
│   │   └── ProjectDetailPage.jsx # Dynamic /project/:id case study page
│   ├── App.jsx                 # Router, layout wrapper & scroll handlers
│   ├── main.jsx                # Application root mount
│   └── style.css               # Global theme variables & typography
├── index.html                  # HTML entry with crawler form & pre-paint script
├── netlify.toml                # Netlify build & redirect specifications
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite React configuration
└── .gitignore                  # Git exclusions (node_modules, dist, etc.)
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Masad791/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 🚀 Building & Deployment

### Production Build
```bash
npm run build
```
Generates production-optimized static files in the `dist/` folder.

### Local Preview
```bash
npm run preview
```

### Deploying to Netlify
This repository is pre-configured with `netlify.toml` and `public/_redirects`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Submissions through the contact form are automatically processed and visible in the **Netlify Forms** dashboard.

---

## 📄 License
MIT License © 2026 Muhammad Asad
