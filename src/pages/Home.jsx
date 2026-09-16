import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import MorphSection from '../components/MorphSection';
import Skills from '../components/Skills';
import Capabilities from '../components/Capabilities';
import ProjectsHorizontal from '../components/ProjectsHorizontal';
import Marquee from '../components/Marquee';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after initial mount and layout calculations
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <Hero />
      <MorphSection />
      <Skills />
      <Capabilities />
      <ProjectsHorizontal />
      <Marquee />
      <ContactForm />
      <Footer />
    </main>
  );
}
