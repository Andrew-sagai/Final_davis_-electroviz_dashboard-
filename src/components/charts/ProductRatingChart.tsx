import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function ProductRatingChart({ data, delay = 0 }: { data: any[]; delay?: number }) {
  // Sort by rating descending
  const sortedData = [...data].sort((a, b) => b.avgRating - a.avgRating);
  
  return (
    <GlassCard title="Rata-rata Rating Produk" subtitle="Tingkat kepuasan per kategori" icon={Star} delay={delay}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: delay + 0.3 }} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="product" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis domain={[0, 5]} tick={{ fill: '#f59e0b', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(value: any) => [value, 'Avg Rating']}
            />
            <Bar dataKey="avgRating" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.avgRating >= 4 ? '#10b981' : entry.avgRating >= 3 ? '#f59e0b' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
