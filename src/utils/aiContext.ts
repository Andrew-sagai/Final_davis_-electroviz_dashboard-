import type { SalesRecord, FilterState } from '../types';
import { 
  calculateKPIs, getSalesByProductType, getGenderComparison, 
  getSpendingBySegment, getPaymentMethodDistribution, getSalesOverTime,
  getOrderStatusDistribution, getShippingDistribution
} from './analytics';

function buildBaseContext(data: SalesRecord[], filters: FilterState) {
  if (!data || data.length === 0) return null;

  const kpis = calculateKPIs(data);
  const products = getSalesByProductType(data);
  const payments = getPaymentMethodDistribution(data);
  const genders = getGenderComparison(data);
  const segments = getSpendingBySegment(data);
  const salesOverTime = getSalesOverTime(data);
  const orderStatus = getOrderStatusDistribution(data);
  const shipping = getShippingDistribution(data);

  // Calculate Date Range
  const sortedDates = data.map(d => d.purchaseDate).sort();
  const dateRange = sortedDates.length > 0 ? `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}` : 'Unknown';

  return {
    filters,
    datasetSize: data.length,
    dateRange,
    kpis: {
      revenue: kpis.totalRevenue,
      orders: kpis.totalOrders,
      avgRating: kpis.avgRating,
      loyaltyRate: kpis.loyaltyRatio,
      avgOrderValue: kpis.avgOrderValue,
      totalCustomers: kpis.totalCustomers
    },
    salesOverTime: salesOverTime.map(s => `${s.month}: $${s.revenue} (${s.orders} orders)`),
    products: products.slice(0, 10).map(p => `${p.product}: $${p.revenue} (${p.orders} orders)`),
    demographics: genders.map(g => `${g.gender}: ${g.count} customers, $${g.revenue} revenue`),
    ageSegments: segments.map(s => `${s.segment}: $${s.totalSpend} total spend, ${s.count} orders`),
    payments: payments.map(p => `${p.name}: ${p.value} orders`),
    orderStatus: orderStatus.map(s => `${s.name}: ${s.value} orders`),
    shipping: shipping.map(s => `${s.name}: ${s.count} orders, $${s.revenue} revenue`)
  };
}

export function buildDashboardContext(data: SalesRecord[], filters: FilterState) {
  const baseContext = buildBaseContext(data, filters);
  if (!baseContext) return "No data available for the selected filters.";
  return JSON.stringify({ page: "Dashboard", ...baseContext }, null, 2);
}

export function buildCustomerContext(data: SalesRecord[], filters: FilterState) {
  const baseContext = buildBaseContext(data, filters);
  if (!baseContext) return "No data available for the selected filters.";
  return JSON.stringify({ page: "Customers", ...baseContext }, null, 2);
}

export function buildSalesContext(data: SalesRecord[], filters: FilterState) {
  const baseContext = buildBaseContext(data, filters);
  if (!baseContext) return "No data available for the selected filters.";
  return JSON.stringify({ page: "Sales & Products", ...baseContext }, null, 2);
}
