import React, { useEffect, useState } from 'react';

export default function ParticleBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="animated-bg" />
      <div className="synthwave-stars" />
      <div 
        className="retro-sun" 
        style={{ '--scroll-offset': `${scrollProgress * -30}vh` } as React.CSSProperties}
      />
      <div className="synthwave-mountains" />
      <div className="synthwave-mountains front" />
      <div className="retro-grid" />
      <div className="crt-scanlines" />
      <div className="crt-flicker" />
    </>
  );
}
