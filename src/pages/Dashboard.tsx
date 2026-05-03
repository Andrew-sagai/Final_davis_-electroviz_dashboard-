import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Star, Users, Award, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  calculateKPIs, getSalesOverTime, getSalesByProductType,
  getPaymentMethodDistribution, getLoyaltyTrend, getCancellationByProduct,
  getSpendingBySegment, getShippingEfficiency
} from '../utils/analytics';
import KPICard from '../components/cards/KPICard';
import FilterPanel from '../components/filters/FilterPanel';
import PaymentPieChart from '../components/charts/PaymentPieChart';
import LoyaltyTrendChart from '../components/charts/LoyaltyTrendChart';
import RevenueVsOrderChart from '../components/charts/RevenueVsOrderChart';
import AovTrendChart from '../components/charts/AovTrendChart';
import CancellationByProductChart from '../components/charts/CancellationByProductChart';
import RevenueTreemapChart from '../components/charts/RevenueTreemapChart';
import DemographicsChart from '../components/charts/DemographicsChart';
import ShippingEfficiencyChart from '../components/charts/ShippingEfficiencyChart';
import DataTable from '../components/ui/DataTable';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { Package } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Dashboard() {
  const { filteredData, isLoading } = useAppStore();

  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const salesOverTime = useMemo(() => getSalesOverTime(filteredData), [filteredData]);
  const productSales = useMemo(() => getSalesByProductType(filteredData), [filteredData]);
  const paymentDist = useMemo(() => getPaymentMethodDistribution(filteredData), [filteredData]);
  const loyaltyTrend = useMemo(() => getLoyaltyTrend(filteredData), [filteredData]);
  const productCancellation = useMemo(() => getCancellationByProduct(filteredData), [filteredData]);
  const spendingSegment = useMemo(() => getSpendingBySegment(filteredData), [filteredData]);
  const shippingEfficiency = useMemo(() => getShippingEfficiency(filteredData), [filteredData]);

  if (isLoading) {
    return (
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        <SkeletonLoader height={100} count={5} />
        <div style={{ marginTop: 24 }}><SkeletonLoader height={350} count={2} /></div>
        <div style={{ marginTop: 24 }}><SkeletonLoader height={350} count={2} /></div>
      </div>
    );
  }

  const kpiCards = [
    { title: 'Total Revenue', value: kpis.totalRevenue, format: 'currency' as const, icon: DollarSign, gradient: 'linear-gradient(135deg, #FF2A4B, #FFB800)' },
    { title: 'Total Orders', value: kpis.totalOrders, format: 'number' as const, icon: ShoppingCart, gradient: 'linear-gradient(135deg, #FF2A4B, #00F0FF)' },
    { title: 'Avg Rating', value: kpis.avgRating, format: 'decimal' as const, icon: Star, gradient: 'linear-gradient(135deg, #FF00FF, #00F0FF)' },
    { title: 'Total Customers', value: kpis.totalCustomers, format: 'number' as const, icon: Users, gradient: 'linear-gradient(135deg, #FFB800, #FF2A4B)' },
    { title: 'Loyalty Rate', value: kpis.loyaltyRatio, format: 'percentage' as const, icon: Award, gradient: 'linear-gradient(135deg, #00F0FF, #FF2A4B)' },
    { title: 'Avg Order Value', value: kpis.avgOrderValue, format: 'currency' as const, icon: TrendingUp, gradient: 'linear-gradient(135deg, #FF2A4B, #FF00FF)' },
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
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 20 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">Dashboard</span> Overview
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Electronics Sales Analytics · Sep 2023 - Sep 2024
        </p>
      </motion.div>

      {/* Filters */}
      <FilterPanel />

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {kpiCards.map((kpi, i) => (
          <KPICard key={kpi.title} {...kpi} delay={i * 0.1} />
        ))}
      </div>

      {/* Charts Row 1: Core Revenue Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <RevenueVsOrderChart data={salesOverTime} delay={0.3} />
        <AovTrendChart data={salesOverTime} delay={0.4} />
      </div>

      {/* Charts Row 2: Customer Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <DemographicsChart data={spendingSegment} delay={0.5} />
        <LoyaltyTrendChart data={loyaltyTrend} delay={0.6} />
      </div>

      {/* Charts Row 3: Product & Payment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <RevenueTreemapChart data={productSales} delay={0.7} />
        <PaymentPieChart data={paymentDist} delay={0.8} variant="pie" />
      </div>

      {/* Charts Row 4: Operations Insight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ShippingEfficiencyChart data={shippingEfficiency} delay={0.9} />
        <CancellationByProductChart data={productCancellation} delay={1.0} />
      </div>

      {/* Data Table */}
      <div style={{ marginBottom: 20 }}>
        <DataTable data={filteredData} delay={0.8} />
      </div>
    </motion.div>
  );
}
