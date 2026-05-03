import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function TopProductsBarChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Pendapatan per Kategori" subtitle="Kategori produk dengan pendapatan tertinggi" icon={Package} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="product" tick={{ fill: '#06b6d4', fontSize: 11 }} width={80} />
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
