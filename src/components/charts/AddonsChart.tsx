import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlusCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#FF2A4B', '#FFB800', '#00F0FF', '#FF00FF'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 42, 75, 0.2)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#FFF0F2', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 11, color: '#06b6d4' }}>Count: {payload[0].value.toLocaleString()}</p>
    </div>
  );
};

interface AddonsChartProps {
  data: { addon: string; count: number; revenue: number }[];
  delay?: number;
}

export default function AddonsChart({ data, delay = 0 }: AddonsChartProps) {
  return (
    <GlassCard title="Analisis Add-on" subtitle="Pembelian add-on paling populer" icon={PlusCircle} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 280 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 42, 75, 0.1)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <YAxis type="category" dataKey="addon" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} width={100} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 42, 75, 0.1)' }} />
            <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]} maxBarSize={25}>
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
