export const projects = [
  {
    id: "1",
    num: "01",
    title: "Nebula Platform",
    badge: "// DISTRIBUTED E-COMMERCE INFRASTRUCTURE",
    shortDesc: "A high-traffic e-commerce engine handling 50k+ daily users. Built with Next.js, GraphQL, and microservices architecture.",
    summary: "A high-concurrency e-commerce orchestration engine designed to process 50,000+ daily orders with resilient microservices, distributed GraphQL caching, and sub-150ms checkout latency.",
    role: "Full-Stack Architect",
    timeline: "2025 — 2026",
    stack: ["React", "Node", "GraphQL", "AWS"],
    status: "Production Active",
    image: "/Rohi-lms-project.png",
    challenge: {
      tag: "01 // CONTEXT",
      title: "The Engineering Challenge",
      paragraphs: [
        "Legacy monolithic architectures often buckle under flash sales and sudden traffic surges. Nebula Platform was engineered from the ground up to solve transaction bottlenecking, inventory race conditions, and sluggish checkout workflows.",
        "The core objective was delivering consistent, deterministic response times regardless of traffic surges, while providing an authoring experience that marketing teams could operate without engineering intervention."
      ],
      points: [
        "Zero-downtime database schema migrations",
        "Optimistic UI state with instant cart validation",
        "Multi-region AWS load-balanced edge deployment",
        "Realtime telemetry & anomaly detection"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "System Architecture",
      paragraphs: [
        "The architecture decouples the frontend Presentation Layer from backend business logic using Apollo Federation GraphQL gateways. Microservices handle billing, catalog indexing, and real-time inventory through Redis queues.",
        "Every order mutation is processed idempotently with distributed lock mechanisms, eliminating double-billing or phantom inventory reads during high-load sale intervals."
      ],
      points: [
        "Apollo GraphQL Federation Gateway",
        "Redis distributed locking for inventory sync",
        "Docker containers orchestrated via ECS Fargate",
        "PostgreSQL read replicas with automatic failover"
      ]
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        caption: "// 01. Telemetry Dashboard & Real-Time Orders"
      },
      {
        src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop",
        caption: "// 02. Dynamic Checkout & Payment Gateway"
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        caption: "// 03. High-Density Inventory Matrix"
      }
    ],
    metrics: [
      { number: "99.98%", label: "SLA Uptime Across 12 Months" },
      { number: "120ms", label: "Average P95 API Latency" },
      { number: "50k+", label: "Daily Active Customers" },
      { number: "3.8x", label: "Conversion Lift Post-Launch" }
    ]
  },
  {
    id: "2",
    num: "02",
    title: "Orbital Tracker",
    badge: "// 3D GEOSPATIAL & REALTIME TELEMETRY",
    shortDesc: "Real-time satellite tracking dashboard using WebGL for 3D globe rendering and WebSockets for live telemetry streams.",
    summary: "A high-performance WebGL dashboard plotting real-time orbital paths for 12,000+ satellites using Three.js custom shaders, binary WebSocket telemetry, and predictive Keplerian calculations.",
    role: "Graphics & Frontend Engineer",
    timeline: "2025 — 2026",
    stack: ["Three.js", "WebGL", "WebSockets", "Go"],
    status: "Active Live Stream",
    image: "/Amg-trading.png",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Data Density at 60 FPS",
      paragraphs: [
        "Rendering thousands of moving orbital objects in browser viewports while maintaining an uncompromising 60 FPS refresh rate requires bypassing standard DOM nodes and orchestrating GPU instanced meshes directly.",
        "Orbital Tracker parses continuous satellite telemetry frames pushed from Go microservices over binary WebSockets, updating ephemeris coordinates with mathematical precision without causing garbage collection spikes."
      ],
      points: [
        "GPU instancing for 12,000+ distinct orbital bodies",
        "Binary Protobuf WebSocket stream reducing bandwidth by 72%",
        "Interactive orbit altitude filter & debris tracking",
        "Custom GLSL atmospheric glow and sun lighting shaders"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "WebGL Pipeline & Shaders",
      paragraphs: [
        "Using Three.js InstancedMesh and custom GLSL vertex shaders, satellite coordinates are evaluated in parallel on GPU compute passes. Camera positions interpolate smoothly via quaternion slerp rotations with mouse raycasting for millisecond-fast telemetry inspections.",
        "The Go backend runs an event-loop that aggregates NASA and ESA public TLE feeds, computes SGP4 perturbation models, and distributes position delta vectors to connected clients."
      ],
      points: [
        "Instanced buffer geometry for minimal draw calls",
        "SGP4 orbit propagation algorithm running in WebAssembly",
        "Raycast satellite picking with 1ms response latency",
        "Adaptive Level of Detail (LOD) based on zoom depth"
      ]
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
        caption: "// 01. 3D Earth Globe with Constellation Meshes"
      },
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
        caption: "// 02. Real-Time Telemetry Stream & Doppler Shift"
      },
      {
        src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
        caption: "// 03. High-Frequency Signal & Pass Calculator"
      }
    ],
    metrics: [
      { number: "60 FPS", label: "Smooth Frame Rate on Mobile & Desktop" },
      { number: "12,000+", label: "Concurrently Rendered Satellites" },
      { number: "< 35ms", label: "Realtime Telemetry Latency" },
      { number: "72%", label: "Bandwidth Saved via Binary Protocols" }
    ]
  },
  {
    id: "3",
    num: "03",
    title: "Quantum CMS",
    badge: "// HEADLESS ARCHITECTURE & CONTENT ENGINE",
    shortDesc: "A block-based, headless content management system designed for massive blogs. Features serverless image optimization.",
    summary: "An enterprise-grade headless content management ecosystem built with Vue.js, GraphQL, and Redis edge caching, powering multi-tenant digital publications with instantaneous live previewing.",
    role: "Lead Backend & CMS Architect",
    timeline: "2025",
    stack: ["Vue.js", "GraphQL", "Redis", "PHP"],
    status: "Live Across 14 Publications",
    image: "/AMG trading.png",
    challenge: {
      tag: "01 // CONTEXT",
      title: "The Editorial Bottleneck",
      paragraphs: [
        "High-volume publications publish hundreds of time-critical articles each week. Traditional CMS systems lock editors into bloated database operations, slow preview generation, and inflexible page builders that hurt SEO and Core Web Vitals.",
        "Quantum CMS decouples content modeling from distribution. Authors get a notion-style block editor with real-time multiplayer collaboration, while consumers receive static HTML served through globally cached edge networks."
      ],
      points: [
        "Custom block-based JSON serialization engine",
        "Real-time collaborative editing using Operational Transformation",
        "Serverless image transcoding pipeline on upload",
        "Sub-50ms static site regeneration hooks"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Data Model & Edge Invalidation",
      paragraphs: [
        "Articles, media assets, and author relationships are normalized in PostgreSQL, with full-text search indexed in MeiliSearch. Updates immediately broadcast invalidation tags to Redis cluster nodes, wiping stale cache entries worldwide in under 80 milliseconds.",
        "The editor client leverages Vue 3 Composition API with pinia state management, persisting offline draft saves into IndexedDB so editors never lose progress during connection loss."
      ],
      points: [
        "Surrogate-key cache purge via Cloudflare Edge workers",
        "Offline-first draft synchronization via IndexedDB",
        "GraphQL custom schema stitching for third-party feeds",
        "Granular role-based access control (RBAC) with audit logs"
      ]
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
        caption: "// 01. Distraction-Free Block Editor Canvas"
      },
      {
        src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
        caption: "// 02. Serverless Media Asset Ingestion"
      },
      {
        src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop",
        caption: "// 03. Publication Traffic & Readership Metrics"
      }
    ],
    metrics: [
      { number: "100/100", label: "Google Lighthouse Performance Score" },
      { number: "< 40ms", label: "Global Edge Cache Hit Latency" },
      { number: "14", label: "Live Digital Media Outlets Powered" },
      { number: "10M+", label: "Monthly Article Pageviews Served" }
    ]
  },
  {
    id: "4",
    num: "04",
    title: "Synapse AI",
    badge: "// MACHINE LEARNING & TELEMETRY ANALYTICS",
    shortDesc: "An AI-driven analytics dashboard that processes terabytes of log data to predict user churn using TensorFlow.",
    summary: "An enterprise predictive intelligence dashboard that ingests terabytes of raw server access logs to predict user churn, identify anomalous ingress vectors, and simulate retention cohorts using TensorFlow and D3.js.",
    role: "ML & Visualization Engineer",
    timeline: "2025 — 2026",
    stack: ["Python", "TensorFlow", "D3.js", "ClickHouse"],
    status: "Active Cluster Deployment",
    image: "/Rohi-lms-project.png",
    challenge: {
      tag: "01 // CONTEXT",
      title: "The Signal in the Noise",
      paragraphs: [
        "Enterprises generate billions of unstructured log rows daily. By the time quarterly analytics reports pinpoint user drop-offs, accounts have already churned. Synapse AI provides operational teams with real-time proactive risk scores.",
        "The platform shifts telemetry from post-mortem auditing to real-time predictive alerting. Using LSTM neural networks trained on historical user paths, it predicts churn probabilities with 93.4% accuracy two weeks in advance."
      ],
      points: [
        "Continuous stream ingestion of 100,000+ events/sec via Kafka",
        "Realtime churn scoring using optimized ONNX runtimes",
        "Interactive D3.js multi-dimensional cohort sankey diagrams",
        "Automated webhook triggers to CRM & retention platforms"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Data Ingestion & Neural Models",
      paragraphs: [
        "Event pipelines route through Apache Kafka into ClickHouse columnar storage for lightning-fast aggregation queries. Micro-batches of normalized feature vectors are fed into quantized TensorFlow models running on GPU-accelerated inference workers.",
        "The frontend interface renders interactive SVG and Canvas visual graphs with custom D3 force-directed simulations, allowing executives to dissect multi-attribute clusters effortlessly."
      ],
      points: [
        "ClickHouse columnar database for sub-second aggregations",
        "Quantized FP16 inference for 4x faster neural pass speed",
        "Declarative D3.js data visualizations with canvas fallbacks",
        "End-to-end encrypted telemetry transport with TLS 1.3"
      ]
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        caption: "// 01. Neural Churn Prediction Matrix"
      },
      {
        src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
        caption: "// 02. Ingestion Pipeline & Cluster Health"
      },
      {
        src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop",
        caption: "// 03. Dynamic Cohort Flow & Sankey Graph"
      }
    ],
    metrics: [
      { number: "93.4%", label: "Model Prediction Accuracy" },
      { number: "100k/s", label: "Log Event Ingestion Throughput" },
      { number: "14 Days", label: "Advance Churn Detection Window" },
      { number: "2.4x", label: "Retention Intervention ROI" }
    ]
  },
  {
    id: "5",
    num: "05",
    title: "Aether Protocol",
    badge: "// HIGH-FREQUENCY DECENTRALIZED PROTOCOL",
    shortDesc: "High-frequency decentralized liquidity router and telemetry engine handling $40M+ weekly volume with sub-second finality.",
    summary: "A memory-safe decentralized order-matching and liquidity routing engine executing on bare-metal Rust daemons, settling multi-chain trades with sub-second block finality.",
    role: "Lead Systems Engineer",
    timeline: "2025 — 2026",
    stack: ["Rust", "Solidity", "Docker", "WASM"],
    status: "Mainnet Active ($40M+ Vol)",
    image: "/Amg-trading.png",
    challenge: {
      tag: "01 // CONTEXT",
      title: "Liquidity Fragmentation",
      paragraphs: [
        "Decentralized exchanges suffer from severe liquidity fragmentation across isolated smart contracts. Traders frequently face painful slippage, front-running attacks by MEV bots, and slow transaction propagation.",
        "Aether Protocol resolves this with an off-chain lock-free orderbook matched via compiled Rust workers, generating verifiable zero-knowledge proofs settled in unified on-chain batch settlements."
      ],
      points: [
        "Off-chain atomic order matching engine with zero garbage-collection pauses",
        "MEV-resistant encrypted mempool with threshold decryption",
        "Multi-hop route aggregation finding optimal price routes in < 15ms",
        "Automated smart-contract invariant testing via Foundry and Echidna"
      ]
    },
    architecture: {
      tag: "02 // BLUEPRINT",
      title: "Rust Actor Model & Smart Contracts",
      paragraphs: [
        "The core engine employs Tokio asynchronous runtimes with lock-free ring buffers (Disruptor pattern), processing up to 150,000 order quotes per second on a single machine. Smart contracts deployed on EVM L2 networks ingest compressed state diffs verified by cryptographic accumulators.",
        "Client interfaces leverage WebAssembly compiled modules for local order signing, keeping private keys securely air-gapped from network transport layers."
      ],
      points: [
        "Tokio asynchronous actor framework with low-latency NUMA pins",
        "EIP-712 typed data hashing and signature validation",
        "WebAssembly client-side cryptographic hashing pipeline",
        "Continuous Prometheus and Grafana telemetry tracking slip rates"
      ]
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
        caption: "// 01. Real-Time High-Density Orderbook"
      },
      {
        src: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop",
        caption: "// 02. Multi-Hop Liquidity Graph Routing"
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        caption: "// 03. Batch Settlement Gas Telemetry"
      }
    ],
    metrics: [
      { number: "$42M+", label: "Weekly Settled Trading Volume" },
      { number: "< 15ms", label: "Average Order Matching Latency" },
      { number: "150k/s", label: "Engine Quote Throughput" },
      { number: "0", label: "Reported MEV Exploits Since Genesis" }
    ]
  }
];
