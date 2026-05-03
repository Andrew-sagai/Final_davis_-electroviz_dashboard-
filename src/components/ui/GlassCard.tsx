import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  glowColor?: string;
  noPadding?: boolean;
  icon?: React.ElementType;
}

export default function GlassCard({
  children, title, subtitle, className = '', style = {},
  delay = 0, noPadding = false, icon: Icon
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98, filter: 'blur(15px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      whileHover={{ x: -2, y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      style={{ padding: noPadding ? 0 : 24, transformPerspective: 1200, ...style }}
      className={`glass-card ${className}`}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
              {Icon && <Icon size={18} style={{ color: 'var(--accent-cyan)' }} />}
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}
