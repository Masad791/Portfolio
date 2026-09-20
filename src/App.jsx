import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BackgroundStars from './components/BackgroundStars';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { PortalTransitionProvider } from './context/PortalTransitionContext';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <BackgroundStars />
      <CustomCursor />
      <ScrollHandler />

      {/* Render Main Navigation on Home Page */}
      {isHomePage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PortalTransitionProvider>
        <MainLayout />
      </PortalTransitionProvider>
    </BrowserRouter>
  );
}
