import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Award } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

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
        <p key={i} style={{ fontSize: 11, color: entry.color, margin: '2px 0' }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

interface LoyaltyTrendChartProps {
  data: { month: string; loyal: number; nonLoyal: number }[];
  delay?: number;
}

export default function LoyaltyTrendChart({ data, delay = 0 }: LoyaltyTrendChartProps) {
  return (
    <GlassCard title="Tren Jumlah Anggota Loyal" subtitle="Pertumbuhan pelanggan berdasarkan status membership" icon={Award} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 280 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <defs>
              <linearGradient id="loyalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="nonLoyalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF2A4B" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#FF2A4B" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 42, 75, 0.1)" />
            <XAxis dataKey="month" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <YAxis tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#FF8599' }} />
            <Area type="monotone" dataKey="loyal" name="Loyalty Members" stroke="#00F0FF" strokeWidth={3} fill="url(#loyalGrad)" stackId="1" animationDuration={1500} />
            <Area type="monotone" dataKey="nonLoyal" name="Non-Members" stroke="#FF2A4B" strokeWidth={3} fill="url(#nonLoyalGrad)" stackId="1" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
