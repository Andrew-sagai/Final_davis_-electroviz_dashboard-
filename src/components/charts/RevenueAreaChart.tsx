import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 42, 75, 0.2)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#FFF0F2', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: '#FF2A4B' }}>Revenue: ${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

interface RevenueAreaChartProps {
  data: { month: string; revenue: number }[];
  delay?: number;
}

export default function RevenueAreaChart({ data, delay = 0 }: RevenueAreaChartProps) {
  return (
    <GlassCard title="Tren Pendapatan" subtitle="Pertumbuhan pendapatan kumulatif seiring waktu" icon={TrendingUp} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 300 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF2A4B" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#FF2A4B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 42, 75, 0.1)" />
            <XAxis dataKey="month" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <YAxis tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#FF2A4B" strokeWidth={3} fill="url(#areaGrad)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
