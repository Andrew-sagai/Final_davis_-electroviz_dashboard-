import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface HeatmapChartProps {
  data: { age: string; spend: string; count: number }[];
  delay?: number;
}

export default function HeatmapChart({ data, delay = 0 }: HeatmapChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const ageBuckets = [...new Set(data.map(d => d.age))];
  const spendBuckets = [...new Set(data.map(d => d.spend))];

  const getColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity === 0) return 'rgba(255,255,255,0.02)';
    if (intensity < 0.2) return 'rgba(255,42,75,0.15)';
    if (intensity < 0.4) return 'rgba(255,42,75,0.4)';
    if (intensity < 0.6) return 'rgba(255,184,0,0.5)';
    if (intensity < 0.8) return 'rgba(0,240,255,0.6)';
    return 'rgba(0,240,255,0.9)';
  };

  return (
    <GlassCard title="Peta Panas Usia vs Pengeluaran" subtitle="Kepadatan transaksi berdasarkan rentang usia dan pengeluaran" icon={Flame} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      >
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${spendBuckets.length}, 1fr)`, gap: 3, minWidth: 400 }}>
            {/* Header */}
            <div />
            {spendBuckets.map(s => (
              <div key={s} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', padding: '4px 2px', fontWeight: 500 }}>
                {s}
              </div>
            ))}

            {/* Rows */}
            {ageBuckets.map(age => (
              <React.Fragment key={age}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, paddingRight: 8 }}>
                  {age}
                </div>
                {spendBuckets.map(spend => {
                  const cell = data.find(d => d.age === age && d.spend === spend);
                  const count = cell?.count || 0;
                  return (
                    <motion.div
                      key={`${age}-${spend}`}
                      whileHover={{ scale: 1.1 }}
                      style={{
                        background: getColor(count),
                        borderRadius: 6,
                        padding: 8,
                        textAlign: 'center',
                        fontSize: 11,
                        color: count > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: count > 0 ? 600 : 400,
                        cursor: 'default',
                        border: '1px solid rgba(255,255,255,0.03)',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      title={`${age}, ${spend}: ${count} orders`}
                    >
                      {count > 0 ? count : '-'}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((v, i) => (
              <div key={i} style={{
                width: 20, height: 12, borderRadius: 3,
                background: getColor(maxCount * v),
              }} />
            ))}
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>High</span>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
