import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { XCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function CancellationTrendChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Tren Pembatalan Pesanan" subtitle="Completed vs Cancelled" icon={XCircle} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(244,63,94,0.2)', 
                borderRadius: 12,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                padding: '10px 14px'
              }}
              itemStyle={{ color: '#fff', fontSize: 13, fontWeight: 500 }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[0, 0, 0, 0]} />
            <Bar dataKey="cancelled" stackId="a" fill="#f43f5e" name="Cancelled" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
