import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function CustomerRecencyChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Analisis Recency Pelanggan" subtitle="Waktu berlalu sejak pembelian terakhir" icon={Users} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis tick={{ fill: '#f59e0b', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ background: 'rgba(10,4,6,0.9)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8 }}
              itemStyle={{ color: '#f59e0b' }}
              formatter={(value: any) => [value, 'Customers']}
            />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
