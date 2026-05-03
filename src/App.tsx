import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { loadCSVData } from './services/data';
import Navbar from './components/ui/Navbar';
import ParticleBackground from './components/ui/ParticleBackground';
import AIChatWidget from './components/ui/AIChatWidget';
import SkeletonLoader from './components/ui/SkeletonLoader';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Customers = lazy(() => import('./pages/Customers'));
const Sales = lazy(() => import('./pages/Sales'));

function PageLoader() {
  return (
    <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
      <SkeletonLoader height={100} count={5} />
      <div style={{ marginTop: 24 }}><SkeletonLoader height={350} count={2} /></div>
    </div>
  );
}

export default function App() {
  const { setRawData, setLoading, setError, isDarkMode, isSimpleMode, isLoading, error } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const data = await loadCSVData();
        setRawData(data);
      } catch (err: any) {
        console.error('Failed to load data:', err);
        setError(err.message || 'Failed to load dataset');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Apply theme class
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  // Apply simple mode class
  useEffect(() => {
    if (isSimpleMode) {
      document.body.classList.add('simple-mode');
    } else {
      document.body.classList.remove('simple-mode');
    }
  }, [isSimpleMode]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, padding: 24,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: 'var(--gradient-red-gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          ⚠️
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Failed to Load Data</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400 }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'var(--gradient-1)',
            border: 'none', borderRadius: 10, padding: '10px 24px',
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ParticleBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales" element={<Sales />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <AIChatWidget />
      </div>
    </div>
  );
}
