import React from 'react';
import { motion } from 'framer-motion';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? COLORS[index % COLORS.length] : 'rgba(255,255,255,0)',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>
          {name}
        </text>
      )}
    </g>
  );
};

export default function RevenueTreemapChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  // Recharts treemap expects a specific format
  const treeData = [{
    name: 'Products',
    children: data.map(d => ({ name: d.product, size: d.revenue }))
  }];

  return (
    <GlassCard title="Kontribusi Pendapatan" subtitle="Berdasarkan kategori produk" icon={PieChart} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treeData}
            dataKey="size"
            stroke="#fff"
            fill="#8b5cf6"
            content={<CustomizedContent />}
          >
            <Tooltip 
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            />
          </Treemap>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
