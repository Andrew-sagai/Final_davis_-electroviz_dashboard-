import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import type { SalesRecord } from '../../types';
import { formatCurrency } from '../../utils/analytics';

interface DataTableProps {
  data: SalesRecord[];
  title?: string;
  delay?: number;
  pageSize?: number;
}

export default function DataTable({ data, title = '📋 Data Table', delay = 0, pageSize = 10 }: DataTableProps) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof SalesRecord>('purchaseDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: keyof SalesRecord) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const columns: { key: keyof SalesRecord; label: string; width?: number }[] = [
    { key: 'customerID', label: 'ID', width: 60 },
    { key: 'purchaseDate', label: 'Date', width: 100 },
    { key: 'productType', label: 'Product', width: 100 },
    { key: 'totalPrice', label: 'Total', width: 90 },
    { key: 'quantity', label: 'Qty', width: 50 },
    { key: 'rating', label: 'Rating', width: 60 },
    { key: 'orderStatus', label: 'Status', width: 90 },
    { key: 'paymentMethod', label: 'Payment', width: 100 },
    { key: 'gender', label: 'Gender', width: 70 },
    { key: 'loyaltyMember', label: 'Loyalty', width: 70 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#00F0FF';
      case 'Cancelled': return '#FF2A4B';
      case 'Processing': return '#FFB800';
      default: return '#64748b';
    }
  };

  return (
    <GlassCard title={title} subtitle={`Showing ${pageData.length} of ${data.length.toLocaleString()} records`} delay={delay} noPadding>
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: 'pointer', minWidth: col.width, userSelect: 'none' }}
                  >
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => (
                <motion.tr
                  key={`${row.customerID}-${row.purchaseDate}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{row.customerID}</td>
                  <td>{row.purchaseDate}</td>
                  <td>{row.productType}</td>
                  <td style={{ fontWeight: 600, color: '#00F0FF' }}>{formatCurrency(row.totalPrice)}</td>
                  <td style={{ textAlign: 'center' }}>{row.quantity}</td>
                  <td>
                    <span style={{ color: row.rating >= 4 ? '#00F0FF' : row.rating >= 3 ? '#FFB800' : '#FF2A4B' }}>
                      {'★'.repeat(Math.round(row.rating))}{'☆'.repeat(5 - Math.round(row.rating))}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                      background: `${getStatusColor(row.orderStatus)}20`,
                      color: getStatusColor(row.orderStatus),
                    }}>
                      {row.orderStatus}
                    </span>
                  </td>
                  <td>{row.paymentMethod}</td>
                  <td>{row.gender}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                      background: row.loyaltyMember === 'Yes' ? 'rgba(0,240,255,0.15)' : 'rgba(255,42,75,0.05)',
                      color: row.loyaltyMember === 'Yes' ? '#00F0FF' : '#8A4F5B',
                    }}>
                      {row.loyaltyMember}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Page {page + 1} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-secondary)',
                cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.3 : 1,
              }}
            >
              <ChevronLeft size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-secondary)',
                cursor: page >= totalPages - 1 ? 'default' : 'pointer', opacity: page >= totalPages - 1 ? 0.3 : 1,
              }}
            >
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
