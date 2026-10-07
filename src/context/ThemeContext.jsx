import React, { createContext, useContext, useEffect, useState } from 'react';

export const LIQUID_METAL_PALETTE = {
  // All light tones: grey/deep-orange stops made headings look dull on the dark background.
  dark: ['#f4f4f5', '#d4d4d8', '#ff9a6b', '#e4e4e7', '#fafafa'],
  light: ['#18181b', '#52525b', '#c2410c', '#27272a', '#3f3f46'],
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.backgroundColor = '#0a0a0b';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.backgroundColor = '#ffffff';
      localStorage.setItem('theme', 'light');
    }

    // Enable smooth transitions after initial paint to prevent reload color flash
    const timer = setTimeout(() => {
      document.body.classList.add('theme-ready');
    }, 100);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
