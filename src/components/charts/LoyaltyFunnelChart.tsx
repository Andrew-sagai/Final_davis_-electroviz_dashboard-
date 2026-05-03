import React from 'react';
import { motion } from 'framer-motion';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function LoyaltyFunnelChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  // Recharts Funnel requires numerical 'value' prop
  const chartData = data.map((d, i) => ({
    ...d,
    value: d.count,
    fill: ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'][i] || '#fff'
  }));

  return (
    <GlassCard title="Funnel Loyalitas Pelanggan" subtitle="Perjalanan konversi dari pelanggan baru ke loyal" icon={Award} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(value: any, name: any, props: any) => [value, props.payload.stage]}
            />
            <Funnel dataKey="value" data={chartData} isAnimationActive>
              <LabelList position="center" fill="#fff" stroke="none" dataKey="stage" fontSize={12} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
