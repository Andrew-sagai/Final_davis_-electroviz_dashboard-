import type { SalesRecord, KPIMetrics } from '../types';

export function calculateKPIs(data: SalesRecord[]): KPIMetrics {
  if (data.length === 0) {
    return { totalRevenue: 0, totalOrders: 0, avgRating: 0, totalCustomers: 0, loyaltyRatio: 0, avgOrderValue: 0 };
  }

  const totalRevenue = data.reduce((sum, r) => sum + r.totalPrice, 0);
  const totalOrders = data.length;
  const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  const uniqueCustomers = new Set(data.map(r => r.customerID)).size;
  const loyaltyCount = data.filter(r => r.loyaltyMember === 'Yes').length;
  const loyaltyRatio = (loyaltyCount / data.length) * 100;

  return {
    totalRevenue,
    totalOrders,
    avgRating: Math.round(avgRating * 100) / 100,
    totalCustomers: uniqueCustomers,
    loyaltyRatio: Math.round(loyaltyRatio * 10) / 10,
    avgOrderValue: Math.round((totalRevenue / totalOrders) * 100) / 100,
  };
}

export function getSalesOverTime(data: SalesRecord[]) {
  const map = new Map<string, { revenue: number; orders: number }>();
  data.forEach(r => {
    const d = r.purchaseDate.slice(0, 7); // YYYY-MM
    const existing = map.get(d) || { revenue: 0, orders: 0 };
    map.set(d, { revenue: existing.revenue + r.totalPrice, orders: existing.orders + 1 });
  });
  return Array.from(map.entries())
    .map(([month, vals]) => ({ month, revenue: Math.round(vals.revenue), orders: vals.orders }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getSalesByProductType(data: SalesRecord[]) {
  const map = new Map<string, { revenue: number; orders: number; avgRating: number; count: number }>();
  data.forEach(r => {
    const existing = map.get(r.productType) || { revenue: 0, orders: 0, avgRating: 0, count: 0 };
    map.set(r.productType, {
      revenue: existing.revenue + r.totalPrice,
      orders: existing.orders + 1,
      avgRating: existing.avgRating + r.rating,
      count: existing.count + 1,
    });
  });
  return Array.from(map.entries())
    .map(([product, vals]) => ({
      product,
      revenue: Math.round(vals.revenue),
      orders: vals.orders,
      avgRating: Math.round((vals.avgRating / vals.count) * 100) / 100,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getPaymentMethodDistribution(data: SalesRecord[]) {
  const map = new Map<string, number>();
  data.forEach(r => {
    map.set(r.paymentMethod, (map.get(r.paymentMethod) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getOrderStatusDistribution(data: SalesRecord[]) {
  const map = new Map<string, number>();
  data.forEach(r => {
    map.set(r.orderStatus, (map.get(r.orderStatus) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getAgeDistribution(data: SalesRecord[]) {
  const brackets: Record<string, number> = {
    '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '65+': 0,
  };
  data.forEach(r => {
    if (r.age <= 25) brackets['18-25']++;
    else if (r.age <= 35) brackets['26-35']++;
    else if (r.age <= 45) brackets['36-45']++;
    else if (r.age <= 55) brackets['46-55']++;
    else if (r.age <= 65) brackets['56-65']++;
    else brackets['65+']++;
  });
  return Object.entries(brackets).map(([range, count]) => ({ range, count }));
}

export function getGenderComparison(data: SalesRecord[]) {
  const map = new Map<string, { count: number; revenue: number }>();
  data.forEach(r => {
    const gender = String(r.gender || '').trim();
    if (!gender || gender.toLowerCase() === 'null') return;
    
    const existing = map.get(gender) || { count: 0, revenue: 0 };
    map.set(gender, { count: existing.count + 1, revenue: existing.revenue + r.totalPrice });
  });
  return Array.from(map.entries())
    .map(([gender, vals]) => ({ gender, count: vals.count, revenue: Math.round(vals.revenue) }));
}

export function getLoyaltyTrend(data: SalesRecord[]) {
  const map = new Map<string, { loyalSet: Set<string>; nonLoyalSet: Set<string> }>();
  data.forEach(r => {
    const m = r.purchaseDate.slice(0, 7);
    const existing = map.get(m) || { loyalSet: new Set<string>(), nonLoyalSet: new Set<string>() };
    if (r.loyaltyMember === 'Yes') {
      existing.loyalSet.add(r.customerID);
    } else {
      existing.nonLoyalSet.add(r.customerID);
    }
    map.set(m, existing);
  });
  return Array.from(map.entries())
    .map(([month, vals]) => ({ 
      month, 
      loyal: vals.loyalSet.size, 
      nonLoyal: vals.nonLoyalSet.size 
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getSpendingBySegment(data: SalesRecord[]) {
  const segments = [
    { label: 'Young (18-30)', min: 18, max: 30 },
    { label: 'Adult (31-45)', min: 31, max: 45 },
    { label: 'Middle (46-60)', min: 46, max: 60 },
    { label: 'Senior (60+)', min: 61, max: 120 },
  ];
  return segments.map(seg => {
    const segData = data.filter(r => r.age >= seg.min && r.age <= seg.max);
    const totalSpend = segData.reduce((s, r) => s + r.totalPrice, 0);
    return {
      segment: seg.label,
      avgSpend: segData.length > 0 ? Math.round(totalSpend / segData.length) : 0,
      totalSpend: Math.round(totalSpend),
      count: segData.length,
    };
  });
}

export function getHeatmapData(data: SalesRecord[]) {
  const ageBuckets = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];
  const spendBuckets = ['$0-200', '$200-500', '$500-1K', '$1K-2K', '$2K-5K', '$5K+'];

  const getAgeBucket = (age: number) => {
    if (age <= 25) return '18-25';
    if (age <= 35) return '26-35';
    if (age <= 45) return '36-45';
    if (age <= 55) return '46-55';
    if (age <= 65) return '56-65';
    return '65+';
  };

  const getSpendBucket = (price: number) => {
    if (price < 200) return '$0-200';
    if (price < 500) return '$200-500';
    if (price < 1000) return '$500-1K';
    if (price < 2000) return '$1K-2K';
    if (price < 5000) return '$2K-5K';
    return '$5K+';
  };

  const result: { age: string; spend: string; count: number }[] = [];
  const map = new Map<string, number>();

  data.forEach(r => {
    const key = `${getAgeBucket(r.age)}-${getSpendBucket(r.totalPrice)}`;
    map.set(key, (map.get(key) || 0) + 1);
  });

  ageBuckets.forEach(age => {
    spendBuckets.forEach(spend => {
      result.push({ age, spend, count: map.get(`${age}-${spend}`) || 0 });
    });
  });

  return result;
}

export function getRevenueBySKU(data: SalesRecord[]) {
  const map = new Map<string, { revenue: number; orders: number; product: string }>();
  data.forEach(r => {
    const existing = map.get(r.sku) || { revenue: 0, orders: 0, product: r.productType };
    map.set(r.sku, { revenue: existing.revenue + r.totalPrice, orders: existing.orders + 1, product: existing.product });
  });
  return Array.from(map.entries())
    .map(([sku, vals]) => ({ sku, ...vals, revenue: Math.round(vals.revenue) }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getShippingDistribution(data: SalesRecord[]) {
  const map = new Map<string, { count: number; revenue: number }>();
  data.forEach(r => {
    const existing = map.get(r.shippingType) || { count: 0, revenue: 0 };
    map.set(r.shippingType, { count: existing.count + 1, revenue: existing.revenue + r.totalPrice });
  });
  return Array.from(map.entries())
    .map(([name, vals]) => ({ name, count: vals.count, revenue: Math.round(vals.revenue) }));
}

export function getAddonsAnalysis(data: SalesRecord[]) {
  const map = new Map<string, { count: number; totalRevenue: number }>();
  data.forEach(r => {
    if (!r.addonsPurchased) return;
    const addons = r.addonsPurchased.split(',').map(a => a.trim()).filter(Boolean);
    addons.forEach(addon => {
      const existing = map.get(addon) || { count: 0, totalRevenue: 0 };
      map.set(addon, { count: existing.count + 1, totalRevenue: existing.totalRevenue + r.addonTotal / addons.length });
    });
  });
  return Array.from(map.entries())
    .map(([addon, vals]) => ({ addon, count: vals.count, revenue: Math.round(vals.totalRevenue) }))
    .sort((a, b) => b.count - a.count);
}

export function getPriceVsQuantity(data: SalesRecord[]) {
  // Sample for scatter performance
  const sampled = data.length > 500
    ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
    : data;
  return sampled.map(r => ({
    unitPrice: r.unitPrice,
    quantity: r.quantity,
    totalPrice: r.totalPrice,
    product: r.productType,
  }));
}

export function getOrderStatusTrend(data: SalesRecord[]) {
  const map = new Map<string, { completed: number; cancelled: number; processing: number; shipped: number }>();
  data.forEach(r => {
    const d = r.purchaseDate.slice(0, 7); // YYYY-MM
    const existing = map.get(d) || { completed: 0, cancelled: 0, processing: 0, shipped: 0 };
    if (r.orderStatus === 'Completed') existing.completed++;
    else if (r.orderStatus === 'Cancelled') existing.cancelled++;
    else if (r.orderStatus === 'Processing') existing.processing++;
    else if (r.orderStatus === 'Shipped') existing.shipped++;
    map.set(d, existing);
  });
  return Array.from(map.entries())
    .map(([month, vals]) => ({ month, ...vals }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getCancellationByProduct(data: SalesRecord[]) {
  const map = new Map<string, { total: number; cancelled: number }>();
  data.forEach(r => {
    const existing = map.get(r.productType) || { total: 0, cancelled: 0 };
    existing.total++;
    if (r.orderStatus === 'Cancelled') existing.cancelled++;
    map.set(r.productType, existing);
  });
  return Array.from(map.entries())
    .map(([product, vals]) => ({
      product,
      rate: vals.total > 0 ? parseFloat(((vals.cancelled / vals.total) * 100).toFixed(1)) : 0,
      total: vals.total,
      cancelled: vals.cancelled
    }))
    .sort((a, b) => b.rate - a.rate);
}

export function getClvDistribution(data: SalesRecord[]) {
  const customerMap = new Map<string, number>();
  data.forEach(r => {
    customerMap.set(r.customerID, (customerMap.get(r.customerID) || 0) + r.totalPrice);
  });
  const brackets = {
    '0-500': 0, '501-1000': 0, '1001-2000': 0, '2001-5000': 0, '5000+': 0
  };
  Array.from(customerMap.values()).forEach(clv => {
    if (clv <= 500) brackets['0-500']++;
    else if (clv <= 1000) brackets['501-1000']++;
    else if (clv <= 2000) brackets['1001-2000']++;
    else if (clv <= 5000) brackets['2001-5000']++;
    else brackets['5000+']++;
  });
  return Object.entries(brackets).map(([range, count]) => ({ range, count }));
}

export function getLoyaltyFunnel(data: SalesRecord[]) {
  const customerMap = new Map<string, { orders: number; revenue: number; isLoyal: boolean }>();
  data.forEach(r => {
    const existing = customerMap.get(r.customerID) || { orders: 0, revenue: 0, isLoyal: false };
    existing.orders += 1;
    existing.revenue += r.totalPrice;
    if (r.loyaltyMember === 'Yes') existing.isLoyal = true;
    customerMap.set(r.customerID, existing);
  });
  
  const customers = Array.from(customerMap.values());
  const allCustomers = customers.length;
  const repeatCustomers = customers.filter(c => c.orders > 1).length;
  const loyaltyMembers = customers.filter(c => c.isLoyal).length;
  const highValue = customers.filter(c => c.revenue > 2000).length;

  return [
    { stage: 'All Customers', count: allCustomers },
    { stage: 'Repeat Customers', count: repeatCustomers },
    { stage: 'Loyalty Members', count: loyaltyMembers },
    { stage: 'High Value (>2k)', count: highValue },
  ];
}

export function getRepeatPurchaseDistribution(data: SalesRecord[]) {
  const customerMap = new Map<string, number>();
  data.forEach(r => {
    customerMap.set(r.customerID, (customerMap.get(r.customerID) || 0) + 1);
  });
  const brackets = { '1 Purchase': 0, '2 Purchases': 0, '3 Purchases': 0, '4+ Purchases': 0 };
  Array.from(customerMap.values()).forEach(count => {
    if (count === 1) brackets['1 Purchase']++;
    else if (count === 2) brackets['2 Purchases']++;
    else if (count === 3) brackets['3 Purchases']++;
    else brackets['4+ Purchases']++;
  });
  return Object.entries(brackets).map(([purchases, count]) => ({ purchases, count }));
}

export function getCustomerRecency(data: SalesRecord[]) {
  const customerMap = new Map<string, string>();
  let maxDate = '';
  data.forEach(r => {
    if (r.purchaseDate > maxDate) maxDate = r.purchaseDate;
    const existing = customerMap.get(r.customerID) || '';
    if (r.purchaseDate > existing) customerMap.set(r.customerID, r.purchaseDate);
  });
  
  const maxTime = new Date(maxDate).getTime();
  const brackets = { '0-30 days': 0, '31-60 days': 0, '61-90 days': 0, '90+ days': 0 };
  
  Array.from(customerMap.values()).forEach(lastDate => {
    const diffTime = Math.abs(maxTime - new Date(lastDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) brackets['0-30 days']++;
    else if (diffDays <= 60) brackets['31-60 days']++;
    else if (diffDays <= 90) brackets['61-90 days']++;
    else brackets['90+ days']++;
  });
  return Object.entries(brackets).map(([range, count]) => ({ range, count }));
}

export function getProductPareto(data: SalesRecord[]) {
  const map = new Map<string, number>();
  data.forEach(r => {
    map.set(r.productType, (map.get(r.productType) || 0) + r.totalPrice);
  });
  const sorted = Array.from(map.entries())
    .map(([product, revenue]) => ({ product, revenue: Math.round(revenue) }))
    .sort((a, b) => b.revenue - a.revenue);
    
  let totalRevenue = sorted.reduce((sum, item) => sum + item.revenue, 0);
  let cumulative = 0;
  
  return sorted.map(item => {
    cumulative += item.revenue;
    return {
      ...item,
      cumulativePct: totalRevenue > 0 ? Math.round((cumulative / totalRevenue) * 100) : 0
    };
  });
}

export function getPriceTierPerformance(data: SalesRecord[]) {
  const brackets = {
    'Low (<$500)': { revenue: 0, quantity: 0, ratingSum: 0, count: 0 },
    'Medium ($500-$1000)': { revenue: 0, quantity: 0, ratingSum: 0, count: 0 },
    'Premium (>$1000)': { revenue: 0, quantity: 0, ratingSum: 0, count: 0 }
  };
  
  data.forEach(r => {
    let tier = '';
    if (r.unitPrice < 500) tier = 'Low (<$500)';
    else if (r.unitPrice <= 1000) tier = 'Medium ($500-$1000)';
    else tier = 'Premium (>$1000)';
    
    brackets[tier].revenue += r.totalPrice;
    brackets[tier].quantity += r.quantity;
    brackets[tier].ratingSum += r.rating;
    brackets[tier].count += 1;
  });
  
  return Object.entries(brackets).map(([tier, vals]) => ({
    tier,
    revenue: Math.round(vals.revenue),
    quantity: vals.quantity,
    avgRating: vals.count > 0 ? Number((vals.ratingSum / vals.count).toFixed(2)) : 0
  }));
}

export function getAddonAttachmentRate(data: SalesRecord[]) {
  let ordersWithAddon = 0;
  data.forEach(r => {
    if (r.addonsPurchased && r.addonsPurchased.toLowerCase() !== 'none' && r.addonsPurchased.trim() !== '') {
      ordersWithAddon++;
    }
  });
  const total = data.length;
  const rate = total > 0 ? (ordersWithAddon / total) * 100 : 0;
  
  return {
    withAddon: ordersWithAddon,
    withoutAddon: total - ordersWithAddon,
    rate: Math.round(rate * 10) / 10
  };
}

export function getShippingEfficiency(data: SalesRecord[]) {
  const map = new Map<string, { orders: number; revenue: number; cancelled: number }>();
  data.forEach(r => {
    const existing = map.get(r.shippingType) || { orders: 0, revenue: 0, cancelled: 0 };
    existing.orders++;
    existing.revenue += r.totalPrice;
    if (r.orderStatus === 'Cancelled') existing.cancelled++;
    map.set(r.shippingType, existing);
  });
  
  return Array.from(map.entries()).map(([shipping, vals]) => ({
    shipping,
    orderCount: vals.orders,
    avgOrderValue: vals.orders > 0 ? Math.round(vals.revenue / vals.orders) : 0,
    cancellationRate: vals.orders > 0 ? Math.round((vals.cancelled / vals.orders) * 100) : 0
  }));
}

export function getUniqueValues(data: SalesRecord[], key: keyof SalesRecord): string[] {
  const set = new Set<string>();
  data.forEach(r => {
    const val = String(r[key] || '').trim();
    if (val && val.toLowerCase() !== 'null') set.add(val);
  });
  return Array.from(set).sort();
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function generateDataSummary(data: SalesRecord[], filters: any): string {
  const kpis = calculateKPIs(data);
  const productSales = getSalesByProductType(data);
  const paymentDist = getPaymentMethodDistribution(data);
  const statusDist = getOrderStatusDistribution(data);

  const activeFilters = Object.entries(filters)
    .filter(([_, v]) => v !== 'All' && v !== '' && !(Array.isArray(v) && v.every((x: any) => x === '')))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' to ') : v}`)
    .join(', ');

  return `
ELECTRONICS SALES DATA SUMMARY (Sep 2023 - Sep 2024)
=====================================================
Records: ${data.length} transactions
Active Filters: ${activeFilters || 'None'}

KEY METRICS:
- Total Revenue: $${kpis.totalRevenue.toLocaleString()}
- Total Orders: ${kpis.totalOrders.toLocaleString()}
- Average Rating: ${kpis.avgRating}/5
- Unique Customers: ${kpis.totalCustomers.toLocaleString()}
- Loyalty Members: ${kpis.loyaltyRatio}%
- Average Order Value: $${kpis.avgOrderValue}

SALES BY PRODUCT:
${productSales.map(p => `- ${p.product}: $${p.revenue.toLocaleString()} (${p.orders} orders, avg rating: ${p.avgRating})`).join('\n')}

PAYMENT METHODS:
${paymentDist.map(p => `- ${p.name}: ${p.value} orders`).join('\n')}

ORDER STATUS:
${statusDist.map(s => `- ${s.name}: ${s.value} orders`).join('\n')}

DATE RANGE: ${data.length > 0 ? data.reduce((min, r) => r.purchaseDate < min ? r.purchaseDate : min, data[0].purchaseDate) : 'N/A'} to ${data.length > 0 ? data.reduce((max, r) => r.purchaseDate > max ? r.purchaseDate : max, data[0].purchaseDate) : 'N/A'}
`.trim();
}

export function exportToCSV(data: SalesRecord[], filename: string = 'export.csv') {
  const headers = ['Customer ID', 'Age', 'Gender', 'Loyalty Member', 'Product Type', 'SKU', 'Rating', 'Order Status', 'Payment Method', 'Total Price', 'Unit Price', 'Quantity', 'Purchase Date', 'Shipping Type', 'Add-ons Purchased', 'Add-on Total'];
  const rows = data.map(r => [
    r.customerID, r.age, r.gender, r.loyaltyMember, r.productType, r.sku, r.rating, r.orderStatus, r.paymentMethod, r.totalPrice, r.unitPrice, r.quantity, r.purchaseDate, r.shippingType, r.addonsPurchased, r.addonTotal,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
