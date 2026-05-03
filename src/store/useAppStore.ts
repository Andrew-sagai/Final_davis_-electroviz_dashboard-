import { create } from 'zustand';
import type { SalesRecord, FilterState, ChatMessage } from '../types';

interface AppState {
  // Dataset
  rawData: SalesRecord[];
  filteredData: SalesRecord[];
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: FilterState;

  // Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isChatLoading: boolean;

  // Theme
  isDarkMode: boolean;
  isSimpleMode: boolean;

  // Actions
  setRawData: (data: SalesRecord[]) => void;
  setFilteredData: (data: SalesRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatOpen: (open: boolean) => void;
  setChatLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  toggleSimpleMode: () => void;
}

const defaultFilters: FilterState = {
  dateRange: ['', ''],
  productType: 'All',
  gender: 'All',
  loyaltyMember: 'All',
  paymentMethod: 'All',
  orderStatus: 'All',
};

export const useAppStore = create<AppState>((set, get) => ({
  rawData: [],
  filteredData: [],
  isLoading: true,
  error: null,
  filters: { ...defaultFilters },
  chatMessages: [],
  isChatOpen: false,
  isChatLoading: false,
  isDarkMode: true,
  isSimpleMode: false,

  setRawData: (data) => set({ rawData: data, filteredData: data }),
  setFilteredData: (data) => set({ filteredData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  setFilter: (key, value) => {
    const newFilters = { ...get().filters, [key]: value };
    set({ filters: newFilters });
    // Apply filters
    const raw = get().rawData;
    const filtered = applyFilters(raw, newFilters);
    set({ filteredData: filtered });
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters }, filteredData: get().rawData });
  },

  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  setChatOpen: (open) => set({ isChatOpen: open }),
  setChatLoading: (loading) => set({ isChatLoading: loading }),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleSimpleMode: () => set((state) => ({ isSimpleMode: !state.isSimpleMode })),
}));

function applyFilters(data: SalesRecord[], filters: FilterState): SalesRecord[] {
  return data.filter((row) => {
    if (filters.productType !== 'All' && row.productType !== filters.productType) return false;
    if (filters.gender !== 'All' && row.gender !== filters.gender) return false;
    if (filters.loyaltyMember !== 'All' && row.loyaltyMember !== filters.loyaltyMember) return false;
    if (filters.paymentMethod !== 'All' && row.paymentMethod !== filters.paymentMethod) return false;
    if (filters.orderStatus !== 'All' && row.orderStatus !== filters.orderStatus) return false;

    if (filters.dateRange[0] && filters.dateRange[1]) {
      const d = new Date(row.purchaseDate);
      const start = new Date(filters.dateRange[0]);
      const end = new Date(filters.dateRange[1]);
      if (d < start || d > end) return false;
    }

    return true;
  });
}
