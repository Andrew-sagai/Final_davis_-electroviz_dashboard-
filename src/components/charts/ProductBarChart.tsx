import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#FF2A4B', '#FFB800', '#00F0FF', '#FF00FF', '#FF8599', '#FFFFFF'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 42, 75, 0.2)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ fontSize: 11, color: entry.color || COLORS[0], margin: '2px 0' }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

interface ProductBarChartProps {
  data: { product: string; revenue: number; orders: number; avgRating: number }[];
  delay?: number;
}

export default function ProductBarChart({ data, delay = 0 }: ProductBarChartProps) {
  return (
    <GlassCard title="Penjualan Berdasarkan Kategori" subtitle="Perbandingan pendapatan antar kategori produk" icon={BarChart2} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 300 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 42, 75, 0.1)" />
            <XAxis dataKey="product" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <YAxis tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 42, 75, 0.1)' }} />
            <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
