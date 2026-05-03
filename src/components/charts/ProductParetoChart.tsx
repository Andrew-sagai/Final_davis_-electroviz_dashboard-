import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function ProductParetoChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Analisis Pareto Produk" subtitle="Kontribusi pendapatan kumulatif (20/80)" icon={Package} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="product" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#06b6d4', fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#f43f5e', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(value: any, name: string) => name === 'Revenue' ? [`$${value.toLocaleString()}`, name] : [`${value}%`, name]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cumulativePct" name="Cumulative %" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
