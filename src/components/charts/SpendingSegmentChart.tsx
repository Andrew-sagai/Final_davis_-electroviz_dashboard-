import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: 10, padding: '10px 14px',
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: entry.color || COLORS[0], margin: '2px 0' }}>
          {entry.name}: ${entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

interface SpendingSegmentChartProps {
  data: { segment: string; avgSpend: number; totalSpend: number; count: number }[];
  delay?: number;
}

export default function SpendingSegmentChart({ data, delay = 0 }: SpendingSegmentChartProps) {
  return (
    <GlassCard title="Pengeluaran per Segmen" subtitle="Rata-rata pengeluaran berdasarkan kelompok usia pelanggan" icon={DollarSign} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 280 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="segment" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} width={100} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
            <Bar dataKey="avgSpend" name="Avg Spend" radius={[0, 6, 6, 0]} maxBarSize={30}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
