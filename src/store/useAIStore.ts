import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '../types';

interface AIStore {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  messages: ChatMessage[];
  isChatOpen: boolean;
  isSettingsOpen: boolean;
  
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
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
      temperature: 0.7,
      maxTokens: 500,
      messages: [],
      isChatOpen: false,
      isSettingsOpen: false,

      setApiKey: (key) => set({ apiKey: key }),
      setModel: (model) => set({ model }),
      setTemperature: (temp) => set({ temperature: temp }),
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
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
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        messages: state.messages,
      }),
    }
  )
);
