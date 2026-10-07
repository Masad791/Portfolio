import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import MorphSection from '../components/MorphSection';
import Manifesto from '../components/Manifesto';
import Skills from '../components/Skills';
import WorkCanvas from '../components/WorkCanvas';
import Capabilities from '../components/Capabilities';
import FeaturedWork from '../components/FeaturedWork';
import ProjectPanels from '../components/ProjectPanels';
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
      <Manifesto />
      <Skills />
      <WorkCanvas />
      <Capabilities />
      <FeaturedWork />
      <ProjectPanels />
      <Marquee />
      <ContactForm />
      <Footer />
    </main>
  );
}
