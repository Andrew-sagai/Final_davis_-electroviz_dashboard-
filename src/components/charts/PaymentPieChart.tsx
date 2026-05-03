import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CreditCard } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#FF2A4B', '#FFB800', '#00F0FF', '#FF00FF', '#FF8599', '#FFFFFF'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 42, 75, 0.2)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#FFF0F2', marginBottom: 2 }}>
        {d.name}
      </p>
      <p style={{ fontSize: 11, color: '#FF8599' }}>
        {d.value.toLocaleString()} pesanan ({((d.value / d.payload.total) * 100).toFixed(1)}%)
      </p>
    </div>
  );
};

const renderLabel = ({ name, percent }: any) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

interface PaymentPieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  subtitle?: string;
  delay?: number;
  variant?: 'donut' | 'pie';
  icon?: React.ElementType;
}

export default function PaymentPieChart({
  data, title = 'Distribusi Pembayaran', subtitle = 'Pesanan berdasarkan metode pembayaran', delay = 0, variant = 'donut', icon = CreditCard
}: PaymentPieChartProps) {
  
  // Group into Top 4 + Others
  let finalData = [...data].sort((a, b) => b.value - a.value);
  if (finalData.length > 5) {
    const top4 = finalData.slice(0, 4);
    const othersValue = finalData.slice(4).reduce((sum, item) => sum + item.value, 0);
    finalData = [...top4, { name: 'Lainnya', value: othersValue }];
  }

  const total = finalData.reduce((s, d) => s + d.value, 0);
  const enriched = finalData.map(d => ({ ...d, total }));

  return (
    <GlassCard title={title} subtitle={subtitle} delay={delay} icon={icon}>
      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 300 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enriched}
              cx="50%"
              cy="50%"
              innerRadius={variant === 'donut' ? 70 : 0}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
              animationBegin={0}
              animationDuration={1200}
            >
              {enriched.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 20 }}
              iconType="circle"
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
