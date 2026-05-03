import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function AovTrendChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      aov: d.orders > 0 ? Math.round(d.revenue / d.orders) : 0
    }));
  }, [data]);

  return (
    <GlassCard title="Tren Average Order Value" subtitle="Nilai rata-rata pesanan per bulan" icon={DollarSign} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />
            <YAxis tick={{ fill: '#FF00FF', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} tickFormatter={(v) => `$${v}`} />
            <Tooltip 
              contentStyle={{ background: 'rgba(10,4,6,0.9)', border: '1px solid rgba(255,0,255,0.3)', borderRadius: 8 }}
              itemStyle={{ color: '#FF00FF' }}
              formatter={(value: any) => [`$${value}`, 'AOV']}
            />
            <Line type="monotone" dataKey="aov" name="AOV" stroke="#FF00FF" strokeWidth={3} dot={{ r: 4, fill: '#FF00FF' }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
