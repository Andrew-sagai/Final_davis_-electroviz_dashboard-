import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Users } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const GENDER_COLORS: Record<string, string> = {
  Male: '#00F0FF',
  Female: '#FF00FF',
  Other: '#FFB800',
  'Non-binary': '#FF2A4B',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 42, 75, 0.2)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#FFF0F2', marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: entry.fill || entry.color, margin: '2px 0' }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value > 100 ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

interface GenderComparisonChartProps {
  data: { gender: string; count: number; revenue: number }[];
  delay?: number;
}

export default function GenderComparisonChart({ data, delay = 0 }: GenderComparisonChartProps) {
  return (
    <GlassCard title="Perbandingan Gender" subtitle="Pesanan dan pendapatan berdasarkan gender" icon={Users} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 280 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 42, 75, 0.1)" />
            <XAxis dataKey="gender" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <YAxis yAxisId="left" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 42, 75, 0.1)' }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#FF8599' }} />
            <Bar yAxisId="left" dataKey="count" name="Orders" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((d, i) => (
                <Cell key={i} fill={GENDER_COLORS[d.gender] || '#8b5cf6'} fillOpacity={0.7} />
              ))}
            </Bar>
            <Bar yAxisId="right" dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((d, i) => (
                <Cell key={i} fill={GENDER_COLORS[d.gender] || '#06b6d4'} fillOpacity={0.4} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
