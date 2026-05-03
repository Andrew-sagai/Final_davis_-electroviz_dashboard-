import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader({ height = 300, count = 1 }: { height?: number; count?: number }) {
  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: `repeat(${count > 3 ? 3 : count}, 1fr)` }}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="skeleton"
          style={{ height, borderRadius: 16 }}
        />
      ))}
    </div>
  );
}
