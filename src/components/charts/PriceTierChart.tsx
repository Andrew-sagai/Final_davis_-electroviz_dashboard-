import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function PriceTierChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Performa Kategori Harga" subtitle="Pendapatan & rating per segmentasi harga" icon={Package} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="tier" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#10b981', fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fill: '#f59e0b', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(16,185,129,0.2)', 
                borderRadius: 12,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                padding: '10px 14px'
              }}
              itemStyle={{ color: '#fff', fontSize: 13, fontWeight: 500 }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 }}
              formatter={(value: any, name: string) => name === 'Revenue' ? [`$${value.toLocaleString()}`, name] : [value, name]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="avgRating" name="Average Rating" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
