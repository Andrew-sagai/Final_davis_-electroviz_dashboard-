import React from 'react';
import { motion } from 'framer-motion';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
  
  // Create a more robust hash for distinct colors based on name if index is not unique
  const stringHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  };
  
  // Use index if possible, otherwise fallback to hash
  const colorIndex = (typeof index === 'number' ? index : stringHash(name || '')) % COLORS.length;
  
  // Only render distinct colors and text for leaf nodes
  const isLeaf = !payload || !payload.children || payload.children.length === 0;
  
  if (!isLeaf) {
    return null; // Don't draw anything for parent/root nodes
  }
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[colorIndex],
          stroke: 'rgba(0,0,0,0.5)',
          strokeWidth: 2,
          transition: 'all 0.3s ease',
        }}
      />
      {width > 50 && height > 30 && (
        <text 
          x={x + width / 2} 
          y={y + height / 2} 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize={13} 
          fontWeight={700}
          style={{ pointerEvents: 'none', textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
        {data.name}
      </p>
      <p style={{ fontSize: 12, color: '#00F0FF', fontWeight: 600 }}>
        Revenue: ${data.size?.toLocaleString()}
      </p>
    </div>
  );
};

export default function RevenueTreemapChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  // Pass a flat array to Recharts Treemap to avoid the "Products" root node grouping
  const treeData = data.map(d => ({ name: d.product, size: d.revenue }));

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
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
