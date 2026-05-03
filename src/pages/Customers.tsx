import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Heart, UserCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  getAgeDistribution, getGenderComparison, getLoyaltyTrend,
  getSpendingBySegment, getHeatmapData, calculateKPIs,
  getClvDistribution, getLoyaltyFunnel, getRepeatPurchaseDistribution, getCustomerRecency
} from '../utils/analytics';
import KPICard from '../components/cards/KPICard';
import FilterPanel from '../components/filters/FilterPanel';
import GenderComparisonChart from '../components/charts/GenderComparisonChart';
import DemographicsChart from '../components/charts/DemographicsChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import ClvDistributionChart from '../components/charts/ClvDistributionChart';
import LoyaltyFunnelChart from '../components/charts/LoyaltyFunnelChart';
import RepeatPurchaseChart from '../components/charts/RepeatPurchaseChart';
import CustomerRecencyChart from '../components/charts/CustomerRecencyChart';

import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Customers() {
  const { filteredData, isLoading } = useAppStore();

  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const ageDist = useMemo(() => getAgeDistribution(filteredData), [filteredData]);
  const genderComp = useMemo(() => getGenderComparison(filteredData), [filteredData]);
  const loyaltyTrend = useMemo(() => getLoyaltyTrend(filteredData), [filteredData]);
  const spendingSegment = useMemo(() => getSpendingBySegment(filteredData), [filteredData]);
  const heatmapData = useMemo(() => getHeatmapData(filteredData), [filteredData]);
  
  const clvData = useMemo(() => getClvDistribution(filteredData), [filteredData]);
  const funnelData = useMemo(() => getLoyaltyFunnel(filteredData), [filteredData]);
  const repeatData = useMemo(() => getRepeatPurchaseDistribution(filteredData), [filteredData]);
  const recencyData = useMemo(() => getCustomerRecency(filteredData), [filteredData]);

  if (isLoading) {
    return (
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        <SkeletonLoader height={100} count={4} />
        <div style={{ marginTop: 24 }}><SkeletonLoader height={350} count={2} /></div>
      </div>
    );
  }

  const customerKPIs = [
    { title: 'Total Customers', value: kpis.totalCustomers, format: 'number' as const, icon: Users, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
    { title: 'Loyalty Rate', value: kpis.loyaltyRatio, format: 'percentage' as const, icon: Award, gradient: 'linear-gradient(135deg, #06b6d4, #67e8f9)' },
    { title: 'Avg Rating', value: kpis.avgRating, format: 'decimal' as const, icon: Heart, gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
    { title: 'Avg Order Value', value: kpis.avgOrderValue, format: 'currency' as const, icon: UserCheck, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: 20 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>
          <span className="gradient-text">Customer</span> Analytics
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Demographics, loyalty, and spending analysis
        </p>
      </motion.div>

      <FilterPanel />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {customerKPIs.map((kpi, i) => (
          <KPICard key={kpi.title} {...kpi} delay={i * 0.1} />
        ))}
      </div>

      {/* Charts Row 1: Demographics & Gender */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <DemographicsChart data={spendingSegment} delay={0.3} />
        <GenderComparisonChart data={genderComp} delay={0.4} />
      </div>

      {/* Charts Row 2: Customer Value & Journey */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ClvDistributionChart data={clvData} delay={0.5} />
        <LoyaltyFunnelChart data={funnelData} delay={0.6} />
      </div>

      {/* Charts Row 3: Retention & Recency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <RepeatPurchaseChart data={repeatData} delay={0.7} />
        <CustomerRecencyChart data={recencyData} delay={0.8} />
      </div>

      {/* Charts Row 4: Heatmap */}
      <div style={{ marginBottom: 20 }}>
        <HeatmapChart data={heatmapData} delay={0.9} />
      </div>

      {/* Customer Segments Table */}
      <GlassCard title="Segmen Pelanggan" subtitle="Rincian pengeluaran berdasarkan kelompok" icon={Users} delay={1.0}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Customers</th>
                <th>Avg Spend</th>
                <th>Total Spend</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {spendingSegment.map((seg, i) => {
                const totalSpend = spendingSegment.reduce((s, x) => s + x.totalSpend, 0);
                const pct = totalSpend > 0 ? ((seg.totalSpend / totalSpend) * 100).toFixed(1) : '0';
                return (
                  <motion.tr
                    key={seg.segment}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.05 }}
                  >
                    <td style={{ fontWeight: 600 }}>{seg.segment}</td>
                    <td>{seg.count.toLocaleString()}</td>
                    <td style={{ color: '#06b6d4', fontWeight: 600 }}>${seg.avgSpend.toLocaleString()}</td>
                    <td style={{ color: '#8b5cf6', fontWeight: 600 }}>${seg.totalSpend.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)',
                          width: 80, overflow: 'hidden',
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 1 + i * 0.1 }}
                            style={{
                              height: '100%', borderRadius: 3,
                              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{pct}%</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
