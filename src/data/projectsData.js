export const projects = [
  {
    id: "voice-changer",
    num: "01",
    featured: true,
    title: "Voice Changer",
    badge: "// REAL-TIME AI VOICE CONVERSION",
    shortDesc: "A Windows app that changes your voice live in Zoom, Meet and Discord with neural voice conversion running on a laptop CPU.",
    summary: "A real-time voice changer for calls. An Electron app routes the mic through a custom DSP chain and an on-demand Python engine running RVC v2 voice models on ONNX Runtime, so you sound like a different person instead of a pitched copy of yourself.",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["Electron", "Python", "ONNX", "Web Audio"],
    status: "Working Desktop App",
    transition: "organic-blob",
    transitionWord: "VOICE",
    image: "/projects/vc-cover.webp",
    accent: "#ea580c",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Realistic, Not Robotic",
      paragraphs: [
        "Classic pitch shifting makes you sound like yourself on helium. The goal was a voice that sounds like a different person, live, inside a normal video call.",
        "It also had to stay light. The app runs next to Zoom or Meet on a laptop without a GPU, so every feature was measured against CPU before it shipped."
      ],
      points: [
        "Five AI voices: Female, Male, Male (Essex), Old Man, Old Woman",
        "Instant PSOLA pitch and formant engine with no added delay",
        "Mic noise reduction and a self-calibrating noise gate",
        "Global hotkeys: Ctrl+Shift+B for your real voice, Ctrl+Shift+M to mute"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Two Engines, One Audio Graph",
      paragraphs: [
        "The Electron renderer runs the DSP in AudioWorklets: high-pass filter, noise suppression and a gate. Instant voices are processed right there.",
        "AI voices go to a Python sidecar that starts only when needed and talks to the app over a local WebSocket. It runs a two-stage RVC v2 pipeline on ONNX Runtime, skips silence entirely, and steps down to a lighter profile by itself if it falls behind. The result is sent to a virtual microphone (VB-Cable) that Zoom picks up."
      ],
      points: [
        "Python sidecar over a local WebSocket, started on demand",
        "RVC v2 on ONNX Runtime, CPU-first (faster than DirectML on this hardware)",
        "Silence skip: the AI engine idles at about 0% CPU between sentences",
        "Hardened Electron: sandboxed renderer, private app:// origin, validated IPC"
      ]
    },
    gallery: [
      { src: "/projects/vc-dark.webp", caption: "// 01. Dark mode, AI voice selected", fit: "contain" },
      { src: "/projects/vc-light.webp", caption: "// 02. Light mode follows Windows", fit: "contain" }
    ],
    metrics: [
      { number: "~0%", label: "CPU used while you are silent" },
      { number: "0.6-1s", label: "AI voice delay on a laptop CPU" },
      { number: "5", label: "Neural voices plus an instant one" },
      { number: "0 ms", label: "Added delay on the instant engine" }
    ]
  },
  {
    id: "bookmark-panels",
    num: "02",
    featured: true,
    title: "BookmarkPanels",
    badge: "// CHROME EXTENSION // MANIFEST V3",
    shortDesc: "A Chrome extension that keeps your bookmarks in floating glass panels and a slide-in sidebar on any page. Alt+B to open, stored locally.",
    summary: "BookmarkPanels turns bookmarks into draggable glass panels and a slide-in sidebar that work on top of any website, without replacing the New Tab page and without sending anything to a server.",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["JavaScript", "Chrome MV3", "Shadow DOM", "CSS"],
    status: "Open Source // v1.1.1",
    transition: "organic-blob",
    transitionWord: "PANELS",
    image: "/projects/bookmark-floating.webp",
    github: "https://github.com/Masad791/BookmarkPanels",
    accent: "#8fb3c9",
    challenge: {
      tag: "01 // CONTEXT",
      title: "An Overlay That Never Gets in the Way",
      paragraphs: [
        "Most bookmark tools take over your New Tab page. BookmarkPanels lives on top of whatever page you are already on and stays out of the way until you press Alt+B.",
        "The hard part is coexisting with every website: the page's CSS must not leak into the panels, and the panels must never block clicks, forms or search boxes underneath."
      ],
      points: [
        "Floating sticky-note panels or a slide-in glass sidebar",
        "Drag and drop for categories, bookmarks and panel positions",
        "Instant search across every category",
        "One-click import of existing Chrome bookmarks"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Content Script + Service Worker",
      paragraphs: [
        "A Manifest V3 service worker owns the toolbar action, the Alt+B command, the right-click 'Add to BookmarkPanels' menu and the Chrome bookmarks import.",
        "The UI is a dependency-free content script rendered inside a Shadow DOM, so host-page styles cannot break it. All data lives in chrome.storage.local and syncs live between tabs."
      ],
      points: [
        "Shadow DOM isolation from host-page CSS",
        "chrome.storage.local only: no backend, no tracking",
        "Four permissions: bookmarks, storage, contextMenus, activeTab",
        "Dark and light themes with watercolor accents"
      ]
    },
    gallery: [
      { src: "/projects/bookmark-overview.webp", caption: "// 01. Slide-in glass sidebar" },
      { src: "/projects/bookmark-any-site.webp", caption: "// 02. Works on top of any website" },
      { src: "/projects/bookmark-search.webp", caption: "// 03. Instant search across panels" },
      { src: "/projects/bookmark-light.webp", caption: "// 04. Light theme" }
    ],
    metrics: [
      { number: "0", label: "Servers. Your data stays in your browser" },
      { number: "Alt+B", label: "Opens it on any page" },
      { number: "4", label: "Chrome permissions requested" },
      { number: "0", label: "Runtime dependencies" }
    ]
  },
  {
    id: "finance-system",
    num: "03",
    featured: true,
    title: "Finance Management System",
    badge: "// MODULAR LARAVEL API",
    shortDesc: "Backend for a finance management platform: a modular Laravel 12 API with role-based permissions, Google sign-in, OTP reset and a queued image pipeline.",
    summary: "The backend of a finance management system, built as a modular Laravel 12 API. I designed the module layout, the permission model, authentication flows and the media pipeline that turns every upload into an optimized WebP on Cloudinary.",
    role: "Backend Developer",
    timeline: "2026",
    stack: ["Laravel 12", "Sanctum", "Cloudinary", "Queues"],
    status: "Private Repository",
    transition: "organic-blob",
    transitionWord: "FINANCE",
    image: "/projects/fms-cover.webp",
    accent: "#a3e635",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Strict Access, Clean Modules",
      paragraphs: [
        "Finance software lives or dies on who can see and change what. Every admin action in this API sits behind an explicit permission, not just a logged-in check.",
        "The codebase is split into independent modules so features like companies or notifications can grow without turning the app into one tangled folder."
      ],
      points: [
        "Five modules: Admin, Core, User, Company, Notification",
        "Per-route permission middleware (users.view, users.create, users.update...)",
        "Google OAuth via Socialite, plus email OTP password reset",
        "Separate rate limiters for api, auth and sensitive routes"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "The Image Pipeline",
      paragraphs: [
        "Uploads are checked by their real MIME type, not the file extension. Intervention Image re-encodes them to WebP at quality 80, which also strips anything that is not a real image, and the result goes to Cloudinary.",
        "Profile images are processed in a queued job with 3 retries and a 120 second timeout, and the temp file is cleaned up on success and on failure. OTP and welcome emails are queued too, so requests return fast."
      ],
      points: [
        "Repository + service layers keep controllers thin",
        "Sanctum token auth with UUID-based public IDs",
        "Role list cached for 6 hours with Cache::remember",
        "Interface contracts bound per module for swappable services"
      ]
    },
    metrics: [
      { number: "5", label: "Laravel modules" },
      { number: "WebP", label: "Every upload re-encoded at q80" },
      { number: "3", label: "Retries on the queued image job" },
      { number: "6 h", label: "Role cache lifetime" }
    ]
  },
  {
    id: "devpulse",
    num: "04",
    title: "DevPulse",
    badge: "// TECH NEWS AGGREGATOR // NEXT.JS 16",
    shortDesc: "An open-source tech news aggregator that merges 54 sources into one ranked feed, plus trending repos, discussions and issues to contribute to.",
    summary: "DevPulse collects engineering news from 54 free sources (RSS feeds, Hacker News, Dev.to, Lobsters and Hugging Face papers) and ranks it into topic feeds, with a live Buzz panel from Bluesky and Mastodon. It runs on the Next.js 16 App Router with incremental static regeneration and no database.",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Vitest"],
    status: "Open Source // MIT",
    transition: "organic-blob",
    transitionWord: "PULSE",
    image: "/projects/devpulse-news.webp",
    github: "https://github.com/Masad791/devpulse",
    challenge: {
      tag: "01 // CONTEXT",
      title: "One Feed From 54 Sources",
      paragraphs: [
        "Engineers follow news across a dozen sites with different formats, rate limits and ideas of what is popular. DevPulse turns all of that into one fast, ranked page per topic.",
        "Some data simply has no API: GitHub has no trending endpoint, so the repos page is built from GitHub search, ranking new and recently active repositories by stars."
      ],
      points: [
        "12 topic feeds plus a personal 'For you' view",
        "Trending repositories by topic and language",
        "Open issues to contribute to, filtered by label, language and repo",
        "Discussions ranked by comment heat across HN, Lobsters and Dev.to"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "A Pure Pipeline, Cached Once",
      paragraphs: [
        "Each source is a small adapter. Their items flow into a pure pipeline that tags topics, removes duplicates, ranks and paginates, so the core logic is unit tested without any network.",
        "The whole feed lives in a single cache entry, refreshed through a concurrency-limited fetch pool. Pages regenerate every 5 minutes (2 on the home page), and topic pages are not prebuilt, which avoids a cache stampede at build time."
      ],
      points: [
        "Pure pipeline: tag, dedupe, rank, paginate",
        "One cached feed behind a concurrency-limited fetch pool",
        "Theme applied by an inline script before first paint",
        "CI on GitHub Actions: lint, typecheck, Vitest and build"
      ]
    },
    gallery: [
      { src: "/projects/devpulse-news.webp", caption: "// 01. Ranked news feed with live Buzz" },
      { src: "/projects/devpulse-repos.webp", caption: "// 02. Trending repositories by topic" }
    ],
    metrics: [
      { number: "54", label: "News sources in one feed" },
      { number: "12", label: "Topic feeds" },
      { number: "5 min", label: "Page regeneration interval" },
      { number: "0", label: "Databases needed" }
    ]
  },
  {
    id: "cinebook",
    num: "05",
    title: "CineBook",
    badge: "// REAL-TIME SEAT BOOKING // LARAVEL",
    shortDesc: "A cinema booking system where seats are held atomically in Redis and every viewer sees holds appear on the seat map live.",
    summary: "CineBook is a modular Laravel booking platform for cinemas. Its core problem is the classic double booking race: two people clicking the same seat at the same moment. Seats are held for 7 minutes by an atomic Redis Lua script and broadcast to every open seat map over WebSockets.",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["Laravel", "Redis", "Reverb", "Vue", "Postgres"],
    status: "In Development",
    transition: "organic-blob",
    transitionWord: "CINEMA",
    image: "/projects/cinebook-cover.webp",
    challenge: {
      tag: "01 // CONTEXT",
      title: "No Double Bookings, Ever",
      paragraphs: [
        "A seat map looks simple until two people grab the same seat in the same millisecond. Checking first and writing second leaves a gap where both requests succeed.",
        "CineBook closes that gap in the data layer itself: Postgres guards the schedule, Redis guards the seats, and the browser only ever reflects what those two already decided."
      ],
      points: [
        "Postgres exclusion constraint: no overlapping shows in one hall",
        "Seat holds expire on their own after 7 minutes",
        "Live seat map: every viewer sees holds and releases instantly",
        "Admin screens for movies, venues and shows behind can:admin"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Redis for Holds, Postgres for Truth",
      paragraphs: [
        "A hold is one Redis key per seat with a TTL. A Lua script checks every requested seat and sets them all in one atomic step, or sets none. Release only deletes keys you still own, so it can never free a seat someone else just took.",
        "SeatsHeld and SeatsReleased events go out on a public show channel through Laravel Reverb, and a hold-expiry worker announces seats freed by the TTL. The Vue seat map listens with Echo."
      ],
      points: [
        "All-or-nothing Lua holds in a single Redis round trip",
        "Owner-checked release, never a blind DEL",
        "Rate-limited hold endpoints (throttle:holds)",
        "Ten nwidart modules from Identity to Payment"
      ]
    },
    metrics: [
      { number: "420 s", label: "Seat hold lifetime" },
      { number: "1", label: "Redis round trip per hold" },
      { number: "10", label: "Laravel modules" },
      { number: "36+", label: "Automated tests" }
    ]
  },
  {
    id: "video-upscaler",
    num: "06",
    title: "Video Upscaler",
    badge: "// OFFLINE UPSCALER // PYTHON + FFMPEG",
    shortDesc: "A one-click offline upscaler for movies and anime that runs neural shaders on a laptop iGPU, from a single file to a whole season.",
    summary: "An upload-and-it-works upscaler for hour-long videos, fully offline. It picks the right technique for the content: FSRCNNX neural shaders for real footage, Anime4K for animation, and Real-ESRGAN when quality matters more than time.",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["Python", "FFmpeg", "Vulkan", "Real-ESRGAN"],
    status: "Working Desktop Tool",
    transition: "organic-blob",
    transitionWord: "UPSCALE",
    image: "/projects/upscaler-cover.webp",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Hour-Long Videos on a Laptop",
      paragraphs: [
        "Heavy AI upscalers need a big GPU and hours per episode. This one had to run on a laptop with integrated graphics and still finish a movie in reasonable time.",
        "Long jobs also fail: the laptop sleeps, the app gets closed. Every run had to survive that and pick up exactly where it stopped."
      ],
      points: [
        "Real video and Anime modes with tuned models for each",
        "Fast, Balanced, High and Max AI quality presets",
        "Batch a whole season, processed in name order",
        "Keeps Windows awake while it runs"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Shaders First, AI When It Pays Off",
      paragraphs: [
        "Balanced and High run FSRCNNX GLSL shaders inside FFmpeg through libplacebo on Vulkan. Anime4K's three CNN passes are concatenated into one shader file, because libplacebo accepts a single shader.",
        "Video is processed in 60 second segments stored in a work folder keyed by a hash of the settings, so a restart resumes instead of starting over. Segments are joined and the audio is muxed back at the end."
      ],
      points: [
        "Measured on the target laptop, not guessed",
        "Hardware encoder dropped: it fought the shader for the iGPU",
        "Tk GUI plus a CLI with wildcards for overnight batches",
        "One-file Python app with its own test suite"
      ]
    },
    gallery: [
      { src: "/projects/upscaler-gui.webp", caption: "// 01. One window, four quality modes", fit: "contain" }
    ],
    metrics: [
      { number: "~3x", label: "Real time in Fast mode" },
      { number: "~1x", label: "Real time with neural shaders" },
      { number: "4", label: "Quality modes" },
      { number: "60 s", label: "Resumable segments" }
    ]
  },
  {
    id: "task-management-api",
    num: "07",
    title: "Task Management API",
    badge: "// TEAM WORKSPACE API // LARAVEL 12",
    shortDesc: "A modular Laravel 12 API for teams: projects, task assignment, comments and permission-guarded user management.",
    summary: "The backend for a team task manager. Admins manage users and projects, assign people to projects and tasks, and every route group is protected by its own permission, all on a modular Laravel 12 codebase with Sanctum tokens.",
    role: "Backend Developer",
    timeline: "2025 - 2026",
    stack: ["Laravel 12", "Sanctum", "Modules", "REST"],
    status: "Private Repository",
    transition: "organic-blob",
    transitionWord: "TASKS",
    image: "/projects/taskflow-cover.webp",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Who Can Touch What",
      paragraphs: [
        "A team tool has very different users: admins who manage people, leads who run projects, and members who work on tasks. The API needed clear boundaries between them.",
        "Deleting things by mistake is common in task tools, so users and projects are soft deleted and can be restored."
      ],
      points: [
        "Separate permissions: user.manage, project.manage, task.manage",
        "Assign and manage users per project",
        "Task assignment, filtering and comments",
        "Restore endpoints for soft-deleted users and projects"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Modules and Permission Groups",
      paragraphs: [
        "The app is split into Admin, Auth, Core and User modules with nwidart/laravel-modules, so each area owns its routes, controllers and data.",
        "Routes are grouped by permission middleware on top of Sanctum authentication, and public identifiers are UUIDs instead of auto-increment IDs."
      ],
      points: [
        "Sanctum token authentication",
        "Permission middleware per route group",
        "UUID public identifiers",
        "Filtered task listing endpoint"
      ]
    },
    metrics: [
      { number: "4", label: "Laravel modules" },
      { number: "3", label: "Permission scopes" },
      { number: "20+", label: "API endpoints" },
      { number: "UUID", label: "Public identifiers" }
    ]
  },
  {
    id: "singularity",
    num: "08",
    title: "Singularity Engine",
    badge: "// INTERACTIVE WEBGL // THREE.JS + GLSL",
    shortDesc: "An interactive black hole where your cursor becomes a second one. The primary horizon hunts it through 112,000 particles until they collide.",
    summary: "A browser experiment about gravity. A primary black hole drifts after your cursor while it eats a 112,000-particle disk, and your cursor is a second black hole that bends the starfield with real-time gravitational lensing. When the two meet, a flash and a shockwave start a chain reaction that decides which horizon swallows the other.",
    role: "Creative Coding",
    timeline: "2026",
    stack: ["Three.js", "GLSL", "WebGL"],
    status: "Interactive Experiment",
    transition: "organic-blob",
    transitionWord: "SINGULARITY",
    image: "/projects/singularity-cover.webp",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Gravity You Can Play With",
      paragraphs: [
        "Most black hole visuals are something you watch. This one is something you are: the moment the mouse enters the page, the cursor turns into a black hole with its own pull and its own lensing.",
        "The primary horizon slowly hunts you. Stay away and you watch it feed; let it catch you and the two collide."
      ],
      points: [
        "Cursor becomes a black hole that bends light around it",
        "Primary horizon drifts after the cursor while it feeds",
        "Collision triggers a flash, a shockwave and a chain reaction",
        "A live counter of particles left in the disk"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Two Render Passes",
      paragraphs: [
        "Pass one renders the particle disk and a 140,000-star field into an off-screen texture. Pass two is a full-screen shader that samples that texture and bends the UVs around each horizon with an inverse-square falloff, then draws the photon ring and the warm halo.",
        "Gravity is computed per particle in the vertex shader: each one is pulled toward both holes, and anything that crosses a horizon is discarded in the fragment shader, so the GPU does all the bookkeeping."
      ],
      points: [
        "Render-to-texture plus a full-screen lensing shader",
        "Inverse-square UV bending around both horizons",
        "Per-particle pull toward two moving masses",
        "Consumed particles discarded on the GPU"
      ]
    },
    gallery: [
      { src: "/projects/singularity-hunt.webp", caption: "// 01. The primary horizon feeding on the disk" }
    ],
    metrics: [
      { number: "112,000", label: "Disk particles" },
      { number: "140,000", label: "Background stars" },
      { number: "2", label: "Lensing horizons" },
      { number: "2", label: "Render passes per frame" }
    ]
  }
];
