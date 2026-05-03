import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function RatingVsRevenueChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Matriks Rating vs Pendapatan" subtitle="Korelasi antara tingkat kepuasan dan penjualan" icon={Star} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis type="number" dataKey="avgRating" name="Rating" domain={[0, 5]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis type="number" dataKey="revenue" name="Revenue" tick={{ fill: '#f59e0b', fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <ZAxis type="number" dataKey="orders" name="Orders" range={[50, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(value: any, name: string) => name === 'Revenue' ? `$${value.toLocaleString()}` : value}
            />
            <Scatter name="Products" data={data} fill="#f59e0b" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
