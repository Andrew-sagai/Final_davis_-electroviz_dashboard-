import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingBag, Download, RotateCcw, Sparkles, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { exportToCSV } from '../../utils/analytics';

export default function Navbar() {
  const { isSimpleMode, toggleSimpleMode, filteredData, resetFilters } = useAppStore();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/sales', label: 'Sales & Products', icon: ShoppingBag },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'rgba(10, 4, 6, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          whileHover={{ scale: 1.02 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-red-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#fff',
          }}>
            EV
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
              <span className="gradient-text">ElectroViz</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: -2, letterSpacing: '0.05em' }}>
              ANALYTICS
            </div>
          </div>
        </motion.div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            title="Reset Filters"
            style={{
              background: 'rgba(255, 42, 75, 0.1)',
              border: '1px solid var(--glass-border)',
              borderRadius: 8, padding: '8px 12px',
              color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportToCSV(filteredData, 'electronics_sales_export.csv')}
            title="Export CSV"
            style={{
              background: 'rgba(255, 184, 0, 0.1)',
              border: '1px solid rgba(255, 184, 0, 0.2)',
              borderRadius: 8, padding: '8px 12px',
              color: 'var(--accent-gold)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
            }}
          >
            <Download size={14} />
            <span>Export</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSimpleMode}
            title={isSimpleMode ? "Enable Retro Effects" : "Switch to Professional Mode"}
            style={{
              background: isSimpleMode ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 0, 255, 0.1)',
              border: `1px solid ${isSimpleMode ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 0, 255, 0.3)'}`,
              borderRadius: 8, padding: '8px 12px',
              color: isSimpleMode ? 'var(--accent-cyan)' : 'var(--accent-pink)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
            }}
          >
            {isSimpleMode ? <Layers size={14} /> : <Sparkles size={14} />}
            <span>{isSimpleMode ? 'Pro Mode' : 'Retro Mode'}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
