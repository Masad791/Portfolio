/**
 * Centralized Profile & Portfolio Configuration
 * 
 * Customize this single file to personalize your portfolio's identity,
 * metadata, social links, contact endpoints, and branding across all components.
 */
export const profileData = {
  // Identity & Typography
  name: "Mr. ASAD",
  fullName: "Muhammad Asad",
  rolePrefix: "Software",
  roleHighlight: "Engineer",
  version: "V 4.0.1",
  status: "AVAILABLE",

  // Top Lateral Meta
  established: "EST. 2026",
  coordinates: "LAT 29.3957° N",

  // Contact & Form Handling
  // Form submissions will automatically route to this email via FormSubmit (100% free, zero backend)
  email: "muhammadasaddev31@gmail.com",

  // Social Channels
  socials: {
    github: "https://github.com/Masad791",
    linkedin: "https://www.linkedin.com/in/asaddevco/",
    email: "mailto:muhammadasaddev31@gmail.com"
  },

  // Media & Visual Elements
  morphImage: "/ME.png", // Place your photo in the public/ folder
  watermark: "MAD",       // Large stylized text in footer canvas

  // Footer Pitch
  footerHeadline: {
    line1: "Scaling Start-ups",
    highlight: "for Growth.",
    subtag: "// Engineered with Precision & Speed"
  },

  // Contact Form Pitch & Highlights
  contactPitch: {
    heading: "Let's build.",
    subheading: "Have a project in mind? Drop the details below. Let's create something massive.",
    highlights: [
      "Average response time: 2h",
      "Available for freelance",
      "Open to full-time roles"
    ]
  }
};
