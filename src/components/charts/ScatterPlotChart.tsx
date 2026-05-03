import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Microscope } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const PRODUCT_COLORS: Record<string, string> = {
  Smartphone: '#8b5cf6',
  Laptop: '#06b6d4',
  Tablet: '#10b981',
  Smartwatch: '#f59e0b',
  Headphones: '#f43f5e',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(10, 4, 6, 0.85)', border: '1px solid rgba(255, 42, 75, 0.2)',
      borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 42, 75, 0.2)'
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{d.product}</p>
      <p style={{ fontSize: 11, color: '#94a3b8' }}>Unit Price: ${d.unitPrice.toFixed(2)}</p>
      <p style={{ fontSize: 11, color: '#94a3b8' }}>Quantity: {d.quantity}</p>
      <p style={{ fontSize: 11, color: '#06b6d4' }}>Total: ${d.totalPrice.toFixed(2)}</p>
    </div>
  );
};

interface ScatterPlotChartProps {
  data: { unitPrice: number; quantity: number; totalPrice: number; product: string }[];
  delay?: number;
}

export default function ScatterPlotChart({ data, delay = 0 }: ScatterPlotChartProps) {
  // Group by product for colored scatter
  const products = [...new Set(data.map(d => d.product))];

  return (
    <GlassCard title="Harga vs Kuantitas" subtitle="Korelasi antara harga satuan dan jumlah pembelian" icon={Microscope} delay={delay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{ height: 300 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 42, 75, 0.1)" />
            <XAxis dataKey="unitPrice" name="Unit Price" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} tickFormatter={(v) => `$${v}`} />
            <YAxis dataKey="quantity" name="Quantity" tick={{ fill: '#FF8599', fontSize: 11 }} axisLine={{ stroke: 'rgba(255, 42, 75, 0.2)' }} />
            <ZAxis dataKey="totalPrice" range={[30, 200]} />
            <Tooltip content={<CustomTooltip />} />
            {products.map(product => (
              <Scatter
                key={product}
                name={product}
                data={data.filter(d => d.product === product)}
                fill={PRODUCT_COLORS[product] || '#8b5cf6'}
                fillOpacity={0.6}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
