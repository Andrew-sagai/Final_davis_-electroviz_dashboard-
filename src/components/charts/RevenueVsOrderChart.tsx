import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#FFF0F2', marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: entry.color, margin: '2px 0' }}>
          {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function RevenueVsOrderChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Pendapatan vs Volume Pesanan" subtitle="Perbandingan Dual Axis" icon={TrendingUp} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <defs>
              <linearGradient id="revLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF2A4B" />
                <stop offset="100%" stopColor="#FFB800" />
              </linearGradient>
              <linearGradient id="orderBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(0, 240, 255, 0.1)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />
            <YAxis yAxisId="left" tick={{ fill: '#FFB800', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#00F0FF', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
            <Bar yAxisId="right" dataKey="orders" name="Orders" fill="url(#orderBarGrad)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="url(#revLineGrad)" strokeWidth={3} dot={{ r: 4, fill: '#FFB800' }} activeDot={{ r: 8 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
