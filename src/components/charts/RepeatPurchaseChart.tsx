import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function RepeatPurchaseChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Distribusi Pembelian Ulang" subtitle="Frekuensi transaksi per pelanggan" icon={Users} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis type="category" dataKey="purchases" tick={{ fill: '#06b6d4', fontSize: 11 }} width={80} />
            <Tooltip 
              contentStyle={{ background: 'rgba(10,4,6,0.9)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 8 }}
              itemStyle={{ color: '#06b6d4' }}
              formatter={(value: any) => [value, 'Customers']}
            />
            <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
