import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/analytics';

interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage' | 'decimal';
  icon: LucideIcon;
  gradient: string;
  delay?: number;
  trend?: { value: number; isPositive: boolean };
}

function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const prevEnd = useRef(0);

  useEffect(() => {
    if (end === prevEnd.current) return;
    prevEnd.current = end;

    const startTime = Date.now();
    const startVal = count;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(startVal + (end - startVal) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export default function KPICard({ title, value, format, icon: Icon, gradient, delay = 0, trend }: KPICardProps) {
  const animatedValue = useCountUp(value);

  const formatValue = (v: number) => {
    switch (format) {
      case 'currency': return formatCurrency(v);
      case 'number': return formatNumber(v);
      case 'percentage': return `${v.toFixed(1)}%`;
      case 'decimal': return v.toFixed(2);
      default: return String(Math.round(v));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="kpi-card glass-card"
      style={{ padding: 20, cursor: 'default', minWidth: 0 }}
    >
      <div className="kpi-inner" style={{ position: 'relative' }}>
        {/* Background gradient accent */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: gradient, opacity: 0.08, filter: 'blur(20px)',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: gradient, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0, 240, 255, 0.3)',
          }}>
            <Icon size={20} color="#fff" />
          </div>
          {trend && (
            <div style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              borderRadius: 20,
              background: trend.isPositive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 42, 75, 0.15)',
              color: trend.isPositive ? '#00F0FF' : '#FF2A4B',
            }}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
            </div>
          )}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {formatValue(animatedValue)}
        </div>
      </div>
    </motion.div>
  );
}
