import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function ShippingEfficiencyChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  return (
    <GlassCard title="Efisiensi Pengiriman" subtitle="Volume vs Tingkat Pembatalan" icon={Package} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="shipping" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: '#8b5cf6', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#f43f5e', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(139,92,246,0.2)', 
                borderRadius: 12,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                padding: '10px 14px'
              }}
              itemStyle={{ color: '#fff', fontSize: 13, fontWeight: 500 }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              formatter={(value: any, name: string) => name === 'Cancellation Rate' ? [`${value}%`, name] : [value, name]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="orderCount" name="Orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cancellationRate" name="Cancellation Rate" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
