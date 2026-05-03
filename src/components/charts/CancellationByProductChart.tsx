import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { XCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function CancellationByProductChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Tingkat Pembatalan per Kategori" subtitle="Persentase pesanan batal berdasar produk" icon={XCircle} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="product" tick={{ fill: '#f43f5e', fontSize: 11 }} width={80} />
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
              formatter={(value: any) => [`${value}%`, 'Cancellation Rate']}
            />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.rate > 15 ? '#f43f5e' : entry.rate > 5 ? '#f59e0b' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
