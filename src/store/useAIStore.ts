import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '../types';

interface AIStore {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  isChatOpen: boolean;
  isSettingsOpen: boolean;
  
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  setChatOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      apiKey: '',
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [],
      isChatOpen: false,
      isSettingsOpen: false,

      setApiKey: (key) => set({ apiKey: key }),
      setModel: (model) => set({ model }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
      setChatOpen: (open) => set({ isChatOpen: open }),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
    }),
    {
      name: 'ai-assistant-store',
      partialize: (state) => ({
        apiKey: state.apiKey,
        model: state.model,
        messages: state.messages,
      }),
    }
  )
);
