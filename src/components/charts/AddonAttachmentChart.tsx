import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function AddonAttachmentChart({ data, delay = 0 }: { data: any; delay?: number }) {
  const chartData = [
    { name: 'With Add-on', value: data.withAddon, color: '#3b82f6' },
    { name: 'Without Add-on', value: data.withoutAddon, color: 'rgba(255,255,255,0.1)' }
  ];

  return (
    <GlassCard title="Tingkat Adopsi Add-on" subtitle={`Persentase pesanan yang membeli layanan tambahan (${data.rate}%)`} icon={Package} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6' }}>{data.rate}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Attachment Rate</div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
