# Creative Developer Portfolio // Open-Source Template

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)](https://greensock.com/)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Masad791/Portfolio)

An interactive, high-performance creative developer portfolio built with **React 18**, **Vite**, and official **GSAP 3** (`@gsap/react`, `ScrollTrigger`). Designed with a cinematic editorial aesthetic, fluid 3D card physics, horizontal pinned scroll, custom canvas particle simulations, dynamic dark/light themes, and 100% free serverless email form handling.

---

## ⚡ Highlights & Key Features

- **Centralized Profile Config (`src/data/profileData.js`)**: All personal identity, social links, contact info, and branding live in a single file for instant personalization.
- **GSAP Horizontal Pin Scroll**: Dynamic right-to-left project gallery in `#projects` with automatic travel measurement, 3D card flips, and real-time scroll-spy navbar indicator.
- **Fluid Morph Transition**: Seamless scrubbed cross-fade dissolving developer portrait into typography with hold buffering.
- **Interactive Canvas Physics**:
  - **Custom Cursor**: Particle trail with velocity-based attraction physics.
  - **Black Hole Event Horizon Footer**: Adaptive canvas particle accretion with cosmic amber glow and edge circulation.
- **Dual Theme Engine**: Instant pre-paint theme initialization (pure `#ffffff` light mode and cosmic black `#0a0a0b` dark mode) persisted in `localStorage` with zero refresh flash.
- **Dynamic Case Study Routing**: Reusable `/project/:id` pages powered by `projectsData.js` featuring architecture overviews, tech stacks, and visual showcases.
- **Zero-Backend Free Form Handling**: Submissions route directly to your personal email inbox via FormSubmit (100% free, no credit card or account needed) plus Netlify Forms dual-compatibility.

---

## 🚀 1-Click Quick Deploy

You can deploy your own copy of this portfolio to **Netlify** with a single click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Masad791/Portfolio)

---

## 🎨 How to Customize for Yourself (in 3 Minutes)

This template is architected so you **never have to dig through complex JSX files** to change personal details.

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/Portfolio.git
cd Portfolio
npm install
```

### 2. Personalize Identity in `src/data/profileData.js`
Open [`src/data/profileData.js`](src/data/profileData.js) and update:
```javascript
export const profileData = {
  name: "Your Name",
  fullName: "Your Full Name",
  rolePrefix: "Software",
  roleHighlight: "Engineer",
  email: "your.email@example.com", // Form messages will arrive here!
  socials: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    email: "mailto:your.email@example.com"
  },
  watermark: "YOUR_INITIALS",
  morphImage: "/ME.png"
  // ...
};
```

### 3. Add Your Projects in `src/data/projectsData.js`
Add or modify your projects in [`src/data/projectsData.js`](src/data/projectsData.js). Each project automatically gets:
- A 3D interactive card on the homepage horizontal scroll track.
- A dedicated, responsive deep-dive case study page at `/project/:id`.

### 4. Swap Your Portrait
Replace [`public/ME.png`](public/ME.png) with your own transparent PNG photo, or update the `morphImage` path in `profileData.js`.

---

## 📁 Project Structure

```text
Portfolio/
├── public/                     # Static assets & redirects
│   ├── _redirects              # Netlify SPA redirect rule (/* /index.html 200)
│   ├── ME.png                  # Developer portrait
│   └── *.png                   # Project preview thumbnails
├── src/
│   ├── components/             # Modular UI components
│   │   ├── BackgroundStars.jsx # Starfield pattern & noise overlay
│   │   ├── Capabilities.jsx    # Capabilities grid
│   │   ├── ContactForm.jsx     # Free email form + GSAP flying envelope
│   │   ├── CustomCursor.jsx    # 2D canvas particle cursor
│   │   ├── Footer.jsx          # Black hole canvas + brand watermark
│   │   ├── Hero.jsx            # Dynamic headline & animated tech boxes
│   │   ├── Marquee.jsx         # Infinite tech stack ticker
│   │   ├── MorphSection.jsx    # Scrubbed cross-fade morph section
│   │   ├── Navbar.jsx          # Glass navbar with scroll-spy sliding indicator
│   │   ├── ProjectCard.jsx     # 3D interactive flip card
│   │   ├── ProjectsHorizontal.jsx # Pinned horizontal ScrollTrigger track
│   │   └── Skills.jsx          # Architecture & stack table
│   ├── context/
│   │   └── ThemeContext.jsx    # Persistent light/dark theme provider
│   ├── data/
│   │   ├── profileData.js      # 👈 Central profile configuration
│   │   └── projectsData.js     # 👈 Projects & case studies dataset
│   ├── pages/
│   │   ├── Home.jsx            # Main landing page
│   │   └── ProjectDetailPage.jsx # Dynamic case study page (/project/:id)
│   ├── App.jsx                 # Router, layout & global scroll management
│   ├── main.jsx                # Application root entry
│   └── style.css               # Global theme variables & typography
├── LICENSE                     # MIT License
├── netlify.toml                # Netlify build & redirect specifications
├── package.json                # Dependencies & scripts
└── vite.config.js              # Vite React configuration
```

---

## 🛠️ Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Commands
```bash
# Install dependencies
npm install

# Start local dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📬 Contact Form Email Setup

The contact form uses [FormSubmit](https://formsubmit.co), requiring **zero backend** and **zero configuration**:
1. When you deploy and submit the contact form for the first time, FormSubmit sends an instant confirmation link to the email specified in `profileData.email`.
2. Click the **"Activate Form"** button in that email once.
3. Every future message sent by visitors on your website will land directly in your email inbox with the sender's name, email, and message!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Masad791/Portfolio/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).  
Copyright © 2026 [Muhammad Asad](https://github.com/Masad791).
