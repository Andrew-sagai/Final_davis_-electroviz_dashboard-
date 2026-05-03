import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { getUniqueValues } from '../../utils/analytics';
import { Filter, Calendar, X } from 'lucide-react';

export default function FilterPanel() {
  const { rawData, filters, setFilter, resetFilters, filteredData } = useAppStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (rawData.length === 0) return null;

  const productTypes = getUniqueValues(rawData, 'productType');
  const genders = getUniqueValues(rawData, 'gender');
  const paymentMethods = getUniqueValues(rawData, 'paymentMethod');
  const orderStatuses = getUniqueValues(rawData, 'orderStatus');
  const loyaltyOptions = ['Yes', 'No'];

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => v !== 'All' && !(Array.isArray(v) && v.every((x: any) => !x))
  );

  const inputStyle = {
    minWidth: isScrolled ? 100 : 130,
    fontSize: isScrolled ? 10 : 11,
    padding: isScrolled ? '4px 8px' : '6px 12px',
    height: isScrolled ? 26 : 32,
    transition: 'all 0.3s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
      style={{ 
        padding: isScrolled ? '8px 16px' : '16px 20px', 
        marginBottom: 24,
        position: 'sticky',
        top: 76, // Below navbar
        zIndex: 40,
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.8), var(--shadow-glow-red)' : 'var(--shadow-base), var(--shadow-glow-red)',
        display: 'flex',
        flexDirection: isScrolled ? 'row' : 'column',
        alignItems: isScrolled ? 'center' : 'stretch',
        gap: isScrolled ? 16 : 0,
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: isScrolled ? 0 : 12, 
        width: isScrolled ? 'auto' : '100%',
        minWidth: isScrolled ? 'max-content' : 'auto',
        transition: 'all 0.3s ease' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} color="var(--accent-1)" />
          {!isScrolled && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Filters</span>}
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 20,
            background: 'rgba(255, 42, 75, 0.1)', color: 'var(--accent-red)',
            whiteSpace: 'nowrap'
          }}>
            {filteredData.length.toLocaleString()} {isScrolled ? '' : 'results'}
          </span>
        </div>
        {hasActiveFilters && !isScrolled && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            style={{
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 6, padding: '4px 10px', color: '#f43f5e',
              cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <X size={12} /> Clear All
          </motion.button>
        )}
      </div>

      <div style={{ display: 'flex', gap: isScrolled ? 6 : 10, flexWrap: 'wrap', alignItems: 'center', flex: 1, width: '100%', transition: 'all 0.3s ease' }}>
        {/* Date Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={isScrolled ? 10 : 12} color="var(--text-muted)" style={{ transition: 'all 0.3s ease' }} />
          <input
            type="date"
            value={filters.dateRange[0]}
            onChange={(e) => setFilter('dateRange', [e.target.value, filters.dateRange[1]])}
            className="filter-select"
            style={inputStyle}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: isScrolled ? 10 : 11, transition: 'all 0.3s ease' }}>to</span>
          <input
            type="date"
            value={filters.dateRange[1]}
            onChange={(e) => setFilter('dateRange', [filters.dateRange[0], e.target.value])}
            className="filter-select"
            style={inputStyle}
          />
        </div>

        <select className="filter-select" value={filters.productType} onChange={(e) => setFilter('productType', e.target.value)} style={inputStyle}>
          <option value="All">All Products</option>
          {productTypes.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="filter-select" value={filters.gender} onChange={(e) => setFilter('gender', e.target.value)} style={inputStyle}>
          <option value="All">All Genders</option>
          {genders.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select className="filter-select" value={filters.loyaltyMember} onChange={(e) => setFilter('loyaltyMember', e.target.value)} style={inputStyle}>
          <option value="All">All Loyalty</option>
          {loyaltyOptions.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select className="filter-select" value={filters.paymentMethod} onChange={(e) => setFilter('paymentMethod', e.target.value)} style={inputStyle}>
          <option value="All">All Payments</option>
          {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="filter-select" value={filters.orderStatus} onChange={(e) => setFilter('orderStatus', e.target.value)} style={inputStyle}>
          <option value="All">All Status</option>
          {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {hasActiveFilters && isScrolled && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetFilters}
          style={{
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: 6, padding: '4px 10px', color: '#f43f5e',
            cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
            whiteSpace: 'nowrap'
          }}
        >
          <X size={12} /> Clear
        </motion.button>
      )}
    </motion.div>
  );
}
