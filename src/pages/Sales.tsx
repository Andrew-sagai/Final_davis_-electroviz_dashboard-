import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Truck, Gift } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  getSalesByProductType, getRevenueBySKU, getOrderStatusDistribution,
  getShippingDistribution, getAddonsAnalysis, getPriceVsQuantity,
  calculateKPIs, formatCurrency, getProductPareto, getPriceTierPerformance,
  getAddonAttachmentRate, getShippingEfficiency, getSalesOverTime
} from '../utils/analytics';
import KPICard from '../components/cards/KPICard';
import FilterPanel from '../components/filters/FilterPanel';
import PaymentPieChart from '../components/charts/PaymentPieChart';
import ShippingChart from '../components/charts/ShippingChart';
import AddonsChart from '../components/charts/AddonsChart';
import TopProductsBarChart from '../components/charts/TopProductsBarChart';
import ProductRatingChart from '../components/charts/ProductRatingChart';
import PriceTierChart from '../components/charts/PriceTierChart';
import AddonAttachmentChart from '../components/charts/AddonAttachmentChart';
import ShippingEfficiencyChart from '../components/charts/ShippingEfficiencyChart';
import SalesLineChart from '../components/charts/SalesLineChart';
import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Sales() {
  const { filteredData, isLoading } = useAppStore();

  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const productSales = useMemo(() => getSalesByProductType(filteredData), [filteredData]);
  const skuData = useMemo(() => getRevenueBySKU(filteredData), [filteredData]);
  const statusDist = useMemo(() => getOrderStatusDistribution(filteredData), [filteredData]);
  const shippingDist = useMemo(() => getShippingDistribution(filteredData), [filteredData]);
  const addonsData = useMemo(() => getAddonsAnalysis(filteredData), [filteredData]);
  const scatterData = useMemo(() => getPriceVsQuantity(filteredData), [filteredData]);
  
  const paretoData = useMemo(() => getProductPareto(filteredData), [filteredData]);
  const priceTierData = useMemo(() => getPriceTierPerformance(filteredData), [filteredData]);
  const addonAttachment = useMemo(() => getAddonAttachmentRate(filteredData), [filteredData]);
  const shippingEfficiency = useMemo(() => getShippingEfficiency(filteredData), [filteredData]);
  const salesOverTime = useMemo(() => getSalesOverTime(filteredData), [filteredData]);

  const topProducts = useMemo(() => [...productSales].sort((a, b) => b.revenue - a.revenue).slice(0, 5), [productSales]);
  const worstProducts = useMemo(() => [...productSales].sort((a, b) => a.revenue - b.revenue).slice(0, 3), [productSales]);

  if (isLoading) {
    return (
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        <SkeletonLoader height={100} count={4} />
        <div style={{ marginTop: 24 }}><SkeletonLoader height={350} count={2} /></div>
      </div>
    );
  }

  const salesKPIs = [
    { title: 'Total Revenue', value: kpis.totalRevenue, format: 'currency' as const, icon: TrendingUp, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
    { title: 'Total Product per Kategori', value: productSales.length, format: 'number' as const, icon: Package, gradient: 'linear-gradient(135deg, #06b6d4, #67e8f9)' },
    { title: 'Shipping Methods', value: shippingDist.length, format: 'number' as const, icon: Truck, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { title: 'Add-on Types', value: addonsData.length, format: 'number' as const, icon: Gift, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
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
          <span className="gradient-text">Sales &</span> Product Insights
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Product performance, SKU analysis, and transaction insights
        </p>
      </motion.div>

      <FilterPanel />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {salesKPIs.map((kpi, i) => (
          <KPICard key={kpi.title} {...kpi} delay={i * 0.1} />
        ))}
      </div>

      {/* Charts Row 1: Sales Categories & Ratings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <TopProductsBarChart data={productSales} delay={0.3} />
        <ProductRatingChart data={productSales} delay={0.4} />
      </div>

      {/* Top & Worst Products Side by Side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <GlassCard title="Produk Terlaris" subtitle="Produk dengan pendapatan tertinggi" icon={TrendingUp} delay={0.7}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topProducts.map((p, i) => (
              <motion.div
                key={p.product}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: i === 0 ? '#000' : 'var(--text-muted)',
                  }}>
                    #{i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.product}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.orders} orders · ★ {p.avgRating}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>
                  {formatCurrency(p.revenue)}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <SalesLineChart data={salesOverTime} delay={0.8} />
      </div>

      {/* Charts Row 3: Shipping & Add-ons Basic */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ShippingChart data={shippingDist} delay={0.7} />
        <AddonsChart data={addonsData} delay={0.8} />
      </div>

      {/* Charts Row 4: Pricing & Addon Efficiency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <PriceTierChart data={priceTierData} delay={0.9} />
        <AddonAttachmentChart data={addonAttachment} delay={1.0} />
      </div>

      {/* Charts Row 5: Shipping Efficiency & Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ShippingEfficiencyChart data={shippingEfficiency} delay={1.1} />
        <PaymentPieChart data={statusDist} title="Status Pesanan" subtitle="Rincian penyelesaian pesanan" icon={Package} variant="donut" delay={1.2} />
      </div>

      {/* Revenue by SKU Table */}
      <GlassCard title="Pendapatan per SKU" subtitle="Rincian mendalam tingkat SKU" icon={Package} delay={1.0}>
        <div style={{ overflowX: 'auto', maxHeight: 400 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>SKU</th>
                <th>Product Type</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Avg per Order</th>
              </tr>
            </thead>
            <tbody>
              {skuData.slice(0, 20).map((sku, i) => (
                <motion.tr
                  key={sku.sku}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.02 }}
                >
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: i < 3 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.05)',
                      color: i < 3 ? '#000' : 'var(--text-muted)',
                    }}>
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8b5cf6' }}>{sku.sku}</td>
                  <td>{sku.product}</td>
                  <td style={{ fontWeight: 600, color: '#06b6d4' }}>${sku.revenue.toLocaleString()}</td>
                  <td>{sku.orders.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatCurrency(sku.revenue / sku.orders)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
