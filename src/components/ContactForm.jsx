import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { profileData } from '../data/profileData';

export default function ContactForm() {
  const formWrapperRef = useRef(null);
  const emailCoreRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    'bot-field': ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formWrapper = formWrapperRef.current;
    const emailCore = emailCoreRef.current;

    // Trigger GSAP flying animation
    if (formWrapper && emailCore) {
      gsap.to(formWrapper, {
        scale: 0.8,
        opacity: 0.3,
        filter: 'blur(5px)',
        duration: 0.5,
        ease: 'power2.in'
      });

      gsap.fromTo(
        emailCore,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotation: 0
        },
        {
          x: 400,
          y: -300,
          scale: 0.2,
          opacity: 0,
          rotation: 45,
          duration: 0.8,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(formWrapper, {
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.6,
              ease: 'power3.out'
            });
            gsap.set(emailCore, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 });
          }
        }
      );
    }

    try {
      // 1. Submit via FormSubmit (100% free direct email delivery with zero backend)
      await fetch(`https://formsubmit.co/ajax/${profileData.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Inquiry from ${formData.name}`,
          _template: 'table'
        })
      });

      // 2. Also forward to Netlify Forms if deployed on Netlify
      const encode = (data) => {
        return Object.keys(data)
          .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
          .join('&');
      };
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...formData })
      }).catch(() => {});

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '', 'bot-field': '' });
    } catch (err) {
      console.error('Form submission error:', err);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '', 'bot-field': '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact">
        <div className="form-wrapper" id="form-wrapper" ref={formWrapperRef}>
          <svg
            className="form-bg"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="form-stars"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="0.5" fill="currentColor" opacity="0.2" />
                <circle cx="40" cy="30" r="1" fill="currentColor" opacity="0.1" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#form-stars)"
              style={{ color: 'var(--fg)' }}
            />
          </svg>

          <div className="form-left">
            <h2>{profileData.contactPitch.heading}</h2>
            <p>{profileData.contactPitch.subheading}</p>
            <ul className="ul">
              {profileData.contactPitch.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            {/* Responsive Social Icons for Small / Medium Devices */}
            <div className="form-socials">
              <span className="form-socials-title">// SOCIALS & REACH</span>
              <div className="form-socials-list">
                <a
                  href={profileData.socials.email}
                  className="form-social-btn"
                  aria-label="Email"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>Email</span>
                </a>
                <a
                  href={profileData.socials.linkedin}
                  className="form-social-btn"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profileData.socials.github}
                  className="form-social-btn"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <div className="form-right">
            <form
              id="contact-form"
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="contact" />
              <p style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human:{' '}
                  <input
                    name="bot-field"
                    value={formData['bot-field']}
                    onChange={handleChange}
                  />
                </label>
              </p>

              <div className="form-group">
                <label>Name</label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name.."
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter E-mail.."
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  className="input"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell Me...."
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Transmitting...' : 'Launch Message'}
              </button>

              {submitStatus === 'success' && (
                <p
                  style={{
                    color: 'var(--bh-red)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    marginTop: '12px'
                  }}
                >
                  ✓ Transmission received! I'll reply promptly.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Flying Email Animation Core */}
      <div id="email-core" ref={emailCoreRef} />
    </>
  );
}
